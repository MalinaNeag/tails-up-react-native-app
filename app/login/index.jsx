import { View, Text, Image, Pressable, Animated } from "react-native";
import React, { useCallback, useRef } from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        // Warm up the android browser to improve UX
        // https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

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

    const onPress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL("/(tabs)/home", {
                    scheme: "myapp",
                }),
            });

            if (createdSessionId) {
                setActive({ session: createdSessionId });
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.WHITE,
                justifyContent: "space-between",
            }}
        >
            <Image
                source={require("../../assets/images/categories/cat.png")}
                style={{
                    width: "100%",
                    height: 400,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    overflow: "hidden",
                }}
            />

            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 30,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontFamily: "roboto-bold",
                        fontSize: 40,
                        textAlign: "center",
                        color: Colors.PRIMARY,
                        marginBottom: 5,
                    }}
                >
                    TailsUp
                </Text>

                <Text
                    style={{
                        fontFamily: "roboto-regular-italic",
                        fontSize: 20,
                        textAlign: "center",
                        color: Colors.SECONDARY,
                        marginBottom: 10,
                    }}
                >
                    Always Connected to Your Pets
                </Text>

                <Text
                    style={{
                        fontFamily: "roboto-light",
                        fontSize: 16,
                        textAlign: "center",
                        color: Colors.GRAY,
                        lineHeight: 24,
                        marginBottom: 40,
                    }}
                >
                    Find trusted, verified sitters near you in just a few taps.
                    Whether you need someone for a quick walk, weekend boarding,
                    or daily visits, TailsUp connects you with sitters you can
                    rely on.
                </Text>
            </View>

            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                    paddingHorizontal: 20,
                    paddingBottom: 30,
                }}
            >
                <Pressable
                    onPress={onPress} // Add this line
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={{
                        paddingVertical: 16,
                        backgroundColor: Colors.PRIMARY,
                        borderRadius: 14,
                        borderWidth: 3,
                        borderColor: Colors.PRIMARY,
                        width: "100%",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.2,
                        shadowRadius: 15,
                        elevation: 5,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "roboto-medium",
                            fontSize: 18,
                            textAlign: "center",
                            color: Colors.WHITE,
                        }}
                    >
                        Get Started
                    </Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}
