import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { StatusBar } from "expo-status-bar";
import vet from "../assets/vet.png";
import { getExpensesByPetId } from "../api/expense/getExpenseByPetId";
import { getPetsByUserId } from "../api/pet/getPetFromId";
import petplaceholder from "../assets/petplaceholder.png";

export default function ExpenseBoard({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllExpenses = async () => {
    try {
      setLoading(true);

      // ดึง pet_id ทั้งหมดของผู้ใช้
      const pets = await getPetsByUserId();
      const petIds = pets.map((pet) => pet.pet_id);

      // ดึง expense ของสัตว์เลี้ยงแต่ละตัว
      const allExpenses = [];
      for (const petId of petIds) {
        const petExpenses = await getExpensesByPetId(petId);
        allExpenses.push(...petExpenses);
      }

      setExpenses(allExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAllExpenses(); // เรียก fetchAllExpenses เมื่อหน้าถูกโฟกัส
    });

    return unsubscribe; // Cleanup listener เมื่อ component ถูก unmount
  }, [navigation]);

  const renderExpenseItem = (expense) => (
    <TouchableOpacity
      key={expense.expense_id}
      style={styles.recordItem}
      onPress={() =>
        navigation.navigate("ViewExpenseDetail", { expenseId: expense.expense_id })
      }
    >
      <Image
        source={expense.profile_path ? { uri: expense.profile_path } : petplaceholder}
        style={styles.icon}
      />
      <View style={styles.recordTextContainer}>
        <Text style={styles.recordTitle}>{expense.expense_title}</Text>
        <Text style={styles.recordDetails}>Amount: {expense.amount} baht</Text>
        <Text style={styles.recordDetails}>Pet name: {expense.pet_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={MyStyles.background}
    >
      <StatusBar backgroundColor="transparent" style="dark" />
      <SafeAreaView style={styles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>Expenses History</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#71543F" />
          ) : expenses.length > 0 ? (
            expenses.map(renderExpenseItem)
          ) : (
            <Text style={styles.noRecordsText}>No expenses found</Text>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.createPetButton}
          onPress={() => navigation.navigate("AddExpense")}
        >
          <Image source={vet} style={styles.addIcon} />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    color: "white",
    includeFontPadding: false,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recordTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  recordTitle: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    color: "#000",
  },
  recordDetails: {
    fontSize: 14,
    fontFamily: "ComfortaaBold",
    color: "#333",
  },
  noRecordsText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  addIcon: {
    width: 50,
    height: 50,
  },
  createPetButton: {
    position: "absolute",
    backgroundColor: "#71543F",
    borderRadius: 100,
    padding: 10,
    bottom: 10,
    right: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});