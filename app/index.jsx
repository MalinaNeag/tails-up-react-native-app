import { Text, View } from "react-native";
import { Link, Redirect, useRootNavigationState } from "expo-router";
import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
    const { user } = useUser();
    //console.log(user);
    const rootNavigationState = useRootNavigationState();
    useEffect(() => {
        CheckNavigationLoaded();
    }, []);

    const CheckNavigationLoaded = () => {
        if (!rootNavigationState.key) return null;
    };

    return (
        user && (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {user ? (
                    <Redirect href={"/(tabs)/home"} />
                ) : (
                    <Redirect href={"login"} />
                )}
            </View>
        )
    );
}