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
        const favorites = result?.favorites || [];
        setFavIds(favorites);

        if (favorites.length > 0) {
            await GetFavPetList(favorites);
        } else {
            setFavPetList([]); // Clear the list if no favorites
        }

        setLoader(false);
    };

    const GetFavPetList = async (favId_) => {
        if (!favId_ || favId_.length === 0) {
            setFavPetList([]);
            setLoader(false);
            return;
        }

        setLoader(true);
        const q = query(
            collection(db, "Pets"),
            where("__name__", "in", favId_)
        );
        const querySnapshot = await getDocs(q);

        const pets = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setFavPetList(pets);
        setLoader(false);
    };

    return (
        <View style={{ padding: 20, marginTop: 20 }}>
            <Text style={{ fontFamily: "roboto-medium", fontSize: 30 }}>
                Favorites
            </Text>

            <FlatList
                data={favPetList}
                numColumns={2}
                onRefresh={GetFavPetIds}
                refreshing={loader}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={{ margin: 5 }}>
                        <PetListItem pet={item} />
                    </View>
                )}
            />
        </View>
    );
}
