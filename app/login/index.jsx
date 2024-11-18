import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback } from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
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
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow({
                    redirectUrl: Linking.createURL("/(tabs)/home", {
                        scheme: "myapp",
                    }),
                });

            if (createdSessionId) {
                console.log("session created :))");
            } else {
                console.log("session not created :(((((");
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);
    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                height: "100%",
            }}
        >
            {/*
            <Image
                source={require("./../../assets/images/categories/cat.png")}
                style={{
                    width: "100%",
                    height: 500,
                }}
            />
            */}
            <View
                style={{
                    padding: 20,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontFamily: "roboto-bold",
                        fontSize: 30,
                        textAlign: "center",
                    }}
                >
                    Always Connected to Your Pets
                </Text>
                <Text
                    style={{
                        fontFamily: "roboto",
                        fontSize: 18,
                        textAlign: "center",
                        color: Colors.GRAY,
                    }}
                >
                    Find trusted, verified sitters near you in just a few taps.
                    Whether you need someone for a quick walk, weekend boarding,
                    or daily visits, TailsUp connects you with sitters you can
                    rely on.
                </Text>

                <Pressable
                    onPress={onPress}
                    style={{
                        padding: 14,
                        marginTop: 100,
                        backgroundColor: Colors.PRIMARY,
                        width: "100%",
                        borderRadius: 14,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "roboto-medium",
                            fontSize: 20,
                            textAlign: "center",
                        }}
                    >
                        Get Started
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
