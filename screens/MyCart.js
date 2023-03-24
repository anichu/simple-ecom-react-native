import {
	Alert,
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Products from "../components/Products";

const MyCart = ({ navigation }) => {
	const [items, setItems] = useState([]);

	useEffect(() => {
		const focusHandler = navigation.addListener("focus", () => {
			const getCartItems = async () => {
				const itemsFromLocaleStorage = await AsyncStorage.getItem(
					"anis-molla-cart"
				);
				setItems(JSON.parse(itemsFromLocaleStorage));
			};
			getCartItems();
		});
		return focusHandler;
	}, [navigation]);
	const totalPrice = items?.reduce((total, item) => total + item.price, 0);

	const renderProductItem = (itemData) => {
		const { price, name, image, _id } = itemData.item;
		return (
			<View style={styles.cartItem}>
				<Image
					source={{ uri: image }}
					style={{ width: 100, height: 80, borderRadius: 10, margin: 10 }}
				/>
				<Text style={styles.text} numberOfLines={2}>
					{name}
				</Text>
				<Text style={styles.text}>$ {price}</Text>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.cartContainer}>
			<Text style={styles.title}>MyCart</Text>
			<FlatList
				data={items}
				keyExtractor={(item) => item._id}
				renderItem={renderProductItem}
			/>
			<View style={styles.percelInfo}>
				<Text style={styles.text}>
					Total Price:$ {totalPrice ? totalPrice : 0}
				</Text>
				<Text style={styles.text}>
					Items: {items?.length ? items?.length : 0}
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default MyCart;

const styles = StyleSheet.create({
	cartContainer: {
		flex: 1,
		padding: 10,
	},
	cartItem: {
		flexDirection: "row",
		marginVertical: 5,
		backgroundColor: "#14213D",
		borderRadius: 10,
		alignItems: "center",
	},
	text: {
		fontSize: 20,
		color: "white",
		marginHorizontal: 10,
	},
	percelInfo: {
		backgroundColor: "#14213D",
		borderRadius: 10,
		padding: 10,
		marginBottom: 70,
		marginTop: 15,
	},
	title: {
		textAlign: "center",
		fontSize: 20,
		fontWeight: 700,
		paddingVertical: 10,
	},
});
