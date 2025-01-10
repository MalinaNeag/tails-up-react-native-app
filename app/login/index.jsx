import React, { useCallback, useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    Animated,
    ActivityIndicator,
    Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import Colors from "../../constants/Colors";

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [isLoading, setIsLoading] = useState(false);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            friction: 6,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();
    };

    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log("[OAuth]    Starting OAuth flow...");
            const { createdSessionId } = await startOAuthFlow({
                redirectUrl: Linking.createURL("/(tabs)/home", {
                    scheme: "myapp",
                }),
            });

            if (createdSessionId) {
                console.log("[OAuth] Session created successfully!");
                Alert.alert("Success", "You are    now logged in.");
            } else {
                console.warn("[OAuth] Session not created. Please try again.");
                Alert.alert("Login Failed", "Session could not be created.");
            }
        } catch (err) {
            if (err.message.includes("single session mode")) {
                console.error("[OAuth] Single session mode detected.");
                Alert.alert(
                    "Session Error",
                    "You're already logged in to another account. Please sign out first."
                );
            } else {
                console.error("[OAuth] Error during OAuth flow:", err.message);
                Alert.alert("Error", "An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [startOAuthFlow]);

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/logot.png")}
                style={styles.image}
            />

            <View style={styles.textContainer}>
                <Text style={styles.title}>TailsUp</Text>
                <Text style={styles.subtitle}>
                    Always Connected to Your Pets
                </Text>
                <Text style={styles.description}>
                    Find trusted, verified sitters near you in just a few taps.
                    Whether you need someone for a quick walk, weekend boarding,
                    or daily visits, TailsUp connects you with sitters you can
                    rely on.
                </Text>
            </View>

            {/* Get Started Button */}
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => [
                    styles.getStartedButton,
                    pressed && styles.buttonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Get Started with TailsUp"
            >
                {isLoading ? (
                    <ActivityIndicator color={Colors.WHITE} />
                ) : (
                    <Text style={styles.buttonText}>Get Started</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    image: {
        width: "100%",
        height: 300,
    },
    textContainer: {
        paddingHorizontal: 20,
        alignItems: "center",
    },
    title: {
        fontFamily: "roboto-bold",
        fontSize: 60,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: "roboto-medium-italic",
        fontSize: 26,
        textAlign: "center",
    },
    description: {
        fontFamily: "roboto",
        fontSize: 16,
        textAlign: "center",
        color: Colors.GRAY,
        paddingTop: 10,
        paddingHorizontal: 15,
    },
    getStartedButton: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: Colors.PRIMARY,
        width: "100%",
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }], // Slight shrink effect
        backgroundColor: Colors.DARK_PRIMARY,
    },
    buttonText: {
        fontFamily: "roboto-medium",
        fontSize: 20,
        textAlign: "center",
        color: Colors.WHITE,
    },
});