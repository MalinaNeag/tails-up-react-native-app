import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const router = useRouter();
    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
        });
    }, []);

    return (
        <View>
            <ScrollView>
                <PetInfo pet={pet} />
                <PetSubInfo pet={pet} />
                <AboutPet pet={pet} />
                <OwnerInfo pet={pet} />
                <View style={{ height: 70 }}></View>
            </ScrollView>

            <View style={styles?.bottomContainer}>
                <TouchableOpacity style={styles.adoptBtn}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontFamily: "roboto-medium",
                            fontSize: 20,
                        }}
                    >
                        Adopt Me
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    adoptBtn: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
    },
    bottomContainer: {
        position: "absolute",
        width: "100%",
        bottom: 0,
    },
});
