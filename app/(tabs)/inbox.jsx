import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import {
    query,
    orderBy,
    limit,
    collection,
    getDocs,
    where,
} from "firebase/firestore";
import { db } from "./../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import UserItem from "../../components/Inbox/UserItem";
import moment from "moment";

export default function Inbox() {
    const { user } = useUser();
    const [userList, setUserList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        user && GetUserList();
    }, [user]);

    const GetUserList = async () => {
        setLoader(true);
        setUserList([]);

        const q = query(
            collection(db, "Chat"),
            where(
                "userIds",
                "array-contains",
                user?.primaryEmailAddress?.emailAddress
            )
        );
        const querySnapshot = await getDocs(q);

        const chats = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const chatData = doc.data();
                const messagesCollection = collection(
                    db,
                    "Chat",
                    doc.id,
                    "Messages"
                );
                const lastMessageQuery = query(
                    messagesCollection,
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                const lastMessageSnapshot = await getDocs(lastMessageQuery);

                const lastMessage = lastMessageSnapshot.docs[0]?.data() || null;

                return {
                    docId: doc.id,
                    lastMessage: lastMessage?.text || "",
                    lastMessageTime: lastMessage?.createdAt
                        ? moment(lastMessage.createdAt.toDate()).fromNow() // Properly convert Firebase Timestamp to Date
                        : "",
                    ...chatData,
                };
            })
        );

        setUserList(chats);
        setLoader(false);
    };

    const MapOtherUserList = () => {
        return userList.map((record) => {
            const otherUser = record.users?.filter(
                (u) => u.email !== user?.primaryEmailAddress?.emailAddress
            )[0];

            return {
                docId: record.docId,
                lastMessage: record.lastMessage,
                lastMessageTime: record.lastMessageTime,
                ...otherUser,
            };
        });
    };

    return (
        <View
            style={{
                padding: 20,
                marginTop: 20,
            }}
        >
            <Text
                style={{
                    fontFamily: "roboto-medium",
                    fontSize: 30,
                }}
            >
                Inbox
            </Text>

            <FlatList
                data={MapOtherUserList()}
                refreshing={loader}
                onRefresh={GetUserList}
                style={{
                    marginTop: 20,
                }}
                renderItem={({ item }) => <UserItem userInfo={item} />}
            />
        </View>
    );
}
