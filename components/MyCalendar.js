import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { MyStyles } from "../styles/MyStyle";
import React, { useState, useEffect, useCallback } from "react";
import { Agenda } from "react-native-calendars";
import { calendarTheme } from "react-native-calendars";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddAgenda from "./AddAgenda";
import UpdateAgenda from "./UpdateAgenda";
import { showDelToast } from "../composable/showToast.js";
import { fetchAgendas } from "../composable/fetchAgendas.js";
import { deleteAgenda } from "../composable/deleteAgenda.js";

export default function MyCalendar() {

  useEffect(() => {
    const getAgendas = async () => {
      try {
        const agendas = await fetchAgendas();

        const transformedAgendas = {};
        agendas.forEach(agenda => {
          const date = agenda.appointment.split('T')[0];
          const time = agenda.appointment.split('T')[1].split(':').slice(0, 2).join(':');
          if (!transformedAgendas[date]) {
            transformedAgendas[date] = [];
          }
          transformedAgendas[date].push({
            id: agenda.agenda_id,
            title: agenda.agenda_title,
            message: agenda.agenda_message,
            status: agenda.status,
            time: time,
          });
        });

        setItems(transformedAgendas); // Update items state
        console.log('Transformed Agenda:', transformedAgendas);
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

  const deleteData = useCallback( async (id, date, title) => {
    try {
      
      await deleteAgenda(id);

      setItems((prevItems) => {
        const updatedItems = { ...prevItems };
        if (updatedItems[date]) {
          showDelToast(title); // Show deletion toast with title
          updatedItems[date] = updatedItems[date].filter((item) => item.id !== id);

          // If the array becomes empty after filtering, delete the key
          if (updatedItems[date].length === 0) {
            delete updatedItems[date]; // Remove the date key if no more items exist for that date
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
        console.log(item)
        console.log("Selected Date:", date)
        console.log("===================")
        setisEditModalVisible(true); // Open the modal
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
      />
    </SafeAreaView>
  );
}
