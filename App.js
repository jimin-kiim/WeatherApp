import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GOOGLE_API, WEATER_API } from "./secrets.json";
// import { API_KEY } from "react-native-dotenv";
// import { API_KEY } from "@env";
import { Ionicons } from "@expo/vector-icons";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// console.log(GOOGLE_API);

const date = new Date().getDate();
const month = new Date().toString().substring(4, 7);
console.log(date, month);

const icons = {
    Clouds: "cloudy-outline",
    Clear: "sunny-outline",
    Rain: "rainy-outline",
    Atmosphere: "partly-sunny-outline",
    Snow: "snow-outline",
    Drizzle: "rainy-outline",
    Thunderstorm: "thunerstorm-outline",
};
export default function App() {
    const [city, setCity] = useState("Loading...");
    const [days, setDays] = useState([]);
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
        Location.setGoogleApiKey(GOOGLE_API);
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        console.log(location);
        setCity(location[0].city);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${WEATER_API}&units=metric`
        );
        const json = await response.json();
        console.log(json);
        setDays(json.daily);
        console.log(new Date());
        console.log();
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
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator
                            color="white"
                            style={{ marginTop: 10 }}
                            size="large"
                        />
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.forecast}>
                            <View>
                                {(function () {
                                    if (!index)
                                        return (
                                            <Text style={styles.date}>
                                                Today
                                            </Text>
                                        );
                                    if (index === 1)
                                        return (
                                            <Text style={styles.date}>
                                                Tomorrow
                                            </Text>
                                        );
                                    else
                                        return (
                                            <Text style={styles.date}>
                                                {month} {date + index}
                                            </Text>
                                        );
                                })()}
                            </View>
                            <View style={styles.day}>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={styles.temperature}>
                                        {parseFloat(day.temp.day).toFixed(1)}
                                    </Text>

                                    <Text style={styles.description}>
                                        {day.weather[0].main}
                                    </Text>
                                    <Text style={styles.tinyText}>
                                        {day.weather[0].description}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={icons[day.weather[0].main]}
                                    size={40}
                                    color="black"
                                />
                            </View>
                        </View>
                    ))
                )}
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
        paddingTop: 20,
    },
    cityName: {
        fontSize: 68,
        fontWeight: "500",
    },
    forecast: {
        alignItems: "center",
    },
    date: {
        fontSize: 30,
        fontWeight: 200,
        paddingTop: 50,
    },
    day: {
        width: SCREEN_WIDTH,
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 40,
        paddingLeft: 20,
    },
    temperature: {
        fontSize: 100,
        marginTop: 50,
    },
    description: { fontSize: 50, marginTop: 20, fontWeight: 300 },
    tinyText: {
        fontSize: 20,
        fontWeight: 300,
    },
});
