import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import DropdownMonths from "../components/dropdowns/DropdownMonths";
import { getExpensesByUserId } from "../api/expense/getExpenseByuserId";
import petplaceholder from "../assets/petplaceholder.png";
import AlertModal from "../components/modals/AlertModal";

const screenWidth = Dimensions.get("window").width;

export default function ExpenseBoard({ navigation }) {
  const [expensesByPet, setExpensesByPet] = useState([]);
  const [pets, setPets] = useState([]);
  const [modalDontHasPet, setModalDontHasPet] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const fetchPetsAndExpenses = async () => {
    try {
      const petData = await getPetsByUserId();
      setPets(petData);

      if (petData.length === 0) {
        setModalDontHasPet(true);
        return;
      }

      const expensesPromises = petData.map(async (pet) => {
        const expenses = await getExpensesByPetId(pet.pet_id);
        return { petName: pet.pet_name, expenses };
      });

      const expensesByPet = await Promise.all(expensesPromises);
      setExpensesByPet(expensesByPet);

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

      const predefinedColors = ["#593e15", "#845b24", "#ab7457", "#b35638", "#ffc97e"];

      const chartData = expensesByPet.map((petData, index) => {
        const totalAmount = petData.expenses.reduce((sum, expense) => {
          return sum + (parseFloat(expense.amount) || 0);
        }, 0);

        return {
          name: petData.petName || "Unnamed",
          population: totalAmount || 0,
          color: predefinedColors[index % predefinedColors.length], // Use predefined colors
          legendFontColor: "#493628",
          legendFontSize: 15,
        };
      });

      const sortedData = chartData.sort(
        (a, b) => b.population - a.population
      );

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
          color: "#CCCCCC",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        });
      }

      setChartData(top4);
    } catch (error) {
      console.error("Error fetching pets or expenses:", error);
    }
  };

  const fetchUserExpenses = async () => {
    try {
      const userExpenses = await getExpensesByUserId();
      setExpenses(userExpenses);
    } catch (error) {
      console.error("Failed to fetch user expenses:", error);
    }
  };
  
  const filterExpensesByMonth = (month) => {
    if (!month) {
      setFilteredExpenses([]);
      return;
    }

    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.created_at);
      const formattedMonth = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(expenseDate);

      return formattedMonth === month;
    });

    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    filterExpensesByMonth(selectedMonth);
  }, [selectedMonth, expenses]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPetsAndExpenses();
      fetchUserExpenses();
    }, [])
  );

  const handleNavigate = () => {
    setModalDontHasPet(false);
    navigation.navigate("Home");
  };

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
        <View style={styles.header}>
          <Text style={styles.headerText}>Expense Dashboard</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Expenses by Pet</Text>
            <PieChart
              data={chartData}
              width={screenWidth - 80}
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
              absolute
            />
            <Text style={styles.totalText}>
              Totals of Expense:{" "}
              {chartData
                .reduce((sum, item) => sum + item.population, 0)
                .toFixed(2)}{" "}
              baht
            </Text>
            <View style={styles.underline} />
            <TouchableOpacity
              onPress={() => navigation.navigate("ExpenseHistory")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>See all expense records</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Filter by Months</Text>
            <View style={styles.filterContainer}>
              <DropdownMonths
                selectedMonth={selectedMonth}
                expenses={expenses}
                onValueChange={(month) => {
                  setSelectedMonth(month);
                }}
              />
            </View>

            {filteredExpenses.map(renderExpenseItem)}
        
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.createPetButton}
          onPress={() => navigation.navigate("AddExpense")}
        >
          <Image source={vet} style={styles.addIcon} />
        </TouchableOpacity>

        <AlertModal
          visible={modalDontHasPet}
          onConfirm={() => handleNavigate()}
          message={`You need to create pet's profile to add Expense.`}
          buttonText="Add pet"
        />

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
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    backgroundColor: "#493628",
  },
  headerText: {
    fontSize: 26,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    color: "white",
    includeFontPadding: false,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#493628",
    marginHorizontal: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#493628",
    padding: 10,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#FFF",
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
  text: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    color: "#493628",
    textAlign: "center",
    marginTop: 10,
  },
  filterContainer: {
    marginTop: 0,
    alignItems: "center",
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
});
