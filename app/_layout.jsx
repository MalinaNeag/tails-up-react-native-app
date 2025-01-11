import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "./notification";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import * as Device from "expo-device";

const tokenCache = {
    async getToken(key) {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`${key} was used 🔐 \n`);
            } else {
                console.log("No values stored under key: " + key);
            }
            return item;
        } catch (error) {
            console.error("SecureStore get item error: ", error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key, value) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            console.error("SecureStore save item error:", err);
        }
    },
};

export default function RootLayout() {
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    useFonts({
        "roboto-light": require("./../assets/fonts/Roboto-Light.ttf"),
        "roboto-light-italic": require("./../assets/fonts/Roboto-LightItalic.ttf"),
        "roboto-regular": require("./../assets/fonts/Roboto-Regular.ttf"),
        "roboto-medium": require("./../assets/fonts/Roboto-Medium.ttf"),
    });

    useEffect(() => {
        const fetchAndSavePushToken = async () => {
            if (Device.isDevice) {
                // Get Expo Push Token
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    const user = await SecureStore.getItemAsync("clerk-user");
                    if (user) {
                        const userData = JSON.parse(user);
                        const email = userData?.emailAddresses?.[0]?.emailAddress;
                        if (email) {
                            // Save the Expo Push Token in Firestore
                            await setDoc(
                                doc(db, "Users", email),
                                { pushToken: token },
                                { merge: true }
                            );
                        }
                    }
                }
            } else {
                console.log("Push notifications are only available on physical devices.");
            }
        };

        fetchAndSavePushToken();

        // Notification listeners for received notifications
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notification received:", notification);
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Notification clicked:", response);
        });

        return () => {
            subscription.remove();
            responseSubscription.remove();
        };
    }, []);

    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="login/index"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </ClerkProvider>
    );
}