import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    Animated,
} from "react-native";
import React, { useCallback } from "react";
import { useRef } from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

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
        try {
            const { createdSessionId } = await startOAuthFlow({
                redirectUrl: Linking.createURL("/(tabs)/home", {
                    scheme: "myapp",
                }),
            });

            if (createdSessionId) {
                console.log("session created :)))");
            } else {
                console.log("session not created :((((((");
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require("./../../assets/images/logot.png")}
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
            >
                <Text style={styles.buttonText}>Get Started</Text>
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
        //borderRadius: 14,
        width: "100%",
        //shadowColor: "#000",
        //shadowOffset: { width: 0, height: 4 },
        //shadowOpacity: 0.3,
        //shadowRadius: 5,
        //elevation: 6, // For Android shadow
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }], // Slight shrink effect
        backgroundColor: Colors.DARK_PRIMARY, // Optional darker shade
    },
    buttonText: {
        fontFamily: "roboto-medium",
        fontSize: 20,
        textAlign: "center",
        color: Colors.WHITE,
    },
});
