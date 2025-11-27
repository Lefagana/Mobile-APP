import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, IconButton, useTheme, HelperText } from 'react-native-paper';
import { useFormContext } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import type { ProductFormData } from '../ProductWizard';

export default function MediaStep() {
    const { watch, setValue, formState: { errors } } = useFormContext<ProductFormData>();
    const theme = useTheme();
    const images = watch('images') || [];

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            setValue('images', [...images, ...newImages], { shouldValidate: true });
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setValue('images', [...images, result.assets[0].uri], { shouldValidate: true });
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setValue('images', newImages, { shouldValidate: true });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Product Images</Text>
            <Text variant="bodySmall" style={styles.subtitle}>
                Add up to 10 images. The first image will be the cover image.
            </Text>

            <View style={styles.actionButtons}>
                <Button
                    mode="outlined"
                    icon="camera"
                    onPress={takePhoto}
                    style={styles.actionBtn}
                >
                    Take Photo
                </Button>
                <Button
                    mode="outlined"
                    icon="image-multiple"
                    onPress={pickImage}
                    style={styles.actionBtn}
                >
                    Select from Gallery
                </Button>
            </View>

            {errors.images && (
                <HelperText type="error" visible={true}>
                    {errors.images.message as string}
                </HelperText>
            )}

            <View style={styles.grid}>
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri }} style={styles.image} />
                        <View style={styles.overlay}>
                            {index === 0 && (
                                <View style={styles.coverBadge}>
                                    <Text variant="labelSmall" style={{ color: '#fff' }}>Cover</Text>
                                </View>
                            )}
                            <IconButton
                                icon="close-circle"
                                iconColor={theme.colors.error}
                                size={20}
                                style={styles.removeBtn}
                                onPress={() => removeImage(index)}
                            />
                        </View>
                    </View>
                ))}

                {images.length === 0 && (
                    <View style={[styles.imageContainer, styles.placeholder]}>
                        <IconButton icon="image-plus" size={40} iconColor="#ccc" />
                        <Text variant="bodySmall" style={{ color: '#999' }}>No images yet</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        marginBottom: 4,
        fontWeight: 'bold',
    },
    subtitle: {
        marginBottom: 16,
        opacity: 0.7,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    actionBtn: {
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageContainer: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: 4,
    },
    coverBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    removeBtn: {
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        margin: 0,
    },
});
