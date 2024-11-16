import { useUser } from "@clerk/clerk-expo";
import {
    Link,
    Redirect,
    useNavigation,
    useRootNavigationState,
    useRouter,
} from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Index() {
    const { user } = useUser();

    const rootNavigationState = useRootNavigationState();
    const navigation = useNavigation();
    useEffect(() => {
        if (user && CheckNavLoaded()) {
            navigation.navigate("/(tabs)/home");
        } else if (!user && CheckNavLoaded()) {
            navigation.navigate("/login");
        }
    }, [user, rootNavigationState.key]);

    const CheckNavLoaded = () => {
        if (!rootNavigationState.key) {
            console.warn("Navigation state not yet loaded");
            return false;
        }
        return true;
    };

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            {user ? (
                <Redirect href={"/(tabs)/home"} />
            ) : (
                <Redirect href={"/login"} />
            )}
        </View>
    );
}
