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

export default function NewPet({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.topNavBar}>
        <Ionicons name="search-outline" size={24} color="black" />
        <Ionicons name="add-outline" size={24} color="black" />
      </SafeAreaView>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Add a new pet</Text>
        <TouchableOpacity style={styles.actionButton}>
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
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>IMPORT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5D6C6",
  },
  topNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#DAB49D",
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
