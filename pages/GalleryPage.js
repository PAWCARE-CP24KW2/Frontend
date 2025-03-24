import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyStyles } from "../styles/MyStyle";
import getGallery from "../api/pet/gallery/getGallery";

export default function GalleryPage({ navigation, route }) {
  const { petId, petName } = route.params;
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGalleryData = async () => {
    try {
      const galleryData = await getGallery(petId);
      setGalleryData(galleryData);
      // console.log("Gallery Data:", galleryData);
    } catch (error) {
      console.error("Failed to fetch gallery data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGalleryData();
  };

  const renderImageItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.gallery_path }} style={styles.image} />
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={styles.background}
    >
      <SafeAreaView style={MyStyles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>{`${petName}'s Gallery`}</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : galleryData.length > 0 ? (
          <FlatList
            data={galleryData}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => item.gallery_id.toString()}
            numColumns={2}
            contentContainerStyle={styles.galleryList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Text style={styles.noDataText}>No images available.</Text>
        )}
        
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    color: "white",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  galleryList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
});