import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Pressable,
	TouchableOpacity,
	Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import list from "../assets/icons/list.png";
import grid from "../assets/icons/grid.png";
import Product from "./Product";
import Loading from "./Loading";

const Products = ({ products }) => {
	const [grid, setGrid] = useState(false);
	if (products.length === 0) {
		return <Loading />;
	}
	const renderProductItem = (itemData) => {
		const { price, name, image, _id } = itemData.item;
		return (
			<Product
				grid={grid}
				setGrid={setGrid}
				name={name}
				price={price}
				image={image}
				_id={_id}
			/>
		);
	};
	const pressHandler = () => {
		setGrid((prev) => !prev);
	};
	return (
		<View style={styles.products}>
			<View
				style={{
					backgroundColor: "black",
					marginHorizontal: 5,
					padding: 5,
					marginVertical: 5,
					borderRadius: 5,
					flexDirection: "row",
					justifyContent: "space-between",
				}}
				onPress={pressHandler}
			>
				<Text style={{ color: "white", fontWeight: 800, paddingLeft: 5 }}>
					Latest Products:
				</Text>
				<TouchableOpacity
					onPress={pressHandler}
					style={[styles.text, { paddingRight: 10 }]}
				>
					{grid ? (
						<Image
							source={require("../assets/icons/list.png")}
							style={{ width: 25, height: 25 }}
						/>
					) : (
						<Image
							source={require("../assets/icons/grid.png")}
							style={{ width: 25, height: 25 }}
						/>
					)}
				</TouchableOpacity>
			</View>

			<FlatList
				data={products}
				keyExtractor={(item) => item._id}
				renderItem={renderProductItem}
				numColumns={grid ? 2 : 1}
				key={grid ? 1 : 0}
				contentContainerStyle={{ justifyContent: "center" }}
			/>
		</View>
	);
};

export default Products;

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 4,
		backgroundColor: "gray",
		width: 100,
		marginHorizontal: 10,
	},
	text: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: "bold",
		letterSpacing: 0.25,
		color: "white",
	},
	products: {
		position: "relative",
		marginTop: 10,
	},
});
