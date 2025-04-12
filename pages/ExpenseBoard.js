import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { MyStyles } from "../styles/MyStyle";
import { StatusBar } from "expo-status-bar";
import vet from "../assets/vet.png";
import { Image } from "expo-image";
import { getExpensesByPetId } from "../api/expense/getExpenseByPetId";
import { getPetsByUserId } from "../api/pet/getPetFromId";

const screenWidth = Dimensions.get("window").width;

export default function ExpenseBoard({ navigation }) {
  const [expensesByPet, setExpensesByPet] = useState([]);
  const [pets, setPets] = useState([]);
  const [chartData, setChartData] = useState([]);


  useEffect(() => {
    const fetchPetsAndExpenses = async () => {
      try {
        // Fetch pets
        const petData = await getPetsByUserId();
        setPets(petData);

        // Fetch expenses for each pet
        const expensesPromises = petData.map(async (pet) => {
          const expenses = await getExpensesByPetId(pet.pet_id);
          return { petName: pet.pet_name, expenses };
        });

        const expensesByPet = await Promise.all(expensesPromises);
        setExpensesByPet(expensesByPet);

        // Process data for Pie Chart
        if (expensesByPet.length === 0) {
          setChartData([
            {
              name: "No Data",
              population: 1,
              color: "#CCCCCC",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
          ]);
          return;
        }

        // Calculate total expenses for each pet
        const chartData = expensesByPet.map((petData) => {
          const totalAmount = petData.expenses.reduce((sum, expense) => {
            return sum + (parseFloat(expense.amount) || 0); // Ensure `amount` is a valid number
          }, 0);

          return {
            name: petData.petName || "Unnamed",
            population: totalAmount || 0, // Fallback to 0 if totalAmount is invalid
            color: getRandomColor(),
            legendFontColor: "#493628",
            legendFontSize: 15,
          };
        });

        // Sort data by population in descending order
        const sortedData = chartData.sort(
          (a, b) => b.population - a.population
        );

        // Limit to top 4 items and combine the rest into "Others"
        const top4 = sortedData.slice(0, 4);
        const others = sortedData.slice(4);
        const othersTotal = others.reduce(
          (sum, item) => sum + item.population,
          0
        );

        if (othersTotal > 0) {
          top4.push({
            name: "Others",
            population: othersTotal,
            color: "#CCCCCC", // Gray color for "Others"
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          });
        }

        setChartData(top4);
      } catch (error) {
        console.error("Error fetching pets or expenses:", error);
      }
    };

    fetchPetsAndExpenses();
  }, []);

  const renderExpenseItem = ({ item }) => (
    <View style={styles.recordItem}>
    <TouchableOpacity style={styles.expenseItem}>
      <Image
        source={
          item.profile_path
            ? { uri: item.profile_path }
            : require("../assets/petplaceholder.png")
        }
        style={styles.expenseImage}
      />
      <View style={styles.expenseTextContainer}>
        <Text style={styles.expenseTitle}>{item.expense_title}</Text>
        <Text style={styles.expenseDetail}>{item.expense_detail}</Text>
        <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
    </View>
  );

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={MyStyles.background}
    >
      <StatusBar backgroundColor="transparent" style="dark" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Expense Dashboard</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Expenses by Pet</Text>
          <PieChart
            data={chartData}
            width={screenWidth - 40} // Adjust width to fit the screen
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute // Show absolute values
          />
          <Text style={styles.sectionTitle}>
            Totals of Expense :{" "}
            {chartData
              .reduce((sum, item) => sum + item.population, 0)
              .toFixed(2)}
          </Text>

          <View style={styles.underline} />
          <View style={{ marginTop: 20 }}>
            <Text 
            style={styles.sectionTitle}
            onPress={() => navigation.navigate("ExpenseHistory")}>
            Expense Records
            </Text>
          </View>
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
    includeFontPadding: false,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "ComfortaaBold",
    marginBottom: 10,
    textAlign: "center",
  },
  underline: {
    borderBottomWidth: 2, // Thickness of the line
    borderBottomColor: "#493628", // Color of the line
    marginHorizontal: 20, // Add margin to the sides
    marginTop: 10, // Add spacing above the line
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
  totalText: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    color: "#493628",
    textAlign: "center",
    marginTop: 5,
  },
    recordItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      padding: 18,
      borderRadius: 10,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      position: "relative",
    },
});
