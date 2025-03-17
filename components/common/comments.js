import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import getComments from '../../api/post/comments/getComments';
import deleteComment from '../../api/post/comments/deleteComments';
import postComment from '../../api/post/comments/postComment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userholder from '../../assets/userholder.png';
import ConfirmModal from '../modals/ConfirmModal';
import AlertModal from '../modals/AlertModal';

const Comments = ({ postId, formatDate, fetchPostDetails, }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [dontHavePetModalVisible, setDontHavePetModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchComments();
    getTokenData();
  }, [postId]);

  const handleDeleteComment = async () => {
    try {
      await deleteComment(commentToDelete);
      fetchComments();
      fetchPostDetails();
      setConfirmModalVisible(false);
      setCommentToDelete(null);
      setDontHavePetModalVisible(true);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      await postComment(postId, newComment);
      fetchPostDetails();
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getFullName = (firstname, lastname) => `${firstname} ${lastname}`;

  if (loading) {
    return <ActivityIndicator size="large" color="#71543F" />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <Image source={userholder} style={styles.avatar} />
      <View style={styles.commentContainer}>
        <View style={styles.comment}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.commentAuthor}>
                {getFullName(item.user_firstname, item.user_lastname)}
              </Text>
              {userId === item.user_id && (
                <Menu>
                  <MenuTrigger style={styles.moreIcon}>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={24}
                      color="black"
                    />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => console.log("Edit Comment")}>
                      <View style={styles.menuOption}>
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="black"
                        />
                        <Text style={styles.menuOptionText}>Edit Comment</Text>
                      </View>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => {
                        setCommentToDelete(item.comment_id);
                        setConfirmModalVisible(true);
                      }}
                    >
                      <View style={styles.menuOption}>
                        <Ionicons name="trash-outline" size={20} color="red" />
                        <Text style={styles.menuOptionDeleteText}>
                          Delete Comment
                        </Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              )}
            </View>
          </View>
          <Text style={styles.commentText}>{item.comment_content}</Text>
        </View>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.divider} />
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.comment_id.toString()}
        contentContainerStyle={styles.commentsContainer}
      />

      <ConfirmModal
        visible={confirmModalVisible}
        onConfirm={handleDeleteComment}
        onClose={() => setConfirmModalVisible(false)}
        message="Are you sure you want to delete this comment?"
      />

      <AlertModal
        visible={dontHavePetModalVisible}
        onConfirm={() => setDontHavePetModalVisible(false)}
        message="Comment deleted successfully."
        buttonText="Ok"
      />
  
      <View style={styles.commentInputContainer}>
        <Image source={userholder} style={styles.avatar} />
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          multiline={true}
          numberOfLines={4}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Ionicons name="send" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 15,
  },
  commentsContainer: {
    padding: 16,
  },
  commentContainer: {
    flex: 1,
  },
  comment: {
    padding: 12,
    backgroundColor: '#ebecee',
    borderRadius: 10,
    position: 'relative',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 100,
    marginRight: 10,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  headerText: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 10,
  },
  commentText: {
    fontSize: 16,
    color: "#000",
  },
  moreIcon: {
    position: 'absolute',
    padding: 5,
    top: -30,
    right: -5,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  menuOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  menuOptionDeleteText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'red',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  commentInput: {
    flex: 1,
    padding: 10,
    paddingLeft: 15,
    fontSize: 16,
    borderRadius: 20,
    backgroundColor: '#ebecee',
    marginRight: 10,
  },
});


export default Comments;