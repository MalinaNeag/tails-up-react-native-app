import { Text, View } from "react-native";
import {Link} from "expo-router";
import React from "react";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Link href={'/login'}>
            <Text> Go to Login Screen</Text>
        </Link>
    </View>
  );
}
