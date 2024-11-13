import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Text } from "react-native";
const tokenCache = {
    async getToken(key) {
        try {
            const item = await SecureStore.getItemAsync(key)
            if (item) {
                console.log(`${key} was used 🔐 \n`)
            } else {
                console.log('No values stored under key: ' + key)
            }
            return item
        } catch (error) {
            console.error('SecureStore get item error: ', error)
            await SecureStore.deleteItemAsync(key)
            return null
        }
    },
    async saveToken(key, value) {
        try {
            return SecureStore.setItemAsync(key, value)
        } catch (err) {
            return
        }
    },
}
export default function RootLayout() {


    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

    useFonts({
        "roboto-light": require("./../assets/fonts/Roboto-Light.ttf"),
        "roboto-light-italic": require("./../assets/fonts/Roboto-LightItalic.ttf"),
        "roboto-regular": require("./../assets/fonts/Roboto-Regular.ttf"),
        "roboto-medium": require("./../assets/fonts/Roboto-Medium.ttf"),
    });


    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={publishableKey}>

            <Stack>
                {/* <Stack.Screen name="index" /> */}
                <Stack.Screen name="(tabs)"
                              options={{
                                  headerShown:false
                              }}
                />
                <Stack.Screen name="login/index"
                              options={{
                                  headerShown:false
                              }}
                />

            </Stack>
            {/* <Link href={'/login'}>
          <Text>Login</Text>
        </Link> */}
        </ClerkProvider>
    );
}
