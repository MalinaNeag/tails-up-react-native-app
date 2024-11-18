import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../config/FirebaseConfig";
import Colors from "./../../constants/Colors";

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Dogs");
    const listRef = useRef(null);
    const screenWidth = Dimensions.get("window").width;
    const itemWidth = screenWidth / 3; // Adjust this for visible items

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
                getItemLayout={(data, index) => ({
                    length: itemWidth,
                    offset: itemWidth * index,
                    index,
                })}
                onMomentumScrollEnd={handleScrollEnd}
                onScrollToIndexFailed={(info) => {
                    console.warn("Scroll to index failed:", info);
                    setTimeout(() => {
                        listRef.current?.scrollToIndex({
                            index: info.index,
                            animated: true,
                        });
                    }, 500);
                }}
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
        //backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 10,
        alignItems: "center",
        //borderRadius: 55,
        marginHorizontal: 2,
        marginVertical: 4,
    },
    selectedCategoryContainer: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderColor: Colors.LIGHT_PRIMARY,
        borderRadius: 15,
    },
    image: {
        width: 60,
        height: 60,
    },
    text: {
        textAlign: "center",
        fontFamily: "roboto-light",
    },
});
