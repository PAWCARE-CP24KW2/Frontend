import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";

export default function NewPet({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.topNavBar}>
        <View style={MyStyles.header}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={45} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Add a new pet</Text>
        <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('AddPet')}
        >
          <Text style={styles.actionText}>ADD</Text>
          
        </TouchableOpacity>

        {/* Pet Icons */}
        <Image
          source={{
            uri: "https://img.icons8.com/color/96/dog.png",
          }}
          style={styles.petImage}
        />
        <Image
          source={{
            uri: "https://img.icons8.com/color/96/cat.png",
          }}
          style={styles.petImage}
        />

        <Text style={styles.title}>Import a pet</Text>
        <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('ImportPet')}
        >
          <Text style={styles.actionText}>IMPORT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E4D8",
  },
  topNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#B6917B",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3E2C2C",
    marginBottom: 10,
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "#6B4F4F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  petImage: {
    width: 80,
    height: 80,
    marginVertical: 10,
    resizeMode: "contain",
  },
});
