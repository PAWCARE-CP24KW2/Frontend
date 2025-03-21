import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    FlatList,
    Image,
  } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyStyles } from "../styles/MyStyle";
import { getRecords } from "../api/agenda/getRecords";
import { deleteAgenda } from "../api/agenda/deleteAgenda";
import ConfirmModal from "../components/modals/ConfirmModal";
import appointmentIcon from "../assets/agendaIcons/appointment.png";
import bathIcon from "../assets/agendaIcons/bath.png";
import exerciseIcon from "../assets/agendaIcons/exercise.png";
import vaccineIcon from "../assets/agendaIcons/vaccine.png";
import medicationIcon from "../assets/agendaIcons/medication.png";
import treatmentIcon from "../assets/agendaIcons/treatment.png";
import foodIcon from "../assets/agendaIcons/food.png";
import groomingIcon from "../assets/agendaIcons/grooming.png";
import birthdayIcon from "../assets/agendaIcons/birthday.png";

export default function RecordsModal({ visible, onClose, petId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);

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

  useEffect(() => {
    if (visible) {
      fetchRecords();
    }
  }, [visible]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getRecords(petId);
      const sortedData = data.sort((a, b) => new Date(a.appointment) - new Date(b.appointment));
      setRecords(sortedData);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(/,/g, '');
  };

  const handleDeleteAgenda = async () => {
    try {
      await deleteAgenda(selectedAgendaId);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.agenda_id !== selectedAgendaId)
      );
      setConfirmModalVisible(false);
    } catch (error) {
      console.error("Error deleting agenda:", error);
    }
  };

  const renderRecordItem = ({ item }) => (
    <View style={styles.recordItem}>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => {
          setSelectedAgendaId(item.agenda_id);
          setConfirmModalVisible(true);
        }}
      >
        <Ionicons name="close" size={20} color="black" />
      </TouchableOpacity>

      {iconMapping[item.agenda_title] && (
        <Image source={iconMapping[item.agenda_title]} style={styles.icon} />
      )}

      <View style={styles.recordTextContainer}>
        <Text style={styles.recordTitle}>{item.agenda_title}</Text>
        <Text style={styles.recordDetails}>{item.agenda_message}</Text>
        <Text style={styles.recordDate}>{formatDate(item.appointment)}</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <ImageBackground
        source={require("../assets/wallpaper.jpg")}
        style={MyStyles.background}
      >
        <SafeAreaView style={[MyStyles.container, { flex: 1 }]}>
          <View style={MyStyles.arrowHeader}>
            <TouchableOpacity style={MyStyles.arrowIcon} onPress={onClose}>
            <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
            <View style={{ width: 35 }} />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Log records</Text>
            <Text style={styles.subTitle}>Keep history expired agenda</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#71543F" />
            ) : records.length > 0 ? (
              <FlatList
                data={records}
                keyExtractor={(item) => item.agenda_id.toString()}
                renderItem={renderRecordItem}
              />
            ) : (
              <Text style={styles.noRecordsText}>No records found</Text>
            )}
          </View>

        </SafeAreaView>
      </ImageBackground>

      <ConfirmModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={handleDeleteAgenda}
        message="Are you sure you want to delete this agenda?"
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 27,
      textAlign: "center",
    },
    subTitle: {
      fontSize: 15,
      textAlign: "center",
      marginBottom: 15,
      paddingVertical: 5,
    },
    recordItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      padding: 20,
      borderRadius: 10,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      position: "relative",
    },
    deleteIcon: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1,
    },
    recordTextContainer: {
      flex: 1,
      marginLeft: 15,
    },
    recordTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    recordDetails: {
      fontSize: 14,
      color: "#333",
    },
    recordDate: {
      fontSize: 14,
      color: "gray",
    },
    noRecordsText: {
      fontSize: 16,
      color: "gray",
      textAlign: "center",
      marginTop: 20,
    },
    icon: {
      width: 60,
      height: 60,
    },
  });