import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

export default function Home() {
    const [refreshing, setRefreshing] = useState(false);

    // Function to handle refresh
    const onRefresh = async () => {
        setRefreshing(true);

        // Simulate a refresh by calling functions from child components
        // Add any global refresh logic here, if applicable
        try {
            // If you have any global fetch functions, call them here
            console.log("Refreshing Home Screen...");
        } catch (error) {
            console.error("Error during refresh:", error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                paddingBottom: 50, // Add extra padding for the bottom
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Header />
            <Slider />
            <PetListByCategory />
            <Link href={"/add-new-pet"} style={styles.addNewPetContainer}>
                <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
                <Text
                    style={{
                        fontFamily: "roboto-medium",
                        color: Colors.PRIMARY,
                        fontSize: 18,
                    }}
                >
                    Add New Pet
                </Text>
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    addNewPetContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        padding: 20,
        marginTop: 20,
        textAlign: "center",
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: 15,
        borderStyle: "dashed",
        justifyContent: "center",
    },
});
