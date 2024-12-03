import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MarkFav from "../MarkFav";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function PetInfo({ pet }) {
    const [fetchedPet, setFetchedPet] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch pet details by ID
    const fetchPetDetails = async (id) => {
        try {
            const docRef = doc(db, "Pets", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFetchedPet(docSnap.data());
            } else {
                console.log("No pet data found for ID:", id);
            }
        } catch (error) {
            console.error("Error fetching pet details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pet?.id) {
            fetchPetDetails(pet.id);
        }
    }, [pet]);

    if (loading) {
        return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
    }

    return (
        fetchedPet && (
            <View>
                <Image
                    source={{ uri: fetchedPet?.imageUrl }}
                    style={{
                        width: "100%",
                        height: 400,
                        objectFit: "cover",
                    }}
                    onError={(error) =>
                        console.log(
                            "Image failed to load in PetInfo:",
                            error.nativeEvent.error
                        )
                    }
                />
                <View
                    style={{
                        padding: 20,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontFamily: "roboto-bold",
                                fontSize: 27,
                            }}
                        >
                            {fetchedPet?.name}{" "}
                        </Text>

                        <Text
                            style={{
                                fontFamily: "roboto",
                                fontSize: 16,
                                color: Colors.GRAY,
                            }}
                        >
                            {fetchedPet?.address}
                        </Text>
                    </View>
                    <MarkFav pet={pet} />
                </View>
            </View>
        )
    );
}
