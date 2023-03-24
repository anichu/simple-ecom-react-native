import {
	Dimensions,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { ProductContext } from "../contexts/product-context";
const { width, height } = Dimensions.get("window");
const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };
const Carousel = () => {
	let flatListRef = useRef();
	const { products } = useContext(ProductContext);
	const [currentIndex, setCurrentIndex] = useState(0);
	console.log("carousel", products);
	const onViewRef = useRef(({ changed }) => {
		console.log(onViewRef);
		if (changed[0].isViewable) {
			setCurrentIndex(changed[0].index);
		}
	});
	const scrollToIndex = (index) => {
		flatListRef.current?.scrollToIndex({
			animated: true,
			index,
		});
	};
	const renderItems = ({ item }) => {
		console.log(item.image);
		return (
			<TouchableOpacity activeOpacity={1}>
				<Image source={{ uri: item.image }} style={styles.image} />
			</TouchableOpacity>
		);
	};
	return (
		<View>
			<FlatList
				data={products.slice(0, 4).reverse()}
				keyExtractor={(item, index) => index.toString()}
				renderItem={renderItems}
				horizontal
				showsHorizontalScrollIndicator={false}
				pagingEnabled
				viewabilityConfig={viewConfigRef}
				onViewableItemsChanged={onViewRef.current}
				ref={(ref) => {
					flatListRef.current = ref;
				}}
				style={styles.carousel}
			/>

			<View
				style={[
					styles.dotView,
					{
						position: "absolute",
						bottom: 0,
						right: "50%",
						transform: [
							{
								translateX: -Dimensions.get("window").width * 0.24,
							},
						],
					},
				]}
			>
				{products
					.slice(0, 4)
					.reverse()
					.map(({}, index) => (
						<TouchableOpacity
							key={index.toString()}
							style={[
								styles.circle,
								{
									backgroundColor: index === currentIndex ? "black" : "grey",
								},
							]}
							onPress={() => scrollToIndex(index)}
						/>
					))}
			</View>
		</View>
	);
};

export default Carousel;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		position: "relative",
	},
	image: {
		width: width,
		height: 150,
		resizeMode: "cover",
		marginVertical: 10,
	},
	carousel: {
		maxHeight: 300,
	},
	dotView: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 20,
	},
	circle: {
		width: 10,
		height: 10,
		backgroundColor: "grey",
		borderRadius: 50,
		marginHorizontal: 5,
	},
});
