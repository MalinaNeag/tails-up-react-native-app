import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Home() {
    return (
        <View
            style={{
                padding: 20,
                marginTop: 20,
            }}
        >
            <Header />
            <Slider />
            <PetListByCategory />
            <TouchableOpacity style={styles.addNewPetContainer}>
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
            </TouchableOpacity>
        </View>
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
