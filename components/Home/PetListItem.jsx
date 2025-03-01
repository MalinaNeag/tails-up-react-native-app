import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "./../../components/MarkFav";

export default function PetListItem({ pet }) {
    const router = useRouter();

    // Debug log for the pet.imageUrl
    //console.log("PetListItem - pet.imageUrl:", pet?.imageUrl);

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/pet-details",
                    params: pet,
                })
            }
            style={{
                padding: 10,
                marginRight: 15,
                backgroundColor: Colors.WHITE,
                borderRadius: 10,
            }}
        >
            <View
                style={{
                    position: "absolute",
                    zIndex: 10,
                    right: 10,
                    top: 10,
                }}
            >
                <MarkFav pet={pet} color={"white"} />
            </View>
            <Image
                source={{ uri: pet?.imageUrl }}
                style={{
                    width: 150,
                    height: 135,
                    objectFit: "cover",
                    borderRadius: 10,
                }}
                onError={(error) =>
                    console.log(
                        "PetListItem - Image failed to load:",
                        error.nativeEvent.error
                    )
                }
            />
            <Text
                style={{
                    fontFamily: "roboto-medium",
                    fontSize: 18,
                }}
            >
                {pet?.name}
            </Text>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: Colors.GRAY,
                        fontFamily: "roboto-medium",
                    }}
                >
                    {pet?.breed}
                </Text>
                <Text
                    style={{
                        fontFamily: "roboto-medium",
                        color: Colors.PRIMARY,
                        paddingHorizontal: 7,
                        borderRadius: 10,
                        fontSize: 11,
                        backgroundColor: Colors.LIGHT_PRIMARY,
                    }}
                >
                    {pet?.age} YRS
                </Text>
            </View>
        </TouchableOpacity>
    );
}
