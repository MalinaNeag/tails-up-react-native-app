import { View, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
    const [petList, setPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        GetPetList("Dogs");
    }, []);

    const GetPetList = async (category) => {
        setLoader(true);
        setPetList([]);
        const q = query(
            collection(db, "Pets"),
            where("category", "==", category)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            setPetList((petList) => [
                ...petList,
                { id: doc.id, ...doc.data() },
            ]);
        });
        setLoader(false);
    };

    return (
        <View style={styles.container}>
            <Category category={(value) => GetPetList(value)} />

            <FlatList
                data={petList}
                keyExtractor={(item) => item.id}
                style={styles.list}
                refreshing={loader}
                numColumns={2} // Display 2 items per row
                columnWrapperStyle={styles.row} // Style for rows
                showsVerticalScrollIndicator={false}
                onRefresh={() => GetPetList("Dogs")}
                renderItem={({ item }) => <PetListItem pet={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        marginTop: 10,
    },
    row: {
        justifyContent: "space-between", // Space out items in a row
        marginBottom: 10, // Add spacing between rows
    },
});
