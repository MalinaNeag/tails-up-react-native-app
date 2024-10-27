import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
    useFonts({
        "roboto-light": require("./../assets/fonts/Roboto-Light.ttf"),
        "roboto-light-italic": require("./../assets/fonts/Roboto-LightItalic.ttf"),
        "roboto-regular": require("./../assets/fonts/Roboto-Regular.ttf"),
        "roboto-medium": require("./../assets/fonts/Roboto-Medium.ttf"),
    });

    return (
        <Stack>
            <Stack.Screen name="index" />
        </Stack>
    );
}
