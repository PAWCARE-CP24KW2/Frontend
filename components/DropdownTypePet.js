import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

const data = [
  { name: 'Dog', value: '1' },
  { name: 'Cat', value: '2' },
  { name: 'Hamster', value: '3' },
  { name: 'Horse', value: '4' },
  { name: 'Crocodie', value: '5' }
];
const DropdownTypeComponent = ({ Item, setItem, currentPet }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // useEffect(() => {
  //   if (currentTitle) {
  //     console.log("in dropdown " + currentTitle);
  //   }
  // }, [currentTitle]);

  return (
    <View style={styles.container}>
      
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="name"
        valueField="value"
        placeholder={currentPet || 'Select an Type'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setItem({ ...Item, type: item.type})
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
            <Icon name="search" size={20} style={{marginLeft:5}} color="black"/>
        )}
      />
    </View>
  );
};

export default DropdownTypeComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  dropdown: {
    height: 50,
    borderColor: 'black',
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
  },
  selectedTextStyle: {
    marginLeft: 10,
    fontSize: 16,
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