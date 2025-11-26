import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, HelperText, Card, List, IconButton, Chip, useTheme, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { VendorStackParamList } from '../../../navigation/types';
import { useVendor } from '../../../contexts/VendorContext';
import { KYCDocument } from '../../../types/vendor';
import * as ImagePicker from 'expo-image-picker';

type Nav = StackNavigationProp<VendorStackParamList, 'KYCUpload'>;

type DocumentType = KYCDocument['type'];

const DOCUMENT_TYPES: Array<{ type: DocumentType; label: string; required: boolean }> = [
    { type: 'national_id', label: 'National ID', required: true },
    { type: 'drivers_license', label: "Driver's License", required: false },
    { type: 'passport', label: 'International Passport', required: false },
    { type: 'voters_card', label: "Voter's Card", required: false },
    { type: 'proof_of_address', label: 'Proof of Address', required: true },
    { type: 'cac_certificate', label: 'CAC Certificate', required: false },
    { type: 'tax_clearance', label: 'Tax Clearance', required: false },
    { type: 'business_license', label: 'Business License', required: false },
    { type: 'bank_statement', label: 'Bank Statement', required: false },
];

const KYCUpload: React.FC = () => {
    const navigation = useNavigation<Nav>();
    const theme = useTheme();
    const { vendor, updateVendorProfile } = useVendor();

    const [documents, setDocuments] = useState<KYCDocument[]>(vendor?.kyc_documents || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasDocument = (type: DocumentType) => {
        return documents.some(doc => doc.type === type);
    };

    const getDocumentStatus = (type: DocumentType): KYCDocument | undefined => {
        return documents.find(doc => doc.type === type);
    };

    const handlePickDocument = async (type: DocumentType) => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant permission to access your photos.');
                return;
            }

            // Pick image
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                base64: false,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];

                // Create document object
                const newDocument: KYCDocument = {
                    id: `doc_${Date.now()}`,
                    type,
                    url: asset.uri,
                    file_name: `${type}_${Date.now()}.jpg`,
                    file_size: asset.fileSize || 0,
                    status: 'pending',
                    uploaded_at: new Date().toISOString(),
                };

                // Add or replace document
                setDocuments(prev => {
                    const filtered = prev.filter(doc => doc.type !== type);
                    return [...filtered, newDocument];
                });

                Alert.alert('Success', 'Document uploaded successfully!');
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to upload document. Please try again.');
        }
    };

    const handleTakePhoto = async (type: DocumentType) => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant permission to access your camera.');
                return;
            }

            // Take photo
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];

                // Create document object
                const newDocument: KYCDocument = {
                    id: `doc_${Date.now()}`,
                    type,
                    url: asset.uri,
                    file_name: `${type}_${Date.now()}.jpg`,
                    file_size: asset.fileSize || 0,
                    status: 'pending',
                    uploaded_at: new Date().toISOString(),
                };

                // Add or replace document
                setDocuments(prev => {
                    const filtered = prev.filter(doc => doc.type !== type);
                    return [...filtered, newDocument];
                });

                Alert.alert('Success', 'Document captured successfully!');
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to capture photo. Please try again.');
        }
    };

    const handleDeleteDocument = (documentId: string) => {
        Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this document?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
                    },
                },
            ]
        );
    };

    const handleSubmit = async () => {
        // Check if required documents are uploaded
        const requiredTypes = DOCUMENT_TYPES.filter(dt => dt.required).map(dt => dt.type);
        const uploadedTypes = documents.map(doc => doc.type);
        const missingRequired = requiredTypes.filter(type => !uploadedTypes.includes(type));

        if (missingRequired.length > 0) {
            Alert.alert(
                'Missing Documents',
                'Please upload all required documents (National ID and Proof of Address).'
            );
            return;
        }

        try {
            setIsSubmitting(true);

            await updateVendorProfile({
                kyc_documents: documents,
                kyc_status: 'pending',
            } as any);

            Alert.alert(
                'Documents Submitted',
                'Your KYC documents have been submitted for review. You will be notified once verified.',
                [
                    {
                        text: 'Go to Dashboard',
                        onPress: () => navigation.navigate('Dashboard'),
                    },
                ]
            );
        } catch (error) {
            console.error('Failed to submit documents:', error);
            Alert.alert('Error', 'Failed to submit documents. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        Alert.alert(
            'Skip KYC',
            'You can upload KYC documents later from your profile. Some features may be limited until verification is complete.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Skip',
                    onPress: () => navigation.navigate('Dashboard'),
                },
            ]
        );
    };

    const requiredCount = DOCUMENT_TYPES.filter(dt => dt.required).length;
    const uploadedRequiredCount = documents.filter(doc =>
        DOCUMENT_TYPES.find(dt => dt.type === doc.type)?.required
    ).length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>
                KYC Verification
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Upload documents to verify your identity
            </Text>

            <Card style={styles.progressCard}>
                <Card.Content>
                    <View style={styles.progressHeader}>
                        <Text variant="titleMedium">Upload Progress</Text>
                        <Chip>
                            {uploadedRequiredCount}/{requiredCount} Required
                        </Chip>
                    </View>
                    <Text variant="bodySmall" style={styles.progressText}>
                        {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
                    </Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Required Documents
                    </Text>

                    {DOCUMENT_TYPES.filter(dt => dt.required).map(docType => {
                        const doc = getDocumentStatus(docType.type);
                        return (
                            <List.Item
                                key={docType.type}
                                title={docType.label}
                                description={doc ? `Uploaded • ${doc.status}` : 'Not uploaded'}
                                left={props => (
                                    <List.Icon
                                        {...props}
                                        icon={doc ? 'check-circle' : 'file-document-outline'}
                                        color={doc ? theme.colors.primary : theme.colors.outline}
                                    />
                                )}
                                right={props =>
                                    doc ? (
                                        <IconButton
                                            {...props}
                                            icon="delete"
                                            onPress={() => handleDeleteDocument(doc.id)}
                                        />
                                    ) : (
                                        <View style={styles.uploadButtons}>
                                            <IconButton
                                                icon="camera"
                                                onPress={() => handleTakePhoto(docType.type)}
                                            />
                                            <IconButton
                                                icon="file-upload"
                                                onPress={() => handlePickDocument(docType.type)}
                                            />
                                        </View>
                                    )
                                }
                                style={styles.listItem}
                            />
                        );
                    })}
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Optional Documents
                    </Text>
                    <Text variant="bodySmall" style={styles.helperText}>
                        Upload these for faster verification
                    </Text>

                    {DOCUMENT_TYPES.filter(dt => !dt.required).map(docType => {
                        const doc = getDocumentStatus(docType.type);
                        return (
                            <List.Item
                                key={docType.type}
                                title={docType.label}
                                description={doc ? `Uploaded • ${doc.status}` : 'Optional'}
                                left={props => (
                                    <List.Icon
                                        {...props}
                                        icon={doc ? 'check-circle' : 'file-document-outline'}
                                        color={doc ? theme.colors.primary : theme.colors.outline}
                                    />
                                )}
                                right={props =>
                                    doc ? (
                                        <IconButton
                                            {...props}
                                            icon="delete"
                                            onPress={() => handleDeleteDocument(doc.id)}
                                        />
                                    ) : (
                                        <View style={styles.uploadButtons}>
                                            <IconButton
                                                icon="camera"
                                                onPress={() => handleTakePhoto(docType.type)}
                                            />
                                            <IconButton
                                                icon="file-upload"
                                                onPress={() => handlePickDocument(docType.type)}
                                            />
                                        </View>
                                    )
                                }
                                style={styles.listItem}
                            />
                        );
                    })}
                </Card.Content>
            </Card>

            <Card style={styles.infoCard}>
                <Card.Content>
                    <List.Item
                        title="Document Requirements"
                        description="• Files must be JPEG, PNG, or PDF&#10;• Maximum file size: 5MB&#10;• Images must be clear and readable&#10;• All corners of document must be visible"
                        left={props => <List.Icon {...props} icon="information" />}
                    />
                </Card.Content>
            </Card>

            <View style={styles.actions}>
                <Button
                    mode="outlined"
                    onPress={handleSkip}
                    style={styles.skipButton}
                    disabled={isSubmitting}
                >
                    Skip for now
                </Button>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    loading={isSubmitting}
                    disabled={isSubmitting || uploadedRequiredCount < requiredCount}
                >
                    Submit for Review
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        marginBottom: 24,
    },
    progressCard: {
        marginBottom: 16,
        backgroundColor: '#E3F2FD',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        color: '#666',
    },
    card: {
        marginBottom: 16,
    },
    infoCard: {
        marginBottom: 16,
        backgroundColor: '#FFF3E0',
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: '600',
    },
    helperText: {
        color: '#666',
        marginBottom: 12,
    },
    listItem: {
        paddingVertical: 4,
    },
    uploadButtons: {
        flexDirection: 'row',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 32,
    },
    skipButton: {
        flex: 1,
    },
    submitButton: {
        flex: 2,
    },
});

export default KYCUpload;
