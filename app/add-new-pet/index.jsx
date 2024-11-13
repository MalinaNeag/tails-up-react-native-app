import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Colors from './../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddNewPet() {
    const navigation = useNavigation();
    const router = useRouter();
    const { user } = useUser();

    const [formData, setFormData] = useState({ category: 'Dogs', sex: 'Male' });
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Dogs');
    const [gender, setGender] = useState('Male');
    const [image, setImage] = useState(null);
    const [loader, setLoader] = useState(false);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const showToast = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert(message);
        }
    };

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'Add New Pet' });
        getCategories();
    }, []);

    const getCategories = async () => {
        setIsCategoryLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'Category'));
            const categories = snapshot.docs.map(doc => doc.data());
            setCategoryList(categories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            showToast("Failed to load categories");
        } finally {
            setIsCategoryLoading(false);
        }
    };

    const imagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));
    };

    const validateForm = () => {
        const requiredFields = ["name", "category", "breed", "age", "sex", "weight", "address", "about"];
        for (const field of requiredFields) {
            if (!formData[field]) return false;
        }
        return true;
    };

    const onSubmit = () => {
        if (!validateForm()) {
            showToast('Enter All Details');
            return;
        }
        uploadImage();
    };

    const uploadImage = async () => {
        if (!image) {
            showToast("Please select an image");
            return;
        }

        try {
            setLoader(true);
            const response = await fetch(image);
            const blobImage = await response.blob();
            const storageRef = ref(storage, `pets/${Date.now()}.jpg`);

            await uploadBytes(storageRef, blobImage);
            const downloadUrl = await getDownloadURL(storageRef);
            await saveFormData(downloadUrl);
        } catch (error) {
            console.error("Image upload error:", error);
            showToast("Failed to upload image");
        } finally {
            setLoader(false);
        }
    };

    const saveFormData = async (imageUrl) => {
        const docId = Date.now().toString();
        try {
            await setDoc(doc(db, 'Pets', docId), {
                ...formData,
                imageUrl,
                username: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress,
                userImage: user?.imageUrl,
                id: docId
            });
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error("Failed to save form data:", error);
            showToast("Failed to save pet information");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView style={{ padding: 20 }}>
                <Text style={{ fontFamily: 'roboto-medium', fontSize: 20 }}>Add New Pet</Text>

                <Pressable onPress={imagePicker}>
                    {!image ? (
                        <Image source={require('./../../assets/images/placeholder.png')}
                               style={{ width: 100, height: 100, borderRadius: 15, borderWidth: 1, borderColor: Colors.GRAY }}
                        />
                    ) : (
                        <Image source={{ uri: image }}
                               style={{ width: 100, height: 100, borderRadius: 15 }}
                        />
                    )}
                </Pressable>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Name *</Text>
                    <TextInput style={styles.input} onChangeText={(value) => handleInputChange('name', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Category *</Text>
                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.input}
                        onValueChange={(itemValue) => {
                            setSelectedCategory(itemValue);
                            handleInputChange('category', itemValue);
                        }}
                    >
                        {categoryList.map((category, index) => (
                            <Picker.Item key={index} label={category.name} value={category.name} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Breed *</Text>
                    <TextInput style={styles.input} onChangeText={(value) => handleInputChange('breed', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age *</Text>
                    <TextInput style={styles.input} keyboardType='number-pad' onChangeText={(value) => handleInputChange('age', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender *</Text>
                    <Picker
                        selectedValue={gender}
                        style={styles.input}
                        onValueChange={(itemValue) => {
                            setGender(itemValue);
                            handleInputChange('sex', itemValue);
                        }}
                    >
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weight *</Text>
                    <TextInput style={styles.input} keyboardType='number-pad' onChangeText={(value) => handleInputChange('weight', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address *</Text>
                    <TextInput style={styles.input} onChangeText={(value) => handleInputChange('address', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>About *</Text>
                    <TextInput style={styles.input} numberOfLines={5} multiline={true} onChangeText={(value) => handleInputChange('about', value)} />
                </View>

                <TouchableOpacity style={styles.button} disabled={loader} onPress={onSubmit}>
                    {loader ? <ActivityIndicator size={'large'} /> : (
                        <Text style={{ fontFamily: 'roboto-medium', textAlign: 'center' }}>Submit</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    inputContainer: { marginVertical: 5 },
    input: { padding: 10, backgroundColor: Colors.WHITE, borderRadius: 7, fontFamily: 'roboto' },
    label: { marginVertical: 5, fontFamily: 'roboto' },
    button: { padding: 15, backgroundColor: Colors.PRIMARY, borderRadius: 7, marginVertical: 10, marginBottom: 50 }
});
