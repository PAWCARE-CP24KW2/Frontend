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
import Icon from 'react-native-vector-icons/Ionicons';

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
    desc: "",
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
    if (!newItem.name || !newItem.desc || !selectedDate) return; // Prevent adding empty items
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

    setNewItem({ name: "", desc: "", time: "" });
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
      <View style={{flex: 1, backgroundColor:"#EACEBE"}}>
        <TopBar onClose={onClose}/>
        <View style={MyStyles.modal}>
          <Text style={{ fontSize: 27, textAlign: "center", paddingTop: 4, }}>
            Create Activity
          </Text>
          <Text style={{ fontSize: 19, textAlign: "center", paddingVertical: 5 }}>
            Which activities do you want to be reminded of ?
          </Text>
          <SafeAreaView>

            <View style={MyStyles.inputContainer}>
              <Icon name="search" size={20} color="black" style={MyStyles.icon} />
              <TextInput 
                placeholder="search" 
                style={MyStyles.input} 
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })} 
              />
              <Icon name="chevron-down" size={20} color="black" style={MyStyles.icon} />
            </View>
            
            <Text style={MyStyles.label}>Description</Text>
            <View style={MyStyles.descriptionContainer}>
              <TextInput
                placeholder="Remind me to take care of a task"
                style={MyStyles.input}
                value={newItem.desc}
                onChangeText={(text) => setNewItem({ ...newItem, desc: text })}
              />
            </View>
          
            <Text style={MyStyles.label}>Schedule Start Date and Time</Text>
            <TouchableOpacity style={MyStyles.dateContainer} onPress={() => showMode("date")}>
              <Icon name="calendar" size={20} color="black" style={MyStyles.icon} />
              <TextInput 
                style={MyStyles.input}
                value={selectedDate}
                editable={false}
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={MyStyles.timeContainer} onPress={() => showMode("time")}>
            <Icon name="time" size={22} color="black" style={MyStyles.icon} />
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
      </View>
    </Modal>
  );
}
