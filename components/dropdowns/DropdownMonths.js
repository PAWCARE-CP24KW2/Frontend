import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

export default function DropdownMonths({ selectedMonth, onValueChange, expenses }) {
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    if (expenses.length > 0) {
      const months = expenses.map((expense) => {
        const date = new Date(expense.created_at);
        return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
      });

      const uniqueMonths = [...new Set(months)];
      setAvailableMonths(uniqueMonths);
    }
  }, [expenses]);

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Select Month" value="" />
        {availableMonths.map((month, index) => (
          <Picker.Item key={index} label={month} value={month} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderBlockColor: "#493628",
  },
  picker: {
    height: 55,
    width: "100%",
  },
});