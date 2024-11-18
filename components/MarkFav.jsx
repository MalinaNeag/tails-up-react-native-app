import { View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";

export default function MarkFav({ pet = {}, color = "black" }) {
    const { user } = useUser();
    const [favList, setFavList] = useState([]);

    useEffect(() => {
        if (user) {
            GetFav();
        }
    }, [user]);

    const GetFav = async () => {
        try {
            const result = await Shared.GetFavList(user);
            console.log("Fetched favorite list:", result);
            setFavList(result?.favorites || []);
        } catch (error) {
            console.error("Error fetching favorite list:", error);
        }
    };

    const AddToFav = async () => {
        if (!pet?.docId) {
            console.warn(
                `Cannot add to favorites: pet or pet.docId is undefined. Pet name: ${
                    pet?.name || "Unknown"
                }`
            );
            return;
        }

        try {
            const favResult = [...favList, pet.docId];
            console.warn(`Adding pet to favorites: ${pet.name || "Unknown"}`); // Log the pet's name
            favResult.push(pet?.id);
            await Shared.UpdateFav(user, favResult);
            GetFav();
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    const removeFromFav = async () => {
        if (!pet?.docId) {
            console.warn(
                "Cannot remove from favorites: pet or pet.docId is undefined"
            );
            return;
        }

        try {
            const favResult = favList.filter((item) => item !== pet.docId);
            await Shared.UpdateFav(user, favResult);
            GetFav();
        } catch (error) {
            console.error("Error removing from favorites:", error);
        }
    };

    return (
        <View>
            {pet?.docId && favList.includes(pet.docId) ? (
                <Pressable onPress={removeFromFav}>
                    <Ionicons name="heart" size={30} color="red" />
                </Pressable>
            ) : (
                <Pressable onPress={AddToFav}>
                    <Ionicons name="heart-outline" size={30} color={color} />
                </Pressable>
            )}
        </View>
    );
}
