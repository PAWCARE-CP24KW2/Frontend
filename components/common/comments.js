import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';
import getComments from '../../api/post/comments/getComments';
import userholder from '../../assets/userholder.png';

const Comments = ({ postId, formatDate }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchComments();
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
    marginBottom: 10,
  },
});

export default Comments;