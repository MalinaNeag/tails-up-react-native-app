import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./../../components/Home/PetListItem";
export default function Favorite() {
    const { user } = useUser();
    const [favIds, setFavIds] = useState([]);
    const [favPetList, setFavPetList] = useState([]);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        user && GetFavPetIds();
    }, [user]);

    const GetFavPetIds = async () => {
        setLoader(true);
        const result = await Shared.GetFavList(user);
        setFavIds(result?.favorites);
        setLoader(false);

        GetFavPetList(result?.favorites);
    };

    const GetFavPetList = async (favId_) => {
        setLoader(true);
        setFavPetList([]);
        const q = query(collection(db, "Pets"), where("id", "in", favId_));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            setFavPetList((prev) => [...prev, doc.data()]);
        });
        setLoader(false);
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
                Favorites
            </Text>

            <FlatList
                data={favPetList}
                numColumns={2}
                onRefresh={GetFavPetIds}
                refreshing={loader}
                renderItem={({ item, index }) => (
                    <View style={{ margin: 5 }}>
                        <PetListItem pet={item} />
                    </View>
                )}
            />
        </View>
    );
}