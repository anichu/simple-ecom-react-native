import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductContext } from "../contexts/product-context";
import Products from "../components/Products";
import MyCarousel from "../components/MyCarousel";
import Carousel from "../components/Carousel";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "../contexts/user-context";
const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;

const Home = () => {
	const { products } = useContext(ProductContext);
	const { user } = useContext(UserContext);
	console.log("home", user);
	return (
		<View style={styles.container}>
			<Carousel />
			<MyCarousel />
			<Products products={products} />
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingBottom: 260,
	},
});
