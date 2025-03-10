import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { MyStyles } from "../../styles/MyStyle.js";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import TopBar from "../common/Topbar.js";
import Icon from "react-native-vector-icons/Ionicons";
import { showToast, showUpdateToast } from "../../services/showToast.js";
import DropdownComponent from "../dropdowns/Dropdown.js";
import { getAgendaFromId, putAgenda } from "../../api/index.js";
import { cancelNotification, scheduleNotification } from '../../services/notificationService.js';

export default function UpdateAgenda({
  selectedItem,
  isEditModalVisible,
  onClose,
  setItems,
  currentTitle
}) {
  if (!selectedItem) {
    return null; 
  }

  const [transformedAgenda, setTransformedAgenda] = useState({});
  const [newItem, setNewItem] = useState({
    title: "",
    message: "",
    date: "",
    time: "",
    status: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchAgendaData = async () => {
      try {
        let agendas;
  
        if (selectedItem.id) {
          // Fetch a single agenda when selectedItem.id exists
          const singleAgenda = await getAgendaFromId(selectedItem.id);
          agendas = [singleAgenda]; // Normalize single agenda into an array for uniform processing
        }
  
        // Assume agendas array has only one item to return a single object
        const agenda = agendas[0];
        const date = agenda.appointment.split('T')[0];
        const time = agenda.appointment.split('T')[1].split(':').slice(0, 2).join(':');
  
        const transformed = {
          id: agenda.agenda_id,
          title: agenda.agenda_title,
          message: agenda.agenda_message,
          status: agenda.status,
          time: time,
          date: date,
        };
        setTransformedAgenda(transformed);
        setSelectedDate(transformed.date)
        setSelectedTime(transformed.time)
      } catch (error) {
        console.error('Error fetching agenda data:', error);
      }
    };
    
    fetchAgendaData();
  }, [selectedItem.id]);

  useEffect(() => {
    if (transformedAgenda.title) {
      setNewItem({
        title: transformedAgenda.title,
        message: transformedAgenda.message,
        date: transformedAgenda.date,
        time: transformedAgenda.time,
        status: transformedAgenda.status,
      });
    }
  }, [transformedAgenda]);

  const updateAgenda = async () => {
    const agendaId = selectedItem.id;
    const eventTitle = newItem.title;
    const eventDescription = newItem.message;
    const eventStart = `${newItem.date}T${newItem.time}:00Z`;
    const status = newItem.status;

    // Validation checks
    if (!eventTitle || !eventDescription) {
      showToast('error', 'Title and message cannot be empty');
      return;
    }

    try {
      await putAgenda(agendaId, eventTitle, eventDescription, eventStart, status);

      // Cancel the existing notification
      if (selectedItem.notificationId) {
        await cancelNotification(selectedItem.notificationId);
      }

      // Schedule the new notification
      const notificationDate = new Date(`${newItem.date}T${newItem.time}:00`);
      const notificationId = await scheduleNotification(
        `Reminder for ${newItem.title}`,
        `${newItem.message}`,
        { agendaId },
        notificationDate
      );

      // Update the items state
      setItems((prevItems) => {
        const updatedItems = { ...prevItems };

        // Ensure the new date key exists
        if (!updatedItems[newItem.date]) {
          updatedItems[newItem.date] = [];
        }

        // Remove the item from the old date if it exists
        if (newItem.date !== transformedAgenda.date) {
          // console.log(transformedAgenda.date)
          updatedItems[transformedAgenda.date] = updatedItems[transformedAgenda.date].filter(
            (item) => item.id !== agendaId
          );

          // If the array becomes empty after filtering, delete the key
          if (updatedItems[transformedAgenda.date].length === 0) {
            delete updatedItems[transformedAgenda.date];
          }
        }

        // Update the specific agenda item or add it if it doesn't exist
        const itemIndex = updatedItems[newItem.date].findIndex((item) => item.id === agendaId);
        if (itemIndex !== -1) {
          // Update existing item
          updatedItems[newItem.date][itemIndex] = {
            ...updatedItems[newItem.date][itemIndex],
            title: newItem.title,
            message: newItem.message,
            time: newItem.time,
            status: newItem.status,
            notificationId, // Store the new notification ID
          };
        } else {
          // Add new item
          updatedItems[newItem.date].push({
            id: agendaId,
            title: newItem.title,
            message: newItem.message,
            time: newItem.time,
            status: newItem.status,
            notificationId, // Store the new notification ID
          });
        }

        // console.log('Items updated:', updatedItems);
        return updatedItems;
      });
      setTransformedAgenda((prevAgenda) => ({
        ...prevAgenda,
        date: newItem.date,
      }));

      showUpdateToast('success');
    } catch (error) {
      showToast('Failed to update agenda');
      console.log('updateAgenda error:', error);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onChange = (event, selectedValue) => {
    if (event.type === "set") {
      if (mode === "date") {
        const currentDate = selectedValue || new Date(transformedAgenda.date);
        setDate(currentDate);
        const formattedDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
          .toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        setNewItem((prevNewItem) => ({
          ...prevNewItem,
          date: formattedDate
        }));
      } else if (mode === "time") {
        const currentTime = selectedValue || new Date(`1970-01-01T${transformedAgenda.time}:00`);
        setTime(currentTime);
        setSelectedTime(formatTime(currentTime)); // Format and store the time
        setNewItem((prevNewItem) => ({
          ...prevNewItem,
          time: formatTime(currentTime),
        }));
      }
    }
    setShow(false);
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0"); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits
    return `${hours}:${minutes}`; // Format as HH:MM
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
            Update "{transformedAgenda.title}"
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
            <DropdownComponent newItem={newItem} setNewItem={setNewItem} currentTitle={currentTitle} />

            <Text style={MyStyles.label}>Description</Text>
            <View style={MyStyles.descriptionContainer}>
              <TextInput
                placeholder="Remind me to take care of a task"
                style={MyStyles.input}
                value={newItem.message}
                onChangeText={(text) => {
                  setNewItem((prevNewItem) => {
                    prevNewItem.message = text; 
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