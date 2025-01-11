import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn !== undefined) {
            if (isSignedIn) {
                console.log("[Auth] User is signed in. Navigating to home...");
                router.replace("/(tabs)/home");
            } else {
                console.log(
                    "[Auth] User is not signed in. Navigating to login... "
                );
                router.replace("/login");
            }
        }
    }, [isSignedIn, router]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator size="large" />
        </View>
    );
}
