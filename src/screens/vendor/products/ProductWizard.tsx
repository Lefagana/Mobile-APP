import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, ProgressBar, useTheme, IconButton } from 'react-native-paper';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { useVendor } from '../../../contexts/VendorContext';
import type { StackScreenProps } from '@react-navigation/stack';
import type { VendorStackParamList } from '../../../navigation/types';

// Steps
import BasicInfoStep from './steps/BasicInfoStep';
import PricingStep from './steps/PricingStep';
import MediaStep from './steps/MediaStep';
import InventoryStep from './steps/InventoryStep';
import VariantsStep from './steps/VariantsStep';
import ShippingStep from './steps/ShippingStep';
import ReviewStep from './steps/ReviewStep';

type Props = StackScreenProps<VendorStackParamList, 'ProductForm'>;

const productSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).optional(),

    price: z.number().min(0, 'Price must be positive'),
    compare_at_price: z.number().optional(),
    cost_price: z.number().optional(),

    images: z.array(z.string()).min(1, 'At least one image is required'),
    video: z.string().optional(),

    sku: z.string().min(1, 'SKU is required'),
    barcode: z.string().optional(),
    track_quantity: z.boolean(),
    quantity: z.number().min(0),
    low_stock_threshold: z.number().min(0),
    allow_backorders: z.boolean(),

    has_variants: z.boolean(),
    variants: z.array(z.any()).optional(),

    requires_shipping: z.boolean(),
    weight_kg: z.number().optional(),
    dimensions: z.object({
        length_cm: z.number(),
        width_cm: z.number(),
        height_cm: z.number(),
    }).optional(),
    is_fragile: z.boolean(),

    status: z.enum(['active', 'draft', 'inactive']),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Step-specific validation schemas
const stepSchemas = [
    // Step 0: Basic Info
    z.object({
        title: z.string().min(3, 'Title must be at least 3 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        category: z.string().min(1, 'Category is required'),
    }),
    // Step 1: Pricing
    z.object({
        price: z.number().min(0, 'Price must be positive'),
    }),
    // Step 2: Media
    z.object({
        images: z.array(z.string()).min(1, 'At least one image is required'),
    }),
    // Step 3: Inventory
    z.object({
        sku: z.string().min(1, 'SKU is required'),
    }),
    // Step 4: Variants (optional step)
    z.object({}),
    // Step 5: Shipping (optional step)
    z.object({}),
    // Step 6: Review (no validation needed)
    z.object({}),
];

const STEPS = [
    { id: 'basic', title: 'Basic Info', component: BasicInfoStep },
    { id: 'pricing', title: 'Pricing', component: PricingStep },
    { id: 'media', title: 'Media', component: MediaStep },
    { id: 'inventory', title: 'Inventory', component: InventoryStep },
    { id: 'variants', title: 'Variants', component: VariantsStep },
    { id: 'shipping', title: 'Shipping', component: ShippingStep },
    { id: 'review', title: 'Review', component: ReviewStep },
];

export default function ProductWizard({ route, navigation }: Props) {
    const theme = useTheme();
    const { addProduct, updateProduct } = useVendor();
    const { mode, productId } = route.params;
    const isEdit = mode === 'edit';

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const methods = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            tags: [],
            price: 0,
            images: [],
            sku: `SKU-${Date.now()}`,
            track_quantity: true,
            quantity: 0,
            low_stock_threshold: 5,
            allow_backorders: false,
            has_variants: false,
            variants: [],
            requires_shipping: true,
            is_fragile: false,
            status: 'active',
            dimensions: { length_cm: 0, width_cm: 0, height_cm: 0 },
        },
        mode: 'onChange',
    });

    const handleNext = async () => {
        const isLastStep = currentStep === STEPS.length - 1;

        if (isLastStep) {
            await methods.handleSubmit(onSubmit)();
        } else {
            // Validate only current step fields
            const stepSchema = stepSchemas[currentStep];
            const formValues = methods.getValues();
            
            try {
                stepSchema.parse(formValues);
                // If validation passes, move to next step
                setCurrentStep(prev => prev + 1);
            } catch (error) {
                // Trigger validation to show errors for current step fields
                if (currentStep === 0) {
                    await methods.trigger(['title', 'description', 'category']);
                } else if (currentStep === 1) {
                    await methods.trigger(['price']);
                } else if (currentStep === 2) {
                    await methods.trigger(['images']);
                } else if (currentStep === 3) {
                    await methods.trigger(['sku']);
                } else {
                    // For optional steps (variants, shipping, review), allow proceeding
                    setCurrentStep(prev => prev + 1);
                }
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigation.goBack();
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        setLoading(true);
        try {
            if (isEdit && productId) {
                await updateProduct(productId, data);
                Alert.alert('Success', 'Product updated successfully');
            } else {
                await addProduct(data);
                Alert.alert('Success', 'Product created successfully');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            // Get current form values without full validation
            const formValues = methods.getValues();
            const draftData = {
                ...formValues,
                status: 'draft' as const,
                // Ensure required fields have defaults if empty
                title: formValues.title || 'Untitled Product',
                description: formValues.description || '',
                category: formValues.category || 'other',
                price: formValues.price || 0,
                images: formValues.images || [],
                sku: formValues.sku || `SKU-${Date.now()}`,
            };
            
            if (isEdit && productId) {
                await updateProduct(productId, draftData as ProductFormData);
                Alert.alert('Success', 'Draft saved successfully');
            } else {
                await addProduct(draftData as ProductFormData);
                Alert.alert('Success', 'Draft saved successfully');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save draft');
        } finally {
            setLoading(false);
        }
    };

    const CurrentStepComponent = STEPS[currentStep].component;
    const progress = (currentStep + 1) / STEPS.length;

    return (
        <ScreenContainer scrollable={false}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={handleBack} />
                <View style={{ flex: 1 }}>
                    <Text variant="titleMedium">{isEdit ? 'Edit Product' : 'New Product'}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
                    </Text>
                </View>
                <Button
                    mode="text"
                    onPress={handleSaveDraft}
                    disabled={loading}
                >
                    Save Draft
                </Button>
            </View>

            <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progress} />

            <View style={styles.content}>
                <FormProvider {...methods}>
                    <CurrentStepComponent />
                </FormProvider>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="outlined"
                    onPress={handleBack}
                    style={styles.footerBtn}
                    disabled={loading}
                >
                    {currentStep === 0 ? 'Cancel' : 'Back'}
                </Button>
                <Button
                    mode="contained"
                    onPress={handleNext}
                    style={styles.footerBtn}
                    loading={loading}
                    disabled={loading}
                >
                    {currentStep === STEPS.length - 1 ? 'Publish Product' : 'Next'}
                </Button>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    progress: {
        height: 4,
    },
    content: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 12,
    },
    footerBtn: {
        flex: 1,
    },
});
