import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { db, storage } from "../../config/FirebaseConfig";
import { query, orderBy } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import {
    GiftedChat,
    Bubble,
    Time,
    MessageText,
    InputToolbar,
} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [sendingMessages, setSendingMessages] = useState([]);

    useEffect(() => {
        GetUserDetails();

const unsubscribe = onSnapshot(
        query(
            collection(db, "Chat", params?.id, "Messages"),
            orderBy("createdAt", "asc") // Ensure ascending order
        ),
        (snapshot) => {
            const messageData = snapshot.docs.map((doc) => {
                const createdAt = doc.data().createdAt?.toDate(); // Convert Firestore Timestamp to JS Date

                return {
                    _id: doc.id,
                    ...doc.data(),
                    createdAt: createdAt || new Date(), // Fallback to current date if `createdAt` is undefined
                    sending: false,
                };
            });

            setMessages(messageData.reverse()); // Reverse the array for GiftedChat's descending order
        }
    );

        return () => unsubscribe();
    }, []);

    const GetUserDetails = async () => {
        const docRef = doc(db, "Chat", params?.id);
        const docSnap = await getDoc(docRef);

        const result = docSnap.data();
        const otherUser = result?.users.filter(
            (item) => item.email !== user?.primaryEmailAddress?.emailAddress
        );

        navigation.setOptions({
            headerTitle: otherUser?.[0]?.name || "Chat",
            headerRight: () => (
                <TouchableOpacity
                    onPress={sendAgreement}
                    style={styles.headerButton}
                >
                    <Text style={styles.headerButtonText}>Hosting Request</Text>
                </TouchableOpacity>
            ),
        });
    };

const onSend = async (newMessage) => {
    const messageToSend = {
        ...newMessage[0],
        _id: `${newMessage[0]._id}-${Date.now()}`, // Ensure uniqueness by appending a timestamp
        createdAt: Timestamp.now(),
        sending: true,
    };

    setSendingMessages((prevState) => [...prevState, messageToSend]);

    try {
        await addDoc(
            collection(db, "Chat", params.id, "Messages"),
            messageToSend
        );

        setSendingMessages((prevState) =>
            prevState.filter((msg) => msg._id !== messageToSend._id)
        );
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

    const sendAgreement = async () => {
        try {
            const stripeUrl = await createStripeSession(5000);

            const agreementMessage = {
                _id: Date.now().toString(),
                text: "Please accept the hosting request by clicking the button below.",
                type: "agreement",
                createdAt: Timestamp.now(),
                sender: user?.primaryEmailAddress?.emailAddress,
                status: "pending",
                stripeUrl,
            };

            await addDoc(collection(db, "Chat", params.id, "Messages"), agreementMessage);
        } catch (error) {
            console.error("Error sending agreement:", error);
        }
    };

    const createStripeSession = async (amount) => {
        try {
            const response = await fetch("https://your-backend-url/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { url } = await response.json();
            return url;
        } catch (error) {
            console.error("Error creating Stripe session:", error);
            throw error;
        }
    };

    const pickImageAndSend = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const storageRef = ref(storage, `chat-images/${Date.now()}.jpg`);
                await uploadBytes(storageRef, blob);

                const downloadUrl = await getDownloadURL(storageRef);

                const imageMessage = {
                    _id: Date.now().toString(),
                    text: "",
                    image: downloadUrl,
                    createdAt: Timestamp.now(),
                    user: {
                        _id: user?.primaryEmailAddress?.emailAddress,
                        name: user?.fullName,
                        avatar: user?.imageUrl,
                    },
                };

                await addDoc(
                    collection(db, "Chat", params.id, "Messages"),
                    imageMessage
                );
            }
        } catch (error) {
            console.error("Error picking or sending image:", error);
        }
    };

    const renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            containerStyle={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                borderTopWidth: 1,
                borderColor: "#ddd",
            }}
            renderActions={() => (
                <TouchableOpacity onPress={pickImageAndSend}>
                    <Ionicons name="image-outline" size={30} color="blue" />
                </TouchableOpacity>
            )}
        />
    );

    const renderBubble = (props) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: "#0084ff" },
                left: { backgroundColor: "#f0f0f0" },
            }}
            textStyle={{
                right: { color: "#fff" },
                left: { color: "#000" },
            }}
        />
    );

    const renderCustomView = (props) => {
        const { currentMessage } = props;

        if (currentMessage.type === "agreement") {
            return (
                <View style={styles.agreementContainer}>
                    <Text style={styles.agreementText}>{currentMessage.text}</Text>
                    <TouchableOpacity
                        style={styles.agreementButton}
                        onPress={() => Linking.openURL(currentMessage.stripeUrl)}
                    >
                        <Text style={styles.agreementButtonText}>Accept & Pay</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    const renderTime = (props) => (
        <Time
            {...props}
            timeTextStyle={{
                right: { color: "#fff" },
                left: { color: "#000" },
            }}
        />
    );

    const renderMessageText = (props) => (
        <MessageText
            {...props}
            textStyle={{
                right: { color: "#fff" },
                left: { color: "#000" },
            }}
        />
    );

    const renderMessageImage = (props) => (
        <Image
            source={{ uri: props.currentMessage.image }}
            style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                margin: 5,
            }}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={[...sendingMessages, ...messages]}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: user?.primaryEmailAddress?.emailAddress,
                    name: user?.fullName,
                    avatar: user?.imageUrl,
                }}
                renderInputToolbar={renderInputToolbar}
                renderMessageImage={renderMessageImage}
                renderBubble={renderBubble}
                renderCustomView={renderCustomView}
                renderTime={renderTime}
                renderMessageText={renderMessageText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerButton: {
        backgroundColor: "red",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    headerButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    agreementContainer: {
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        padding: 10,
        margin: 5,
    },
    agreementText: {
        fontSize: 14,
        marginBottom: 5,
    },
    agreementButton: {
        backgroundColor: "#0084ff",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
    },
    agreementButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});