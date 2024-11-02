import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MyStyles } from "../styles/MyStyle";
import React, { useState, useEffect  } from "react";
import { Agenda } from "react-native-calendars";
import { calendarTheme } from "react-native-calendars";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddAgenda from "./AddAgenda";

export default function MyCalendar() {
  const getCurrentTime = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [items, setItems] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(getCurrentTime())

  useEffect(() => {
    console.log("Updated Date: " + selectedDate + ", Updated Time: " + selectedTime);
  }, [selectedDate, selectedTime]);

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
      <View style={{ flex: 1, alignItems: "center", marginTop: 25 }}>
        <Text style={{ fontSize: 20, color: "#493628", fontWeight: "bold" }}>
          No activity found for this day.
        </Text>
        <Text style={{ fontSize: 16, color: "#493628", textAlign: "center", margin: 10 }}>
          Add your first Schedule by clicking the + button at the top or button below.
        </Text>
        <TouchableOpacity style={MyStyles.button}>
          <Text style={MyStyles.buttonText} onPress={() => setisModalVisible(true)}>Create Activity</Text>
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

  const RenderAgendaItem = React.memo(({ item }) => (
    <TouchableOpacity style={MyStyles.item}>
      <Text style={MyStyles.itemHeader}>{item.name}</Text>
      <Text style={MyStyles.itemText}>{item.desc}</Text>
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
        <TouchableOpacity
          style={{marginRight: 12}}
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

      <AddAgenda
        isModalVisible={isModalVisible} // Pass the visibility state
        onClose={() => setisModalVisible(false)} // Close the modal
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setItems={setItems}
      />
    </SafeAreaView>
  );
}
