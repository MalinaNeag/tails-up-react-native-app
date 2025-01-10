import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
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
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import {
    GiftedChat,
    Bubble,
    Time,
    MessageText,
} from "react-native-gifted-chat";
import moment from "moment";

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [sendingMessages, setSendingMessages] = useState([]);

    useEffect(() => {
        GetUserDetails();

        const unsubscribe = onSnapshot(
            collection(db, "Chat", params?.id, "Messages"),
            (snapshot) => {
                const messageData = snapshot.docs
                    .map((doc) => {
                        const createdAt = doc.data().createdAt?.toDate(); // Convert Firebase Timestamp to Date
                        const adjustedTime = createdAt
                            ? new Date(createdAt.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours
                            : null;

                        return {
                            _id: doc.id,
                            ...doc.data(),
                            createdAt: adjustedTime, // Use adjusted time
                            sending: false, // Mark all received messages as sent
                        };
                    })
                    .sort((a, b) => b.createdAt - a.createdAt); // Sort by Date
                setMessages(messageData);
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
            createdAt: Timestamp.now(), // Use Firebase Timestamp
            sending: true, // Mark as sending initially
        };

        setSendingMessages((prevState) => [...prevState, messageToSend]); // Temporarily add message to sending state

        try {
            await addDoc(
                collection(db, "Chat", params.id, "Messages"),
                messageToSend
            );

            setSendingMessages((prevState) =>
                prevState.filter((msg) => msg._id !== messageToSend._id)
            ); // Remove message from sending state
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const sendAgreement = async () => {
        try {
            const stripeUrl = await createStripeSession(5000); // Example amount: $50.00

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
        return url; // Stripe Checkout URL
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        throw error;
    }
};

    const renderBubble = (props) => {
        const isSending = props.currentMessage.sending;
        return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                {isSending && (
                    <ActivityIndicator
                        size="small"
                        color="#0084ff"
                        style={{ marginLeft: 5 }}
                    />
                )}
            </View>
        );
    };



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

    const renderTime = (props) => {
        return (
            <Time
                {...props}
                timeTextStyle={{
                    right: { color: "#fff" },
                    left: { color: "#000" },
                }}
            />
        );
    };

    const renderMessageText = (props) => (
        <MessageText
            {...props}
            textStyle={{
                right: { color: "#fff" },
                left: { color: "#000" },
            }}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={[...sendingMessages, ...messages]} // Combine sending and received messages
                onSend={(messages) => onSend(messages)}
                showUserAvatar={true}
                user={{
                    _id: user?.primaryEmailAddress?.emailAddress,
                    name: user?.fullName,
                    avatar: user?.imageUrl,
                }}
                renderBubble={renderBubble}
                renderTime={renderTime}
                renderMessageText={renderMessageText}
                renderCustomView={renderCustomView} // Custom agreement messages
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
        marginRight: 10, // Spacing from the edge
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