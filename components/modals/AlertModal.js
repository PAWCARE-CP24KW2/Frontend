import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function AlertModal({ visible, onClose, onConfirm, message, buttonText, textStyle }) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.message, textStyle]}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonConfirm} onPress={onConfirm}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
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
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonConfirm: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: '#493628',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: '#FFF',
  },
});