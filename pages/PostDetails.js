import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Modal, Animated, Easing, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { MyStyles } from '../styles/MyStyle';
import userholder from '../assets/userholder.png';
import { likePost } from '../api/post/likePost';
import { unlikePost } from '../api/post/unlikePost';
import { getLikedPost } from '../api/post/getLikedPost';
import { getPostById } from '../api/post/getPostById';
import Comments from '../components/common/comments';
import { MenuProvider } from 'react-native-popup-menu';

const PostDetails = ({
  visible,
  onClose,
  postId,
  fullName,
  formatDate,
  likes,
  isLiking,
  liked,
  setLikes,
  setIsLiking,
  setLiked,
  comments,
}) => {
  const [post, setPost] = useState(null);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const scaleValue = useRef(new Animated.Value(1)).current;

  const fetchPostDetails = async () => {
    try {
      const postDetails = await getPostById(postId);
      setPost(postDetails);
      setLikes(postDetails.likes);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const fetchLikedPosts = async () => {
    try {
      const likedPosts = await getLikedPost();
      if (likedPosts.some((likedPost) => likedPost.post_id === postId)) {
        setLiked(true);
      }
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchPostDetails();
      fetchLikedPosts();
    }
  }, [visible]);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      if (liked) {
        await unlikePost(postId);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await likePost(postId);
        setLikes(likes + 1);
        setLiked(true);
      }
      animateIcon();
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const animateIcon = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setFullImageVisible(true);
  };

  const handleCloseFullImage = () => {
    setFullImageVisible(false);
    setSelectedImage(null);
  };

  if (!post) {
    return null;
  }

  const renderPostDetails = () => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={userholder} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.date}>{formatDate(post.create_at)}</Text>
        </View>
      </View>
      {post.post_title ? (
        <Text style={styles.title}>{post.post_title}</Text>
      ) : null}
      {post.post_content ? (
        <Text style={styles.content}>{post.post_content}</Text>
      ) : null}
      {post.post_photo_path && (
        <TouchableOpacity onPress={() => handleImagePress(post.post_photo_path)}>
          <Image source={{ uri: post.post_photo_path }} style={styles.postImage} />
        </TouchableOpacity>
      )}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleLike} disabled={isLiking}>
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <FontAwesome name={liked ? "heart" : "heart-o"} size={18} color={liked ? "red" : "black"} />
          </Animated.View>
          <Text style={styles.iconText}>{likes}</Text>
        </TouchableOpacity>
        <View style={styles.iconCommentContainer}>
          <FontAwesome5 name="comment-alt" size={16} color="black" />
          <Text style={styles.iconText}>{post.comments}</Text>
        </View>
      </View>

      <Comments 
        postId={postId} 
        formatDate={formatDate}
        fetchPostDetails={fetchPostDetails}
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <MenuProvider skipInstanceCheck>
        <ImageBackground
          source={require("../assets/wallpaper.jpg")}
          style={MyStyles.background}
        >
          <SafeAreaView style={[MyStyles.container, { flex: 1 }]}>
            <View style={MyStyles.arrowHeader}>
              <TouchableOpacity style={MyStyles.arrowIcon} onPress={onClose}>
                <Ionicons name="arrow-back-outline" size={30} color="black" />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={styles.headerBarText}>Post Details</Text>
              </View>
              <View style={{ width: 35 }} />
            </View>

            <FlatList
              data={[{ key: 'postDetails' }]}
              renderItem={renderPostDetails}
              keyExtractor={(item) => item.key}
              contentContainerStyle={styles.scrollViewContent}
            />

            <Modal visible={fullImageVisible} transparent={true} animationType='fade'>
              <View style={styles.fullImageContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseFullImage}
                >
                  <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.fullImage}
                  />
                )}
              </View>
            </Modal>

          </SafeAreaView>
        </ImageBackground>
      </MenuProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: 'relative',
  },
  headerBarText: {
    fontSize: 24,
    justifyContent: "space-around",
    color: "black",
    textAlign: "center",
    textShadowColor: "#493628",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 15,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    borderRadius: 10,
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
});

export default PostDetails;