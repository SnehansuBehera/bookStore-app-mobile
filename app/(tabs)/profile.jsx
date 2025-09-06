import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import styles from "../../assets/styles/profile-styles.js";
import Loader from '../../components/Loader.jsx';
import LogoutButton from '../../components/LogoutButton.jsx';
import ProfileHeader from '../../components/ProfileHeader.jsx';
import COLORS from '../../constants/color.js';
import { useAuthStore } from "../../store/authStore.js";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [deleteBook, setDeleteBook] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  const { token } = useAuthStore();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://bookworm-5n78.onrender.com/api/books/user`, {
        headers:{Authorization: `Bearer ${token}`} 
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user books");
      setBooks(data);
    } catch (error) {
      console.error("Error in fetching user books", error);
      Alert.alert("Error", "Failed to load profile data. Refresh the page");
    } finally {
      setLoading(false);
    }

  }

  const deleteBookId = async(bookId) => {
    try {
      setDeleteBook(bookId);
      const response = await fetch(`https://bookworm-5n78.onrender.com/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete book");
      setBooks(books.filter((book) => bookId !== book._id));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      console.error("Error in deleting the book", error);
      Alert.alert("Error", error.message || "Failed to delete recommendation");
    } finally {
      setDeleteBook(null);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++){
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{marginRight: 2}}
        />
      )
    }
    return stars;
  }

  const renderItems = ({item}) => (
    <View style={styles.bookItem}>
      <Image style={styles.bookImage} source={item.image} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteBook === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary}/>
        ) : (
            <Ionicons name='trash-outline' size={20} color={COLORS.primary}/>
        )}
        
      </TouchableOpacity>
    </View>
  )

  const confirmDelete = (bookId) => {
    Alert.alert("Delete Recommendation", "Are you sure you want to delete this recommendation", [
      { text: "Cancel", style: "cancel" },
      {text: "Delete", onPress: ()=>deleteBookId(bookId), style: "destructive"}
    ])
  }

  const handleRefresh = async() => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  if(loading && !refreshing) return <Loader/>

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your recommendations</Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>
      <FlatList
        data={books}
        renderItem={renderItems}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={50} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={()=>router.push("/create")}>
              <Text style={styles.addButtonText}>Add your first book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}