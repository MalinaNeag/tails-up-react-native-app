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
import DisplayAvailability from "../../components/PetDetails/DisplayAvailability";

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
    }, [pet]);

    const InitiateChat = async () => {
        const docId1 =
            user?.primaryEmailAddress?.emailAddress + "_" + pet?.email;
        const docId2 =
            pet?.email + "_" + user?.primaryEmailAddress?.emailAddress;

        const q = query(
            collection(db, "Chat"),
            where("id", "in", [docId1, docId2])
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            router.push({
                pathname: "/chat",
                params: { id: doc.id },
            });
        });

        if (querySnapshot.docs?.length === 0) {
            await setDoc(doc(db, "Chat", docId1), {
                id: docId1,
                users: [
                    {
                        email: user?.primaryEmailAddress?.emailAddress,
                        imageUrl: user?.imageUrl,
                        name: user?.fullName,
                    },
                    {
                        email: pet?.email,
                        imageUrl: pet?.userImage,
                        name: pet?.username,
                    },
                ],
                userIds: [user?.primaryEmailAddress?.emailAddress, pet?.email],
            });

            router.push({
                pathname: "/chat",
                params: { id: docId1 },
            });
        }
    };

    return (
        <View>
            <ScrollView>
                <PetInfo pet={pet} />
                <PetSubInfo pet={pet} />
                <AboutPet pet={pet} />
                <DisplayAvailability pet={pet} />
                <OwnerInfo pet={pet} />

                <View style={{ height: 70 }}></View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={InitiateChat} style={styles.hostBtn}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontFamily: "roboto-medium",
                            fontSize: 20,
                        }}
                    >
                        Host Me
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hostBtn: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
    },
    bottomContainer: {
        position: "absolute",
        width: "100%",
        bottom: 0,
    },
});
