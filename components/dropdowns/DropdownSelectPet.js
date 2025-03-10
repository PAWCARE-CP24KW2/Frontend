import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { getPetsByUserId } from "../../api/pet/getPetFromId.js";

const DropdownSelectPet = ({ currentPet, setPetId }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [allPets, setAllPets] = useState([]);

  useEffect(() => {
    const getAllPets = async () => {
      try {
        const pets = await getPetsByUserId();
        const formattedPets = pets.map(pet => ({
          name: pet.pet_name,
          value: pet.pet_id,
        }));
        setAllPets(formattedPets);
        
        if (formattedPets.length > 0) {
          setValue(formattedPets[0].value); // Set the initial value to the first pet's pet_id
          setPetId(formattedPets[0].value); // Set the initial petId to the first pet's pet_id
        }
      } catch (error) {
        console.error('Failed to fetch pets in component:', error);
      }
    };
    getAllPets();
  }, []);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={allPets}
        maxHeight={300}
        labelField="name"
        valueField="value"
        placeholder={currentPet || 'Select a pet...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setPetId(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
            <Icon name="search" size={20} style={{marginLeft:5}} color="black"/>
        )}
      />
    </View>
  );
};

export default DropdownSelectPet;

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