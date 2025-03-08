import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, RefreshControl, TouchableOpacity, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MyStyles } from "../styles/MyStyle";
import { getAllPost } from '../api/post/getAllPost';
import userholder from '../assets/userholder.png';
import edit from '../assets/edit.png';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function Webboard({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('create_at');

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      setSortOrder('desc');
      setSortBy('create_at');
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
    await fetchPosts();
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={ userholder } style={styles.avatar} />
        <View>
          <Text style={styles.name}>{highlightText(getFullName(item.user_firstname, item.user_lastname), searchQuery)}</Text>
          <Text style={styles.date}>{formatDate(item.create_at)}</Text>
        </View>
      </View>
      {item.post_title ? (
        <Text style={styles.title}>{highlightText(item.post_title, searchQuery)}</Text>
      ) : null}
      {item.post_content ? (
        <Text style={styles.content}>{highlightText(item.post_content, searchQuery)}</Text>
      ) : null}
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
  
  return (
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
              placeholder="Search..."
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
        />
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => navigation.navigate('AddPost')}
        >
          <Image source={edit} style={styles.editIcon} />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
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
});