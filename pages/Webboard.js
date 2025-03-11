import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, RefreshControl, TouchableOpacity, ImageBackground, Modal, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MyStyles } from "../styles/MyStyle";
import { getAllPost } from '../api/post/getAllPost';
import userholder from '../assets/userholder.png';
import edit from '../assets/edit.png';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import ConfirmModal from '../components/modals/ConfirmModal';
import { deletePost } from '../api/post/deletePost';
import { showPostToast } from "../services/showToast.js";

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
  const [imageLoading, setImageLoading] = useState(false); // Add state for image loading

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
    }
  };

  useEffect(() => {
    fetchPosts();
    getTokenData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        fetchPosts();
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
    setSortBy('create_at');
    setSortOrder('desc');
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const highlightText = (text, query) => {
    if (!query) return <Text>{text}</Text>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>{part}</Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const getFullName = (firstname, lastname) => {
    return `${firstname} ${lastname}`;
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={ userholder } style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{highlightText(getFullName(item.user_firstname, item.user_lastname), searchQuery)}</Text>
          <Text style={styles.date}>{formatDate(item.create_at)}</Text>
        </View>
        {userId === item.user_id && (
          <Menu>
            <MenuTrigger style={styles.moreIcon}>
              <Ionicons name="ellipsis-horizontal" size={24} color="black" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => navigation.navigate('EditPost', { postId: item.post_id })}>
                <View style={styles.menuOption}>
                  <Ionicons name="create-outline" size={20} color="black" />
                  <Text style={styles.menuOptionText}>Edit Post</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => {
                setPostToDelete(item.post_id);
                setConfirmModalVisible(true);
              }}>
                <View style={styles.menuOption}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                  <Text style={styles.menuOptionDeleteText}>Delete Post</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>
      {item.post_title ? (
        <Text style={styles.title}>{highlightText(item.post_title, searchQuery)}</Text>
      ) : null}
      {item.post_content ? (
        <Text style={styles.content}>{highlightText(item.post_content, searchQuery)}</Text>
      ) : null}
      {item.post_photo_path && (
        <TouchableOpacity onPress={() => handleImagePress(item.post_photo_path)}>
          <View>
            {imageLoading && (
              <ActivityIndicator
                size="large"
                color="#71543F"
                style={styles.imageLoader}
              />
            )}
            <Image
              source={{ uri: item.post_photo_path }}
              style={styles.postImage}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </View>
        </TouchableOpacity>
      )}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="heart-o" size={18} color="black" />
          <Text style={styles.iconText}>{item.likes}</Text>
        </View>
        <View style={styles.iconCommentContainer}>
          <FontAwesome5 name="comment-alt" size={16} color="black" />
          <Text style={styles.iconText}>{item.comments}</Text>
        </View>
      </View>
    </View>
  );

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
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: 'relative',
  },
  headerText: {
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 15,
    borderWidth: 0.5,
    borderColor: "black",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5B3A29",
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
  moreIcon: {
    position: 'absolute',
    top: -30,
    right: 0,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A2C23",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: "#4A2C23",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  iconText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#5B3A29",
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
  highlight: {
    backgroundColor: '#E0E0E0',
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
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuOptionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  menuOptionDeleteText: {
    fontSize: 18,
    marginLeft: 10,
    color: 'red',
  },
});