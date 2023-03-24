import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { ProductContext } from "../contexts/product-context";
const { width: screenWidth } = Dimensions.get("window");

const GridCarousel = () => {
	const { products } = useContext(ProductContext);
	const _renderItem = ({ item, index }, parallaxProps) => {
		console.log("sina", item);
		return (
			<View style={styles.item}>
				<ParallaxImage
					source={{ uri: item.image }}
					containerStyle={styles.imageContainer}
					style={styles.image}
					parallaxFactor={0.4}
					{...parallaxProps}
				/>
				<Text style={styles.title} numberOfLines={2}>
					{item.name}
				</Text>
			</View>
		);
	};
	return (
		<Carousel
			sliderWidth={screenWidth}
			sliderHeight={screenWidth}
			itemWidth={screenWidth - 60}
			data={products}
			renderItem={_renderItem}
			hasParallaxImages={true}
		/>
	);
};

export default GridCarousel;

const styles = StyleSheet.create({
	item: {
		width: screenWidth - 60,
		height: screenWidth - 60,
	},
	imageContainer: {
		flex: 1,
		marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
		backgroundColor: "white",
		borderRadius: 8,
	},
	image: {
		...StyleSheet.absoluteFillObject,
		resizeMode: "cover",
	},
});
