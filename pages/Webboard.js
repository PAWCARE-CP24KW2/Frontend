import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native';
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

  const fetchPosts = async () => {
    try {
      const result = await getAllPost();
      setPosts(result);
      setFilteredPosts(result);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    setRefreshing(false);
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
      <Text style={styles.title}>{highlightText(item.post_title, searchQuery)}</Text>
      <Text style={styles.content}>{highlightText(item.post_content, searchQuery)}</Text>
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
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Image source={edit} style={styles.editIcon} />
      </TouchableOpacity>
    </SafeAreaView>
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
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    margin: 10,
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