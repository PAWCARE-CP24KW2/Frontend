import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function UploadModal({ message, visible, onClose, onGalleryPress, onCameraPress, onRemovePress, showRemoveButton }) {
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
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonConfirm} onPress={onGalleryPress}>
              <Ionicons name="images" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonConfirm} onPress={onCameraPress}>
              <Ionicons name="camera" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
            {showRemoveButton && (
              <TouchableOpacity style={styles.buttonRemove} onPress={onRemovePress}>
                <Ionicons name="trash" size={24} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            )}
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
    width: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  message: {
    fontSize: 20,
    fontFamily: "ComfortaaBold",
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonConfirm: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#493628',
    borderRadius: 5,
  },
  buttonRemove: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#cc0000',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: '#FFF',
  },
  buttonIcon: {
    marginBottom: 1,
  },
});