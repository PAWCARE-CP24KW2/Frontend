import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCategories } from '../../api/agenda/getCategories';

const DropdownComponent = ({ newItem, setNewItem, currentTitle }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const formattedCategories = data.map(category => ({
          name: category.category_name,
          value: category.agenda_category_id,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Failed to fetch categories in component:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categories}
        search
        maxHeight={300}
        labelField="name"
        valueField="value"
        placeholder={currentTitle || 'Select an appointment...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setNewItem({ ...newItem, title: item.name, category_id: item.value });
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
            <Icon name="search" size={20} style={{marginLeft:5}} color="black"/>
        )}
      />
    </View>
  );
};

export default DropdownComponent;

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