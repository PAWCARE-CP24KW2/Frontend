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
import React, { useState, useEffect, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "./Topbar.js";
import Icon from "react-native-vector-icons/Ionicons";
import { showToast } from "../composable/showToast.js";
import DropdownComponent from "./Dropdown.js";
import { postAgenda } from "../composable/postAgenda.js";

export default function AddAgenda({
  isAddModalVisible,
  onClose,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  setItems,
  getCurrentTime,
}) {

  const [show, setShow] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    message: "",
    time: "",
  });
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const onChange = (event, selectedValue) => {
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
    setShow(false);
  };

  const addItemToAgenda = async () => {
    if (!newItem.title || !newItem.message || !selectedDate){
      showToast("error");
      return; 
    }
    try {
      const response = await postAgenda(newItem, selectedDate, selectedTime);
      const agendaId = response.agenda_id;

      setItems((prevItems) => {
        const updatedItems = { ...prevItems };

        if (!updatedItems[selectedDate]) {
          updatedItems[selectedDate] = [];
        }

        updatedItems[selectedDate].push({
          ...newItem,
          id: agendaId,
          time: selectedTime,
        });
        
        return updatedItems;
      });
      setNewItem({ title: "", message: "", time: "" });
      setSelectedTime(getCurrentTime());
    } catch (error) {
      console.error('Failed to add agenda:', error);
      showToast("error"); 
    }
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
      visible={isAddModalVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={{ flex: 1, backgroundColor: "#EACEBE" }}>
        <TopBar onClose={onClose} />
        <View style={MyStyles.modal}>
          <Text style={{ fontSize: 27, textAlign: "center", paddingTop: 4 }}>
            Create Activity
          </Text>
          <Text
            style={{
              fontSize: 19,
              textAlign: "center",
              paddingVertical: 5,
              marginBottom: 15,
            }}
          >
            Which activities do you want to be reminded of ?
          </Text>

          <SafeAreaView>
            <DropdownComponent newItem={newItem} setNewItem={setNewItem} />

            <Text style={MyStyles.label}>Description</Text>
            <View style={MyStyles.descriptionContainer}>
              <TextInput
                placeholder="Remind me to take care of a task"
                style={MyStyles.input}
                value={newItem.message}
                onChangeText={(text) => {
                  setNewItem((prevNewItem) => {
                    prevNewItem.message = text; // Direct modification
                    return { ...prevNewItem };
                  });
                }}
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
