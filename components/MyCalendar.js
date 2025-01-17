import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { MyStyles } from "../styles/MyStyle";
import React, { useState, useEffect, useCallback } from "react";
import { Agenda } from "react-native-calendars";
import { calendarTheme } from "react-native-calendars";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddAgenda from "./AddAgendaModal.js";
import UpdateAgenda from "./UpdateAgendaModal.js";
import { showDelToast } from "../composable/showToast.js";
import { fetchAgendas } from "../composable/getAllAgendas.js";
import { deleteAgenda } from "../composable/deleteAgenda.js";
import { logProfileData } from "react-native-calendars/src/Profiler.js";
import { cancelNotification } from "../composable/notificationService.js";

export default function MyCalendar() {

  useEffect(() => {
     const getAgendas = async () => {
      try {
        const agendas = await fetchAgendas();
        setItems(agendas); 
        // console.log('Transformed Agenda:', agendas);
      } catch (error) {
        console.error('Failed to fetch agendas in component:', error);
      }
    };
    getAgendas();
  }, []);

  const getCurrentTime = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(getCurrentTime());
  const [editDate, setEditDate] = useState("");
  const [currentTitle, setCurrentTitle] = useState(null);

  const deleteData = useCallback(async (id, date, title) => {
    try {
      await deleteAgenda(id);

      setItems((prevItems) => {
        const updatedItems = { ...prevItems };
        if (updatedItems[date]) {
          showDelToast(title);
          const itemToDelete = updatedItems[date].find((item) => item.id === id);
          if (itemToDelete && itemToDelete.notificationId) {
            cancelNotification(itemToDelete.notificationId);
            console.log('Notification cancelled:', itemToDelete.notificationId);
          }
          updatedItems[date] = updatedItems[date].filter((item) => item.id !== id);

          // If the array becomes empty after filtering, delete the key
          if (updatedItems[date].length === 0) {
            delete updatedItems[date];
          }
        }

        return updatedItems;
      });
    } catch (error) {
      console.error('Error deleting agenda:', error);
    }
  }, []);


  const renderEmptyData = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", marginTop: 25 }}>
        <Text style={{ fontSize: 20, color: "#493628", fontWeight: "bold" }}>
          No activity found for this day.
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#493628",
            textAlign: "center",
            margin: 10,
          }}
        >
          Add your first Schedule by clicking the + button at the top or button
          below.
        </Text>
        <TouchableOpacity style={MyStyles.button}>
          <Text
            style={MyStyles.buttonText}
            onPress={() => setisAddModalVisible(true)}
          >
            Create Activity
          </Text>
        </TouchableOpacity>
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

  const RenderAgendaItem = React.memo(({ item, date }) => (
    <TouchableOpacity
      style={MyStyles.item}
      onPress={() => {
        setSelectedItem(item); // Store the selected item
        setEditDate(date);
        setisEditModalVisible(true); // Open the modal
        setCurrentTitle(item.title);
      }}
    >
      <Text style={MyStyles.itemHeader}>{item.title}</Text>
      <Text style={MyStyles.itemText}>{item.message}</Text>
      <Text style={MyStyles.itemTime}>{item.time}</Text>
      <TouchableOpacity
        onPress={() => deleteData(item.id, selectedDate, item.title)}
        style={MyStyles.deleteButton}
      >
        <AntDesign name="delete" size={20} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  ));

  const [isAddModalVisible, setisAddModalVisible] = useState(false);
  const [isEditModalVisible, setisEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <SafeAreaView style={MyStyles.container}>
      <View style={MyStyles.header}>
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => setisAddModalVisible(true)}
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
        renderItem={(item) => <RenderAgendaItem item={item} date={selectedDate} />}
      />

      <AddAgenda
        isAddModalVisible={isAddModalVisible} // Pass the visibility state
        onClose={() => setisAddModalVisible(false)} // Close the modal
        getCurrentTime={getCurrentTime}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setItems={setItems}
      />

      <UpdateAgenda
        isEditModalVisible={isEditModalVisible}
        onClose={() => setisEditModalVisible(false)}
        selectedItem={selectedItem}
        selectedDate={editDate}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setItems={setItems}
        currentTitle={currentTitle}
      />
    </SafeAreaView>
  );
}
