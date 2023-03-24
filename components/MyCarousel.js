import * as React from "react";
import {
	Animated,
	Dimensions,
	Image,
	FlatList,
	Text,
	View,
	StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ProductContext } from "../contexts/product-context";

const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;

export default function MyCarousel({ indicator }) {
	const { products } = React.useContext(ProductContext);
	return (
		<View style={styles.container}>
			<FlatList
				data={products}
				horizontal
				showsHorizontalScrollIndicator={indicator}
				keyExtractor={(item) => item._id}
				pagingEnabled
				renderItem={({ item, index }) => {
					return (
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								width: indicator ? width : ITEM_WIDTH,
								marginHorizontal: 10,
							}}
						>
							<View
								style={{
									width: indicator ? width : ITEM_WIDTH,
									backgroundColor: "blue",
									elevation: 3,
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 10,
									flexDirection: "column",
								}}
							>
								<Image
									source={{ uri: item?.image }}
									style={{
										width: indicator ? width : ITEM_WIDTH,
										height: 70,
										resizeMode: "cover",
										borderTopLeftRadius: 10,
										borderTopRightRadius: 10,
									}}
								/>
								<Text style={[styles.text, { textTransform: "capitalize" }]}>
									{item?.name}
								</Text>
							</View>
						</View>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		height: 100,
		position: "relative",
	},
	text: {
		backgroundColor: "#14213D",
		textAlign: "center",
		width: "100%",
		paddingVertical: 5,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		fontSize: 20,
		color: "white",
	},
});
