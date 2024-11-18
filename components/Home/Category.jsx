import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../config/FirebaseConfig";
import Colors from "./../../constants/Colors";

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Dogs");
    const listRef = useRef(null);

    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        const snapshot = await getDocs(collection(db, "Category"));
        const fetchedCategories = [];
        snapshot.forEach((doc) => {
            fetchedCategories.push(doc.data());
        });

        // Duplicate data to simulate circular scrolling
        setCategoryList([
            ...fetchedCategories,
            ...fetchedCategories,
            ...fetchedCategories,
        ]);

        // Set scroll position to the middle dataset
        setTimeout(() => {
            listRef.current?.scrollToIndex({
                index: fetchedCategories.length,
                animated: false,
            });
        }, 100);
    };

    const handleScrollEnd = (event) => {
        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const itemWidth = layoutMeasurement.width / 3; // Adjust based on visible items
        const index = Math.round(contentOffset.x / itemWidth);

        if (index === 0) {
            // Scroll to the last duplicated section
            listRef.current?.scrollToIndex({
                index: categoryList.length / 3,
                animated: false,
            });
        } else if (index === categoryList.length - 1) {
            // Scroll to the first duplicated section
            listRef.current?.scrollToIndex({
                index: categoryList.length / 3 - 1,
                animated: false,
            });
        }
    };

    return (
        <View
            style={{
                marginTop: 20,
            }}
        >
            <Text
                style={{
                    fontFamily: "roboto-medium",
                    fontSize: 20,
                }}
            >
                Category
            </Text>

            <FlatList
                ref={listRef}
                data={categoryList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                onMomentumScrollEnd={handleScrollEnd}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item.name);
                            category(item.name);
                        }}
                    >
                        <View
                            style={[
                                styles.container,
                                selectedCategory === item.name &&
                                    styles.selectedCategoryContainer,
                            ]}
                        >
                            <Image
                                source={{ uri: item?.imageUrl }}
                                style={styles.image}
                            />
                        </View>
                        <Text style={styles.text}>{item?.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 15,
        alignItems: "center",
        borderRadius: 15,
        marginHorizontal: 5,
    },
    selectedCategoryContainer: {
        backgroundColor: Colors.SECONDARY,
        borderColor: Colors.SECONDARY,
    },
    image: {
        width: 40,
        height: 40,
    },
    text: {
        textAlign: "center",
        fontFamily: "roboto-light",
    },
});
