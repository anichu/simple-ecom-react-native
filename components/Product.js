import {
	View,
	Text,
	Image,
	StyleSheet,
	Pressable,
	ToastAndroid,
	TouchableOpacity,
	Dimensions,
	Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext } from "react";
import { UserContext } from "../contexts/user-context";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

const Product = ({ name, image, price, grid, setGrid, _id }) => {
	const { user } = useContext(UserContext);

	const addToLocalStorage = async () => {
		if (!user) {
			Alert.alert("Authentication Error", "Please log in to view details.");
			return;
		}
		const cart = {
			_id,
			name,
			price,
			image,
		};

		const cartItemsFromLocalStorage = JSON.parse(
			await AsyncStorage.getItem("anis-molla-cart")
		);
		console.log(cartItemsFromLocalStorage);
		if (cartItemsFromLocalStorage) {
			const isExist = cartItemsFromLocalStorage.findIndex(
				(item) => item._id === _id
			);

			if (isExist < 0) {
				cartItemsFromLocalStorage.unshift(cart);
			}
			await AsyncStorage.setItem(
				"anis-molla-cart",
				JSON.stringify(cartItemsFromLocalStorage)
			);

			ToastAndroid.show(
				"Item added to card",
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
		} else {
			await AsyncStorage.setItem(
				"anis-molla-cart",
				JSON.stringify([{ ...cart }])
			);
		}
	};

	const cartPressHandler = async () => {
		addToLocalStorage();
	};

	return (
		<View
			style={[
				styles.productContainer,
				{
					flexDirection: grid ? "column" : "row",
					margin: 5,
					padding: 5,
				},
			]}
		>
			{/* style={{ height: imageHeight, width: imageWidth }} */}
			<Image
				source={{ uri: image }}
				// style={{ height: imageHeight, width: imageWidth }}
				style={[styles.image, { width: grid ? "100%" : "50%" }]}
			/>
			<View
				style={[
					styles.productInfo,
					{
						justifyContent: grid ? "flex-start" : "flex-start",
						marginLeft: grid ? 0 : 10,
						width: grid ? "100%" : "50%",
					},
				]}
			>
				<Text
					style={[
						styles.name,
						{
							textTransform: "capitalize",
							width: "95%",
							textAlign: "left",
							marginTop: 5,
						},
					]}
					numberOfLines={2}
				>
					{name}
				</Text>
				<Text style={styles.name}>$ {price}</Text>
				<TouchableOpacity
					onPress={cartPressHandler}
					style={{ position: "absolute", bottom: 0, right: grid ? 0 : 10 }}
				>
					<Image
						source={require("../assets/icons/shopping-cart.png")}
						style={{
							width: 30,
							height: 30,
							resizeMode: "stretch",
						}}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Product;

const styles = StyleSheet.create({
	productContainer: {
		backgroundColor: "#14213D",
		flex: 1,
		borderRadius: 10,
	},
	name: {
		color: "#fff",
		fontSize: 14,
		paddingBottom: 20,
		fontWeight: 600,
	},
	image: {
		height: imageHeight,
		borderRadius: 10,
		paddingVertical: 10,
		resizeMode: "contain",
	},
	productInfo: {
		width: "80%",
	},
});
