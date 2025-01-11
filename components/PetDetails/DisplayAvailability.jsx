import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Calendar } from "react-native-calendars";
import Colors from "../../constants/Colors";

const DisplayAvailability = ({ pet }) => {
    const availability = pet?.availability;

    if (!availability) {
        return (
            <View style={styles.availabilityContainer}>
                <Text style={styles.noAvailabilityText}>
                    No availability provided
                </Text>
            </View>
        );
    }

    // Convert availability string to marked dates object for Calendar
    const markedDates = availability.split(", ").reduce((acc, date) => {
        acc[date.trim()] = {
            selected: true,
            marked: true,
            selectedColor: Colors.PRIMARY,
        };
        return acc;
    }, {});

    return (
        <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityTitle}>Availability</Text>
            <Calendar
                markedDates={markedDates}
                theme={{
                    selectedDayBackgroundColor: Colors.PRIMARY,
                    todayTextColor: Colors.SECONDARY,
                    arrowColor: Colors.PRIMARY,
                    monthTextColor: Colors.PRIMARY,
                    textDayFontFamily: "roboto",
                    textMonthFontFamily: "roboto-bold",
                    textDayHeaderFontFamily: "roboto-medium",
                }}
            />
        </View>
    );
};

export default DisplayAvailability;

const styles = StyleSheet.create({
    availabilityContainer: {
        marginHorizontal: 30,
        marginVertical: 10,
        borderRadius: 10,
    },
    noAvailabilityText: {
        fontFamily: "roboto",
        fontSize: 16,
        color: Colors.GRAY,
    },
    availabilityTitle: {
        fontFamily: "roboto-medium",
        fontSize: 20,
        marginBottom: 10,
    },
    noAvailabilityText: {
        fontFamily: "roboto",
        fontSize: 20,
        color: Colors.GRAY,
    },
    dateContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    dateBox: {
        width: 60,
        height: 60,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },
    dateDay: {
        fontFamily: "roboto",
        fontSize: 12,
        color: Colors.WHITE,
    },
    date: {
        fontFamily: "roboto-bold",
        fontSize: 20,
        color: Colors.WHITE,
    },
    dateMonth: {
        fontFamily: "roboto",
        fontSize: 12,
        color: Colors.WHITE,
    },
});
