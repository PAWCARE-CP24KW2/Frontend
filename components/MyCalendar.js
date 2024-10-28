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
import { MyStyles } from "../styles/MyStyle";
import React, { useState, useEffect  } from "react";
import { Agenda } from "react-native-calendars";
import { calendarTheme } from "react-native-calendars";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';

// test comment 2
export default function MyCalendar() {
  // const [items, setItems] = useState({
  //   '2024-10-14': [{ id: 1, name: 'Agenda 1', data: 'Lorem ipsum, or lipsum as it is sometimes known.' }, { id: 2, name: 'Agenda 1.2', data: 'Lorem ipsum, or lipsum as it is sometimes known.' }],
  //   '2024-10-15': [{ id: 3, name: 'Agenda 2', data: 'Lorem ipsum, or lipsum as it is sometimes known.' }],
  //   '2024-10-16': [{ id: 4, name: 'Agenda 3', data: 'Lorem ipsum, or lipsum as it is sometimes known.' }],
  // });
  const [items, setItems] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState('00:00')
  
  // datetimepicker
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [text, setText] = useState("empty")

  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios')
    if (event.type === 'set') {
      if (mode === 'date') {
        const currentDate = selectedValue || date;
        setDate(currentDate);
        setSelectedDate(currentDate.toISOString().split("T")[0]); // Format and store the date
      } else if (mode === 'time') {
        const currentTime = selectedValue || time;
        setTime(currentTime);
        setSelectedTime(formatTime(currentTime)); // Format and store the time
      }
    }
    setPickerVisible(false); // Hide the picker after selection
  };

  useEffect(() => {
    // Log when selectedDate or selectedTime changes
    console.log("Updated Date: " + selectedDate + ", Updated Time: " + selectedTime);
  }, [selectedDate, selectedTime]);

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits
    return `${hours}:${minutes}`; // Format as HH:MM
  };

  const [newItem, setNewItem] = useState({ id: 0, name: "", data: "", time: "" }); // New item state
  
  const addItemToAgenda = () => {
    if (!newItem.name || !newItem.data || !selectedDate) return; // Prevent adding empty items
    setItems((prevItems) => {
      const updatedItems = { ...prevItems }; // Copy previous state

      if (!updatedItems[selectedDate]) {
        updatedItems[selectedDate] = []; // Create an array if the date doesn't exist
      }

      const allItems = Object.values(updatedItems).flat();
      const newId =allItems.length > 0 ? Math.max(...allItems.map((item) => item.id)) + 1 : 1;
      updatedItems[selectedDate].push({ ...newItem, id: newId, time: selectedTime }); // Add new item to the selected date
      console.log(updatedItems);
      return updatedItems; // Update state with new items
    });

    setNewItem({ name: "", data: "", time: "" });
  };

  const deleteData = (id, date) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };

      if (updatedItems[date]) {
        updatedItems[date] = updatedItems[date].filter(
          (item) => item.id !== id
        );

        // If the array becomes empty after filtering, delete the key
        if (updatedItems[date].length === 0) {
          delete updatedItems[date]; // Remove the date key
        }
      }
      console.log(updatedItems);
      return updatedItems; // Return the updated state
    });
  };

  const renderEmptyData = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, color: "#493628" }}>
          No events for this day
        </Text>
      </View>
    );
  };

  const customTheme = {
    ...calendarTheme, // Merge with default calendar theme
    agendaDayTextColor: "black", // Custom color for agenda day text
    agendaDayNumColor: "black", // Custom color for agenda day number
    agendaTodayColor: "black", // Custom color for today's agenda
    agendaKnobColor: "#B6917B", // Custom color for the agenda knob
    selectedDayBackgroundColor: "#B6917B",
    calendarBackground: "#FFE6D7",
    todayTextColor: "white",
    textMonthFontSize: 18,
    textSectionTitleColor: "black",
    reservationsBackgroundColor: "#EACEBE", //Agenda list backgroundColor
  };

  const RenderAgendaItem = React.memo(({ item }) => (
    <TouchableOpacity style={MyStyles.item}>
      <Text style={MyStyles.itemHeader}>{item.name}</Text>
      <Text style={MyStyles.itemText}>{item.data}</Text>
      <Text style={MyStyles.itemTime}>{item.time}</Text>
      <TouchableOpacity onPress={() => deleteData(item.id, selectedDate)} style={MyStyles.deleteButton}>
        <AntDesign name="delete" size={20} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  ));

  const [isModalVisible, setisModalVisible] = useState(false);

  return (
    <SafeAreaView style={MyStyles.container}>
      <View style={MyStyles.header}>
        <Text style={MyStyles.textHeader}>Demo Calendar</Text>
        <TouchableOpacity
          style={MyStyles.icon}
          onPress={() => setisModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={45} color="black" />
        </TouchableOpacity>
      </View>
      <Agenda
        items={items}
        showOnlySelectedDayItems={true}
        renderEmptyData={renderEmptyData}
        theme={customTheme}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        renderItem={(item, isFirst) => <RenderAgendaItem item={item} />}
      />

      <Modal
        visible={isModalVisible}
        onRequestClose={() => setisModalVisible(false)}
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
            <TouchableOpacity onPress={() => showMode('date')}>
              <TextInput
                style={MyStyles.input}
                value={selectedDate}
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showMode('time')}>
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
              testID='dateTimePicker'
              value={mode === 'date' ? date : time}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />)}

            <TouchableOpacity
              style={MyStyles.button}
              onPress={() => {
                addItemToAgenda();
                setisModalVisible(false);
              }}
            >
              <Text style={MyStyles.buttonText}>Add Item to Agenda</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <TouchableOpacity
            style={MyStyles.closeButton}
            onPress={() => setisModalVisible(false)}
          >
            <Text style={MyStyles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
