import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/Ionicons";

const data = [
  { name: "Dog", value: "1" },
  { name: "Cat", value: "2" },
  { name: "Hamster", value: "3" },
  { name: "Spider", value: "4" },
  { name: "Bird", value: "5" },
  { name: "Rabbit", value: "6" },
  { name: "Hedgehog", value: "7" },
  { name: "fish", value: "8" },
  { name: "Turtle", value: "9" },
  { name: "Snake", value: "10" },
  { name: "Monkey", value: "11" },
  { name: "Crayfish", value: "12" },
  { name: "Gecko", value: "13" },
];

const DropdownTypeComponent = ({ Item, setItem, currentPet }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "black" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="name"
        valueField="value"
        placeholder={currentPet || "Select a Type"}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setItem({ ...Item, type: item.name });
          setValue(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <Icon
            name="search"
            size={20}
            style={{ marginLeft: 5 }}
            color="black"
          />
        )}
      />
    </View>
  );
};

export default DropdownTypeComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "ComfortaaBold",
  },
  selectedTextStyle: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "ComfortaaBold",
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});