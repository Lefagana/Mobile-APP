import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import {
  Text,
  useTheme,
  TextInput,
  Button,
  Card,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const EditProfile: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePic, setProfilePic] = useState<string | null>(user?.profile_pic || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Mock update mutation - in real app would call API
  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; email?: string; profile_pic?: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      navigation.goBack();
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    updateMutation.mutate({
      name: name.trim(),
      email: email.trim() || undefined,
      profile_pic: profilePic || undefined,
    });
  };

  const handleChangePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need camera roll permissions to change your profile photo!'
        );
        return;
      }

      // Show action sheet for camera or library
      Alert.alert(
        'Select Photo',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
              if (cameraStatus.status !== 'granted') {
                Alert.alert('Permission Denied', 'Camera permission is required!');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled && result.assets[0]) {
                handleImageSelected(result.assets[0].uri);
              }
            },
          },
          {
            text: 'Photo Library',
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled && result.assets[0]) {
                handleImageSelected(result.assets[0].uri);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleImageSelected = async (uri: string) => {
    setUploadingPhoto(true);
    try {
      // In a real app, upload the image to a storage service first
      // For now, we'll just update the local state
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock: In real app, this would be the uploaded image URL
      const uploadedUrl = uri; // In production, this would come from the upload API
      setProfilePic(uploadedUrl);
      
      // Optionally update the user context immediately
      // This would typically be done after the mutation succeeds
      Alert.alert('Success', 'Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <Card style={[styles.photoCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.photoContainer}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={120}
                source={{
                  uri: profilePic || user?.profile_pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
                }}
                style={styles.avatar}
              />
              {uploadingPhoto && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </View>
            <Button
              mode="outlined"
              icon="camera"
              onPress={handleChangePhoto}
              style={styles.changePhotoButton}
              disabled={uploadingPhoto}
              loading={uploadingPhoto}
            >
              {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
            </Button>
          </View>
        </Card>

        {/* Form Fields */}
        <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            editable={false}
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Phone number cannot be changed. Contact support if you need to update it.
          </Text>
        </Card>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={updateMutation.isPending}
          disabled={!name.trim() || updateMutation.isPending}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  photoCard: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#F5F5F5',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    marginTop: 8,
  },
  formCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
});

export default EditProfile;

