import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getExpenseById } from "../api/expense/getExpenseById";
import { deleteExpense } from "../api/expense/deleteExpense";
import ConfirmModal from "../components/modals/ConfirmModal";

export default function ViewExpenseDetail({ route, navigation }) {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    fetchExpenseDetail();
  }, []);

  const fetchExpenseDetail = async () => {
    try {
      setLoading(true);
      const data = await getExpenseById(expenseId);
      setExpense(data);
    } catch (error) {
      console.error("Error fetching expense detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await deleteExpense(expenseId);
      setConfirmModalVisible(false);
      navigation.goBack(); // กลับไปยังหน้าก่อนหน้า
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#71543F" />
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Expense not found</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={MyStyles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.headerText}>Expense Detail</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Image
                source={
                  expense.profile_path
                    ? { uri: expense.profile_path }
                    : require("../assets/petplaceholder.png")
                }
                style={styles.avatar}
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.name}>{expense.pet_name}</Text>
                <Text style={styles.date}>Amount: {expense.amount}</Text>
              </View>
            </View>
            <Text style={styles.title}>{expense.expense_title}</Text>
            <Text style={styles.contentText}>{expense.expense_detail}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setConfirmModalVisible(true)}
        >
          <Ionicons name="trash-outline" size={30} color="white" />
        </TouchableOpacity>
        <ConfirmModal
          visible={confirmModalVisible}
          onConfirm={handleDeleteExpense}
          onClose={() => setConfirmModalVisible(false)}
          message="Are you sure you want to delete this expense?"
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    color: "white",
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 0.5,
    borderColor: "black",
  },
  headerTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: "ComfortaaBold",
    color: "#000",
  },
  date: {
    fontSize: 14,
    fontFamily: "Comfortaa",
    color: "gray",
  },
  title: {
    fontSize: 20,
    fontFamily: "ComfortaaBold",
    color: "#000",
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    fontFamily: "Comfortaa",
    color: "#4A2C23",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  deleteButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});