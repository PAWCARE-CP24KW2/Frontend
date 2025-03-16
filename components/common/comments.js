import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import getComments from '../../api/post/comments/getComments';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userholder from '../../assets/userholder.png';

const Comments = ({ postId, formatDate }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const fetchComments = async () => {
    try {
      const commentsData = await getComments(postId);
      console.log(commentsData)
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

  if (loading) {
    return <ActivityIndicator size="large" color="#71543F" />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.container}>
        <Image source={userholder} style={styles.avatar} />
        <View style={styles.comment}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.commentAuthor}>Fullname Lastname</Text>
                    <Text style={styles.date}>{formatDate(item.create_at)}</Text>
                </View>
                {userId === item.user_id && (
                    <Menu>
                        <MenuTrigger style={styles.moreIcon}>
                            <Ionicons name="ellipsis-horizontal" size={24} color="black"/>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => console.log('Edit Comment')}>
                                <View style={styles.menuOption}>
                                    <Ionicons name="create-outline" size={20} color="black" />
                                    <Text style={styles.menuOptionText}>Edit Comment</Text>
                                </View>
                            </MenuOption>
                            <MenuOption onSelect={() => console.log('Delete Comment')}>
                                <View style={styles.menuOption}>
                                    <Ionicons name="trash-outline" size={20} color="red" />
                                    <Text style={styles.menuOptionDeleteText}>Delete Comment</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                )}
            </View>
            <Text style={styles.commentText}>{item.commend_content}</Text>
        </View>
    </View>
  );

  return (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={(item) => item.comment_id.toString()}
      contentContainerStyle={styles.commentsContainer}
    />
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    commentsContainer: {
      padding: 16,
    },
    comment: {
      flex: 1,
      marginBottom: 16,
      padding: 12,
      backgroundColor: '#ebecee',
      borderRadius: 10,
      position: 'relative',
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      position: 'relative',
    },
    avatar: {
      width: 45,
      height: 45,
      borderRadius: 100,
      marginRight: 10,
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
  
  export default Comments;