import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, Alert } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import getComments from '../../api/post/comments/getComments';
import deleteComment from '../../api/post/comments/deleteComments';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userholder from '../../assets/userholder.png';
import ConfirmModal from '../modals/ConfirmModal';
import DontHavePetModal from '../modals/DontHavePetModal';

const Comments = ({ postId, formatDate }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [dontHavePetModalVisible, setDontHavePetModalVisible] = useState(false);

  const fetchComments = async () => {
    try {
      const commentsData = await getComments(postId);
      console.log(commentsData);
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
      setConfirmModalVisible(false);
      setCommentToDelete(null);
      setDontHavePetModalVisible(true);
    } catch (error) {
      console.error('Error deleting comment:', error);
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
              <Text style={styles.commentAuthor}>{getFullName(item.user_firstname, item.user_lastname)}</Text>
              <Text style={styles.commentText}>{item.comment_content}</Text>
            </View>
            {userId === item.user_id && (
              <Menu>
                <MenuTrigger style={styles.moreIcon}>
                  <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => console.log('Edit Comment')}>
                    <View style={styles.menuOption}>
                      <Ionicons name="create-outline" size={20} color="black" />
                      <Text style={styles.menuOptionText}>Edit Comment</Text>
                    </View>
                  </MenuOption>
                  <MenuOption onSelect={() => {
                    setCommentToDelete(item.comment_id);
                    setConfirmModalVisible(true);
                  }}>
                    <View style={styles.menuOption}>
                      <Ionicons name="trash-outline" size={20} color="red" />
                      <Text style={styles.menuOptionDeleteText}>Delete Comment</Text>
                    </View>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            )}
          </View>
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

      <DontHavePetModal
        visible={dontHavePetModalVisible}
        onConfirm={() => setDontHavePetModalVisible(false)}
        message="Comment deleted successfully."
        buttonText="Ok"
      />
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
    position: 'relative',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B3A29',
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 10,
  },
  commentText: {
    fontSize: 16,
    color: "#4A2C23",
  },
  moreIcon: {
    position: 'absolute',
    padding: 5,
    top: -25,
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
});

export default Comments;