import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { MyStyles } from "../styles/MyStyle.js";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "./Topbar.js";
import Icon from "react-native-vector-icons/Ionicons";
import { showToast } from "../composable/showToast.js";
import DropdownComponent from "./Dropdown.js";

export default function UpdateAgenda({
  selectedItem,
  isEditModalVisible,
  onClose,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  setItems,
}) {
  if (!selectedItem) {
    return null; // Render nothing if selectedItem is null
  }

  const [show, setShow] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    message: "",
    time: "",
  });

  useEffect(() => {
    console.log(selectedItem)
    if (selectedItem) {
      setNewItem({
        title: selectedItem.title,
        message: selectedItem.message,
        time: selectedItem.time,
      });
    }
  }, [selectedItem]);

  const updateAgenda = () => {
    console.log(newItem)
  };
  
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
      visible={isEditModalVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={{ flex: 1, backgroundColor: "#EACEBE" }}>
        <TopBar onClose={onClose} />
        <View style={MyStyles.modal}>
          <Text style={{ fontSize: 27, textAlign: "center", paddingTop: 4 }}>
            Update {selectedItem.name} Activity
          </Text>
          <Text
            style={{
              fontSize: 19,
              textAlign: "center",
              paddingVertical: 5,
              marginBottom: 15,
            }}
          >
            What would you like to change about the activity ?
          </Text>

          <SafeAreaView>
            <DropdownComponent newItem={newItem} setNewItem={setNewItem} />

            <Text style={MyStyles.label}>Description</Text>
            <View style={MyStyles.descriptionContainer}>
              <TextInput
                placeholder="Remind me to take care of a task"
                style={MyStyles.input}
                value={newItem.message}
                onChangeText={(text) => setNewItem({ ...newItem, message: text })}
              />
            </View>

            <Text style={MyStyles.label}>Schedule Start Date and Time</Text>
            <TouchableOpacity
              style={MyStyles.dateContainer}
              onPress={() => showMode("date")}
            >
              <Icon
                name="calendar"
                size={20}
                color="black"
                style={MyStyles.icon}
              />
              <TextInput
                style={MyStyles.input}
                value={selectedDate}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={MyStyles.timeContainer}
              onPress={() => showMode("time")}
            >
              <Icon name="time" size={22} color="black" style={MyStyles.icon} />
              <TextInput
                style={MyStyles.input}
                placeholder="00:00"
                value={selectedItem.time}
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
                updateAgenda();
                onClose();
              }}
            >
              <Text style={MyStyles.buttonText}>Update Item to Agenda</Text>
            </TouchableOpacity>
          </SafeAreaView>

          <TouchableOpacity style={MyStyles.closeButton} onPress={onClose}>
            <Text style={MyStyles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
