import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { MyStyles } from "../../styles/MyStyle.js";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Agenda, calendarTheme } from "react-native-calendars";
import AntDesign from "@expo/vector-icons/AntDesign";
import AddAgenda from "../modals/AddAgendaModal.js";
import UpdateAgenda from "../modals/UpdateAgendaModal.js";
import { showDelToast } from "../../services/showToast.js";
import { fetchAgendas } from "../../api/agenda/getAllAgendas.js";
import { deleteAgenda } from "../../api/agenda/deleteAgenda.js";
import { cancelNotification } from "../../services/notificationService.js";
import ConfirmModal from "../modals/ConfirmModal.js";
import AlertModal from "../modals/AlertModal.js";
import { getPetsByUserId } from "../../api/pet/getPetFromId.js";
import LoadingScreen from "./LoadingScreen.js";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPetByPetId } from "../../api/pet/getPetByPetId.js";
import addAgenda from "../../assets/addAgenda.png";

import appointmentIcon from "../../assets/agendaIcons/appointment.png";
import bathIcon from "../../assets/agendaIcons/bath.png";
import exerciseIcon from "../../assets/agendaIcons/exercise.png";
import vaccineIcon from "../../assets/agendaIcons/vaccine.png";
import medicationIcon from "../../assets/agendaIcons/medication.png";
import treatmentIcon from "../../assets/agendaIcons/treatment.png";
import foodIcon from "../../assets/agendaIcons/food.png";
import groomingIcon from "../../assets/agendaIcons/grooming.png";
import birthdayIcon from "../../assets/agendaIcons/birthday.png";

export default function MyCalendar({ navigation }) {
  const getCurrentTime = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState(getCurrentTime());
  const [editDate, setEditDate] = useState("");
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isAddModalVisible, setisAddModalVisible] = useState(false);
  const [isEditModalVisible, setisEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDontHasPet, setModalDontHasPet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const iconMapping = {
    Appointment: appointmentIcon,
    Bath: bathIcon,
    Exercise: exerciseIcon,
    Vaccine: vaccineIcon,
    Medication: medicationIcon,
    Treatment: treatmentIcon,
    Food: foodIcon,
    Grooming: groomingIcon,
    Birthday: birthdayIcon,
  };

  const getAgendas = async () => {
    const pets = await getPetsByUserId();
    if (pets.length === 0) {
      setLoading(false);
      setModalDontHasPet(true);
      return;
    }
    setModalDontHasPet(false);

    try {
      const agendas = await fetchAgendas();
      setItems(agendas);
    } catch (error) {
      console.error("Failed to fetch agendas in component:", error);
    } finally {
      setLoading(false);
    }

    const petNames = {};
    for (const pet of pets) {
      if (pet.pet_id) {
        try {
          const petData = await getPetByPetId(pet.pet_id);
          petNames[pet.pet_id] = pet.pet_name;
        } catch (error) {
          console.error(
            `Failed to fetch pet name for pet_id ${pet.pet_id}:`,
            error
          );
        }
      }
    }

    setItems((prevItems) => {
      const updatedItems = {};
      for (const date in prevItems) {
        updatedItems[date] = prevItems[date].map((appointment) => ({
          ...appointment,
          pet_name: petNames[appointment.petid] || "Unknown Pet",
        }));
      }
      return updatedItems;
    });
  };

  useFocusEffect(
    useCallback(() => {
      getAgendas();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getAgendas();
    setRefreshing(false);
  };

  const deleteData = useCallback(async (id, date, title) => {
    try {
      await deleteAgenda(id);

      setItems((prevItems) => {
        const updatedItems = { ...prevItems };
        if (updatedItems[date]) {
          showDelToast(title);
          const itemToDelete = updatedItems[date].find(
            (item) => item.id === id
          );
          if (itemToDelete && itemToDelete.notificationId) {
            cancelNotification(itemToDelete.notificationId);
          }
          updatedItems[date] = updatedItems[date].filter(
            (item) => item.id !== id
          );

          if (updatedItems[date].length === 0) {
            delete updatedItems[date];
          }
        }

        return updatedItems;
      });
    } catch (error) {
      console.error("Error deleting agenda:", error);
    }
  }, []);

  const renderEmptyData = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", marginTop: 25 }}>
        <Text style={{ fontSize: 20, color: "#493628", fontFamily: "ComfortaaBold", }}>
          No activity found for this day.
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "ComfortaaBold",
            color: "#493628",
            textAlign: "center",
            margin: 10,
          }}
        >
          Add your first Schedule by clicking the + button at the top or button
          below.
        </Text>
        <TouchableOpacity style={styles.noPetButton}>
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
    ...calendarTheme,
    agendaDayTextColor: "black",
    agendaDayNumColor: "black",
    agendaTodayColor: "black",
    agendaKnobColor: "#493628",
    selectedDayBackgroundColor: "#493628",
    calendarBackground: "#f1e8e1",
    todayTextColor: "blue",
    textMonthFontSize: 18,
    textSectionTitleColor: "black",
    reservationsBackgroundColor: "#eadfd9",
  };

  const handleDeletePress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      deleteData(selectedItem.id, selectedDate, selectedItem.title);
      setModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleNavigate = () => {
    setModalDontHasPet(false);
    navigation.navigate("Home");
  };

  const RenderAgendaItem = React.memo(({ item, date }) => {
    return (
      <TouchableOpacity
        style={MyStyles.item}
        onPress={() => {
          setSelectedItem(item);
          setEditDate(date);
          setisEditModalVisible(true);
          setCurrentTitle(item.title);
        }}
      >
        <View style={styles.itemContainer}>
          {iconMapping[item.title] && (
            <Image source={iconMapping[item.title]} style={styles.icon} />
          )}
          <View style={styles.textContainer}>
            <Text style={MyStyles.itemHeader}>
              {item.title} <Text style={styles.petName}>({item.pet_name})</Text>
            </Text>
            <Text style={MyStyles.itemText}>{item.message}</Text>
            <Text style={MyStyles.itemTime}>{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeletePress(item)}
          style={MyStyles.deleteButton}
        >
          <AntDesign name="delete" size={20} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  });

  if (loading) {
    return (
      <SafeAreaView style={MyStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Calendar</Text>
        </View>
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
      </View>

      <Agenda
        items={items}
        showOnlySelectedDayItems={true}
        renderEmptyData={renderEmptyData}
        theme={customTheme}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        renderItem={(item) => (
          <RenderAgendaItem item={item} date={selectedDate} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.createAgenButton}
        onPress={() => setisAddModalVisible(true)}
      >
        <Image source={addAgenda} style={styles.addIcon} />
      </TouchableOpacity>

      <AddAgenda
        isAddModalVisible={isAddModalVisible}
        onClose={() => setisAddModalVisible(false)}
        getCurrentTime={getCurrentTime}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setItems={setItems}
        getAgendas={getAgendas}
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

      <ConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${
          selectedItem ? selectedItem.title : ""
        } ?`}
      />

      <AlertModal
        visible={modalDontHasPet}
        onConfirm={() => handleNavigate()}
        message={`You need to create pet's profile to add activity.`}
        buttonText="Add pet"
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    backgroundColor: "#493628",
  },
  headerText: {
    fontSize: 30,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    color: "white",
  },
  petName: {
    fontSize: 14,
    color: "#493628",
  },
  noPetButton: {
    backgroundColor: "#71543F",
    padding: 10,
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginLeft: 5,
  },
  createAgenButton: {
    position: "absolute",
    backgroundColor: "#71543F",
    borderRadius: 100,
    padding: 12,
    bottom: 10,
    right: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addIcon: {
    width: 46,
    height: 46,
  },
};
