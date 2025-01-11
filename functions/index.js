const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.sendNewMessageNotification = functions.firestore
    .document("Chat/{chatId}/Messages/{messageId}")
    .onCreate(async (snapshot, context) => {
        const messageData = snapshot.data();
        const recipientEmail = messageData.recipient;

        const userDoc = await admin.firestore().collection("Users").doc(recipientEmail).get();
        if (!userDoc.exists) {
            console.log("Recipient not found:", recipientEmail);
            return null;
        }

        const pushToken = userDoc.data()?.pushToken;
        if (!pushToken) {
            console.log("No push token for recipient:", recipientEmail);
            return null;
        }

        const notification = {
            to: pushToken,
            sound: "default",
            title: "New Message",
            body: `New message from ${messageData.senderName}`,
            data: { chatId: context.params.chatId },
        };

        try {
            const response = await axios.post("https://exp.host/--/api/v2/push/send", notification);
            console.log("Notification sent:", response.data);
        } catch (error) {
            console.error("Error sending notification:", error);
        }

        return null;
    });