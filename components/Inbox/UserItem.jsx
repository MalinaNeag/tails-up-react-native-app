import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "./../../constants/Colors";
import { useRouter } from "expo-router";

export default function UserItem({ userInfo }) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(`/chat?id=${userInfo.docId}`)}
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: Colors.WHITE,
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.GRAY,
            }}
        >
            {/* Avatar */}
            <Image
                source={{ uri: userInfo?.imageUrl }}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 15,
                }}
            />

            {/* Chat Details */}
            <View style={{ flex: 1 }}>
                {/* User Name */}
                <Text
                    style={{
                        fontFamily: "roboto-medium",
                        fontSize: 16,
                        marginBottom: 2,
                    }}
                >
                    {userInfo?.name}
                </Text>

                {/* Last Message */}
                <Text
                    style={{
                        fontFamily: "roboto-light",
                        fontSize: 14,
                        color: Colors.GRAY,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    numberOfLines={1}
                >
                    {userInfo?.lastMessage}
                </Text>
            </View>

            {/* Timestamp */}
            <Text
                style={{
                    fontFamily: "roboto-light",
                    fontSize: 12,
                    color: Colors.GRAY,
                }}
            >
                {userInfo?.lastMessageTime}
            </Text>
        </TouchableOpacity>
    );
}
