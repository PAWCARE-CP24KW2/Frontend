import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import userholder from '../../assets/userholder.png';
import { likePost } from '../../api/post/likePost';
import { unlikePost } from '../../api/post/unlikePost';
import PostDetails from '../../pages/PostDetails';

const PostItem = ({
  item,
  likedPosts = [],
  searchQuery,
  userId,
  navigation,
  handleImagePress,
  imageLoading,
  setImageLoading,
  imageHeights,
  handleImageLoad,
  setPostToDelete,
  setConfirmModalVisible,
  updatePostLikes,
  fetchPosts,
}) => {
  const [likes, setLikes] = useState(item.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [postPageVisible, setPostPageVisible] = useState(false);
  const imageHeight = imageHeights[item.post_id] || 0;

  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (likedPosts.some((likedPost) => likedPost.post_id === item.post_id)) {
      setLiked(true);
    }
  }, [likedPosts, item.post_id]);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      if (liked) {
        await unlikePost(item.post_id);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await likePost(item.post_id);
        setLikes(likes + 1);
        setLiked(true);
      }
      animateIcon();
    } catch (error) {
      console.error('Error liking/unliking post:', error);
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(/,/g, '');
  };

  const highlightText = (text, query) => {
    if (!query) return <Text>{text}</Text>;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const getFullName = (firstname, lastname) => `${firstname} ${lastname}`;

  return (
    <>
      <TouchableOpacity onPress={() => setPostPageVisible(true)}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Image source={item.photo_path ? { uri: item.photo_path } : userholder} style={styles.avatar}  />
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
                  style={[styles.postImage, { height: imageHeight }]}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onLoad={(event) => handleImageLoad(item.post_id, event)}
                />
              </View>
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
              <Text style={styles.iconText}>{item.comments}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <PostDetails
        visible={postPageVisible}
        onClose={() => { setPostPageVisible(false); fetchPosts(); }}
        postId={item.post_id}
        updatePostLikes={updatePostLikes}
        fullName={getFullName(item.user_firstname, item.user_lastname)}
        formatDate={formatDate}
        likes={likes}
        setLikes={setLikes}
        isLiking={isLiking}
        setIsLiking={setIsLiking}
        liked={liked}
        setLiked={setLiked}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
    borderWidth: 1,
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
    padding: 5,
    top: -35,
    right: -5,
  },
  postImage: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#E0E0E0',
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
  highlight: {
    backgroundColor: '#E0E0E0',
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

export default PostItem;