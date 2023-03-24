import React, { useContext, useState } from "react";
import {
	StyleSheet,
	View,
	TextInput,
	Button,
	TouchableOpacity,
	Text,
	KeyboardAvoidingView,
	SafeAreaView,
	Image,
} from "react-native";
import { primary } from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import { Alert, ScrollView } from "react-native";
import { url } from "../constants/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../contexts/user-context";
import Loading from "../components/Loading";
import { ProductContext } from "../contexts/product-context";

const AddProduct = ({ navigation }) => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [image, setImage] = useState(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [addproductLoading, setAddproductLoading] = useState(false);
	const { setUser } = useContext(UserContext);
	const { setProducts } = useContext(ProductContext);

	// TODO::UPLOAD IMAGE HANDLER
	const handleImagePicker = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			Alert.alert("Permission to access camera roll is required!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			quality: 1,
		});
		const imageUri = result.assets[0].uri;
		setImage(imageUri);
		if (result.canceled) {
			Alert.alert("Something went wrong!!!");
			return;
		}

		setImageLoading(true);

		let formData = new FormData();
		let fileType = imageUri[imageUri.length - 1];
		formData.append("image", {
			uri: imageUri,
			name: `photo-${Date.now()}.${fileType}`,
			type: `image/${fileType}`,
		});
		const url = `https://api.imgbb.com/1/upload?key=64deb29335f3fa3ae256436ac8b59168`;
		const responseImageData = await fetch(url, {
			method: "POST",
			body: formData,
		});
		const imgData = await responseImageData.json();

		if (imgData.success) {
			setImageUrl(imgData?.data?.url);
		}
		setImageLoading(false);
	};

	if (imageLoading || addproductLoading) {
		return <Loading />;
	}

	const handleSubmit = async () => {
		// TODO::NAME CHECK
		if (!name) {
			Alert.alert("Invalid name", "Name should not be empty");
			return;
		}

		// TODO::Price CHECK
		if (price < 0 || isNaN(price)) {
			Alert.alert("Invalid Price", "Please enter a valid price.");
			return;
		}

		// TODO::IMAGE CHECK
		if (!imageUrl) {
			Alert.alert("Invalid Image", "Image should not be empty.");
			return;
		}

		try {
			// TODO::HTTP CALL TO SERVER FOR ADDPRODUCT
			setAddproductLoading(true);
			const response = await fetch(`${url}/api/product/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					price,
					image: imageUrl,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				setProducts((prev) => [data, ...prev]);
				setName("");
				setImage("");
				setPrice("");
			} else {
				throw new Error("Something Went Wrong!!");
			}
			setAddproductLoading(false);
		} catch (error) {
			setAddproductLoading(false);

			Alert.alert("wrong!!!", error.message);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				{image && (
					<View>
						<Image
							source={{ uri: image }}
							style={{ width: 200, height: 100 }}
						/>
					</View>
				)}
				<TextInput
					style={styles.input}
					placeholder="Name"
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Price"
					value={price}
					onChangeText={(text) => setPrice(text)}
					keyboardType="number-pad"
				/>

				<TouchableOpacity
					style={styles.imageButton}
					onPress={handleImagePicker}
				>
					<Text style={styles.imageButtonText}>Choose Image</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Add Product</Text>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default AddProduct;

const styles = StyleSheet.create({
	contentContainer: {
		marginVertical: 20,
		backgroundColor: "white",
		minWidth: "100%",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "90%",
		borderRadius: 10,
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		margin: 10,
	},
	input: {
		width: "80%",
		height: 50,
		margin: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
	},
	button: {
		backgroundColor: primary,
		padding: 10,
		borderRadius: 5,
		width: "80%",
		marginTop: 20,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
	},
	linkText: {
		color: "#007AFF",
		textDecorationLine: "underline",
		marginLeft: 10,
		fontSize: 20,
	},
	signupInfo: {
		flexDirection: "row",
		width: "80%",
		marginTop: 20,
		alignItems: "center",
	},
	imageButton: {
		backgroundColor: "#2196F3",
		padding: 10,
		borderRadius: 5,
		width: "80%",
	},
	imageButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});
