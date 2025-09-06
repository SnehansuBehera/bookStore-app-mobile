import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from "../../assets/styles/create-styles.js";
import COLORS from '../../constants/color.js';
import { useAuthStore } from '../../store/authStore.js';

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore();
  // console.log(token);


  const handleSubmit = async () => { 
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imagetype = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imagetype};base64,${imageBase64}`;
      console.log(title, caption, rating.toString());
      const response = await fetch("https://bookworm-5n78.onrender.com/api/books", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: imageDataUrl
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "Your book recommendations has been posted!");
      setCaption("");
      setImage(null);
      setRating(3)
      setTitle("");
      setImageBase64(null);
      router.push('/');
    } catch (error) {
      console.error("Error in submitting recommendation: ", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  
  const pickImage = async () => {
    try {
      //request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission denied", "We need camera roll permissions to upload an image");
          return;
        }
      }

      //launch the Library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
        quality: 0.5
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);

          // if base64 is provided use it.
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          //otherwise convert it to base64.
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64
          });
          setImageBase64(base64);
        }

      }
    } catch (error) {
      console.log("Error picking image: ", error)
      Alert.alert("Error", "There was a problem selecting your image");
    }
  }
  
  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++){
      stars.push(
      <TouchableOpacity key={i} onPress={()=>setRating(i)} style={styles.starButton}>
        <Ionicons
          name={i <= rating ? "star" : "star-outline"}
          size={32}
          color={i<=rating? "#f4b400": COLORS.textSecondary}
        />
        </TouchableOpacity>
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS==='ios'?'padding':'height'}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>

          {/* Heading */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Recommendations</Text>
            <Text style={styles.subtitle}>Share your favourite reads with others</Text>
          </View>
        
          <View style={styles.form}>

            {/* Book Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="book-outline" style={styles.inputIcon} size={20} color={COLORS.textSecondary} />
                <TextInput style={styles.input} placeholder='Enter a book title' value={title} onChangeText={setTitle} placeholderTextColor={COLORS.placeholderText} />
              </View>
            </View>

            {/* Ratings */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>
            {/* Image Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ): (
                    <View style={styles.placeholderContainer}>
                      <Ionicons name='image-outline' size={40} color={COLORS.textSecondary} />
                      <Text style={styles.placeholderText}>Tap to select image</Text>
                    </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder='Write your reviews or thoughts about this book...'
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>
            
            {/* submit */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white}/>
              ) : (
                  <>
                    <Ionicons
                      name='cloud-upload-outline'
                      size={20}
                      color={COLORS.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Share</Text>
                </>
            )}
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}