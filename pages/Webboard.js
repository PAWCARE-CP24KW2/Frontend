import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, RefreshControl, TouchableOpacity, ImageBackground, Modal, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MyStyles } from "../styles/MyStyle";
import { getAllPost } from '../api/post/getAllPost';
import { getLikedPost } from '../api/post/getLikedPost';
import edit from '../assets/edit.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider } from 'react-native-popup-menu';
import ConfirmModal from '../components/modals/ConfirmModal';
import { deletePost } from '../api/post/deletePost';
import { showPostToast } from "../services/showToast.js";
import { Dimensions } from 'react-native';
import PostItem from '../components/common/PostItems.js';
import LoadingScreen from '../components/common/LoadingScreen';

export default function Webboard({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('create_at');
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageHeights, setImageHeights] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const result = await getAllPost();
      const sortedPosts = result.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
    try {
      const likedPosts = await getLikedPost();
      setLikedPosts(likedPosts);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchLikedPosts();
    getTokenData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        fetchPosts();
        fetchLikedPosts();
        setSortOrder('desc');
        setSortBy('create_at');
      }, 1000); 
      return () => clearTimeout(timeout);
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = posts.filter(post => {
        const fullName = `${post.user_firstname} ${post.user_lastname}`.toLowerCase();
        return (
          post.post_title.toLowerCase().includes(query.toLowerCase()) ||
          post.post_content.toLowerCase().includes(query.toLowerCase()) ||
          fullName.includes(query.toLowerCase())
        );
      });
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredPosts(posts);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    fetchPosts();
    fetchLikedPosts();
    setSortBy('create_at');
    setSortOrder('desc');
  };

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setFullImageVisible(true);
  };

  const handleCloseFullImage = () => {
    setFullImageVisible(false);
    setSelectedImage(null);
  };

  const handleSortBy = (sortKey) => {
    let sortedPosts = [...posts];
  
    if (sortKey === 'create_at') {
      const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      sortedPosts.sort((a, b) => 
        newSortOrder === 'desc'
          ? new Date(b.create_at) - new Date(a.create_at)
          : new Date(a.create_at) - new Date(b.create_at)
      );
      setSortOrder(newSortOrder);
    } else if (sortKey === 'likes') {
      sortedPosts.sort((a, b) => b.likes - a.likes); 
    }
  
    setSortBy(sortKey);
    setPosts(sortedPosts);
    setFilteredPosts(sortedPosts);
  };

  function parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

  const getTokenData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decodedToken = parseJWT(token);
        setUserId(decodedToken.userId);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const handleDeletePost = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        fetchPosts();
        showPostToast('delete');
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setConfirmModalVisible(false);
        setPostToDelete(null);
      }
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>There's nothing here.</Text>
      <Text style={styles.emptyText}>You're the first one.</Text>
    </View>
  );

  const handleImageLoad = (postId, event) => {
    const { width, height } = event.nativeEvent.source;
    const screenWidth = Dimensions.get('window').width - 40;
    const aspectRatio = width / height;
    const calculatedHeight = screenWidth / aspectRatio;
    setImageHeights(prevState => ({ ...prevState, [postId]: calculatedHeight }));
  };

  const renderItem = ({ item }) => (
    <PostItem
      item={item}
      searchQuery={searchQuery}
      userId={userId}
      navigation={navigation}
      handleImagePress={handleImagePress}
      imageLoading={imageLoading}
      setImageLoading={setImageLoading}
      imageHeights={imageHeights}
      handleImageLoad={handleImageLoad}
      setPostToDelete={setPostToDelete}
      setConfirmModalVisible={setConfirmModalVisible}
      likedPosts={likedPosts}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={MyStyles.container}>
        <View style={MyStyles.header}></View>
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  return (
    <MenuProvider>
      <ImageBackground
        source={require('../assets/wallpaper.jpg')}
        style={MyStyles.background}
      >
        <SafeAreaView style={MyStyles.container}>
          <View style={MyStyles.header}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
              <TextInput
                style={styles.searchBar}
                placeholder="Search by title, content, user"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
                  <Ionicons name="close" size={20} color="black" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'create_at' && styles.activeSortButton]}
              onPress={() => handleSortBy('create_at')}
            >
              <View style={styles.sortButtonContent}>
                <Text style={[styles.sortButtonText, sortBy === 'create_at' && styles.activeSortButtonText]}>
                  Created time&nbsp;
                </Text>
                {sortBy === 'create_at' && (
                  <Ionicons name={sortOrder === 'desc' ? "caret-down" : "caret-up"} size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'likes' && styles.activeSortButton]}
              onPress={() => handleSortBy('likes')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'likes' && styles.activeSortButtonText]}>Likes</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredPosts}
            renderItem={renderItem}
            keyExtractor={(item) => item.post_id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
          <TouchableOpacity
            style={styles.createPostButton}
            onPress={() => navigation.navigate('AddPost')}
          >
            <Image source={edit} style={styles.editIcon} />
          </TouchableOpacity>

          <Modal visible={fullImageVisible} transparent={true}>
            <View style={styles.fullImageContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseFullImage}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} />}
            </View>
          </Modal>

          <ConfirmModal
            visible={confirmModalVisible}
            onConfirm={handleDeletePost}
            onClose={() => setConfirmModalVisible(false)}
            message="Are you sure you want to delete this post?"
          />
        </SafeAreaView>
      </ImageBackground>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    position: 'relative',
    marginHorizontal: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1, 
  },
  searchBar: {
    flex: 1,
    height: 45,
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 35,
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
    backgroundColor: "#D9D9D9",
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginVertical: 10,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    opacity: 0.6,
  },
  sortButton: {
    color: "#000",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeSortButton: {
    backgroundColor: "#493628",
  },
  sortButtonText: {
    color: "#000",
    opacity: 0.6,
    fontWeight: "bold",
  },
  activeSortButtonText: {
    color: "#FFF",
    opacity: 1,
  },
  sortButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    padding: 0,
    flexGrow: 1,
  },
  createPostButton: {
    position: 'absolute',
    backgroundColor: "#71543F",
    borderRadius: 100,
    padding: 17,
    bottom: 10,
    right: 10,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editIcon: {
    width: 35,
    height: 35,
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});