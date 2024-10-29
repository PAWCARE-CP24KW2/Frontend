import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Platform,
  Button,
} from "react-native";
import { MyStyles } from "../styles/MyStyle.js";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddAgenda({
  isModalVisible,
  onClose,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  setItems,
}) {
  const [show, setShow] = useState(false);
  const [newItem, setNewItem] = useState({
    id: 0,
    name: "",
    data: "",
    time: "",
  });
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === "ios");
    if (event.type === "set") {
      if (mode === "date") {
        const currentDate = selectedValue || date;
        setDate(currentDate);
        setSelectedDate(currentDate.toISOString().split("T")[0]); // Format and store the date
      } else if (mode === "time") {
        const currentTime = selectedValue || time;
        setTime(currentTime);
        setSelectedTime(formatTime(currentTime)); // Format and store the time
      }
    }
    setPickerVisible(false); // Hide the picker after selection
  };

  const addItemToAgenda = () => {
    if (!newItem.name || !newItem.data || !selectedDate) return; // Prevent adding empty items
    setItems((prevItems) => {
      const updatedItems = { ...prevItems }; // Copy previous state

      if (!updatedItems[selectedDate]) {
        updatedItems[selectedDate] = []; // Create an array if the date doesn't exist
      }

      const allItems = Object.values(updatedItems).flat();
      const newId =
        allItems.length > 0
          ? Math.max(...allItems.map((item) => item.id)) + 1
          : 1;
      updatedItems[selectedDate].push({
        ...newItem,
        id: newId,
        time: selectedTime,
      });
      console.log(updatedItems);
      return updatedItems;
    });

    setNewItem({ name: "", data: "", time: "" });
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0"); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits
    return `${hours}:${minutes}`; // Format as HH:MM
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={MyStyles.modal}>
        <Text
          style={{ fontSize: 30, textAlign: "center", paddingVertical: 30 }}
        >
          Adding Agenda
        </Text>
        <SafeAreaView>
          <TextInput
            style={MyStyles.input}
            placeholder="Agenda's Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <TextInput
            style={MyStyles.input}
            placeholder="Agenda's Detail"
            value={newItem.data}
            onChangeText={(text) => setNewItem({ ...newItem, data: text })}
          />
          <TouchableOpacity onPress={() => showMode("date")}>
            <TextInput
              style={MyStyles.input}
              value={selectedDate}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showMode("time")}>
            <TextInput
              style={MyStyles.input}
              placeholder="00:00"
              value={selectedTime}
              editable={false}
              onChangeText={(text) => setNewItem({ ...newItem, time: text })}
            />
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={mode === "date" ? date : time}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <TouchableOpacity
            style={MyStyles.button}
            onPress={() => {
              addItemToAgenda();
              onClose();
            }}
          >
            <Text style={MyStyles.buttonText}>Add Item to Agenda</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <TouchableOpacity style={MyStyles.closeButton} onPress={onClose}>
          <Text style={MyStyles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
