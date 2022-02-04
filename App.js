import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { API_KEY } from "react-native-dotenv";
// import { API_KEY } from "@env";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// console.log(API_KEY);

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [location, setLocation] = useState();
    const [ok, setOk] = useState(true);
    const ask = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
            accuracy: 5,
        });
        Location.setGoogleApiKey("");
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        console.log(location);
        setCity(location[0].city);
    };
    useEffect(() => {
        ask();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={styles.weather}
            >
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightsteelblue",
    },
    city: {
        flex: 1,
        backgroundColor: "lightskyblue",
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 68,
        fontWeight: 500,
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    temperature: {
        fontSize: 100,
        marginTop: 50,
    },
    description: { fontSize: 50, marginTop: -20 },
});
