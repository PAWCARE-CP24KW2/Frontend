import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import emptyholder from '../../assets/emptyholder.png';

export default function ShowDocumentModal({ visible, onClose, uri }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {imageLoading && (
              <ActivityIndicator
                size="large"
                color="#71543F"
                style={styles.imageLoader}
              />
            )}
            <Image
              source={uri ? { uri } : emptyholder}
              style={styles.image}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
  },
});