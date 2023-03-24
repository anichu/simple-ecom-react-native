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
} from "react-native";
import { primary } from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import { Alert, ScrollView } from "react-native";
import { url } from "../constants/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../contexts/user-context";
import Loading from "../components/Loading";

const Signup = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [image, setImage] = useState(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [signupLoading, setSignupLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	const { setUser } = useContext(UserContext);

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
			aspect: [4, 3],
			quality: 1,
		});
		const imageUri = result.assets[0].uri;

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

	if (imageLoading) {
		return <Loading />;
	}

	// TODO::EMAIL VALIDATION REGEX
	const isValidEmail = (email) => {
		// Email validation regex
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		return regex.test(email);
	};

	const handleSubmit = async () => {
		// TODO::USERNAME CHECK
		if (!username || username.length < 3) {
			Alert.alert(
				"Invalid password",
				"username should be at least 3 characters long."
			);
			return;
		}

		// TODO::EMAIL CHECK
		if (!email || !isValidEmail(email)) {
			Alert.alert("Invalid email", "Please enter a valid email address.");
			return;
		}

		// TODO::PASSWORD
		if (!password || password.length < 5) {
			Alert.alert(
				"Invalid password",
				"Password should be at least 6 characters long."
			);
			return;
		}

		// TODO::IMAGE CHECK
		if (!imageUrl) {
			Alert.alert("Invalid Image", "Image should not be empty.");
			return;
		}

		try {
			// TODO::HTTP CALL TO SERVER FOR REGISTER
			setSignupLoading(true);
			const response = await fetch(`${url}/api/user/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					email,
					password,
					image: imageUrl,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				await AsyncStorage.setItem("anis-molla-user", JSON.stringify(data));
				setUser(data);
				navigation.navigate("Home");
			} else {
				// TODO::USER SIGNUP FAILED
				const data = await response.json();
				console.log(data);
				throw new Error(
					data?.message ? data?.message : "Something went wrong!"
				);
			}
			setSignupLoading(false);
		} catch (error) {
			setSignupLoading(false);
			Alert.alert("wrong!!!", error.message);
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<TextInput
					style={styles.input}
					placeholder="Username"
					value={username}
					onChangeText={(text) => setUsername(text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					keyboardType="email-address"
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					secureTextEntry={true}
				/>
				{!imageUrl && (
					<TouchableOpacity
						style={styles.imageButton}
						onPress={handleImagePicker}
					>
						<Text style={styles.imageButtonText}>Choose Image</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Signup</Text>
				</TouchableOpacity>

				<View style={styles.signupInfo}>
					<Text style={{ fontSize: 14 }}>Already, Have an account?</Text>
					<TouchableOpacity onPress={() => navigation.navigate("Login")}>
						<Text style={styles.linkText}>Login</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		marginVertical: 20,
		backgroundColor: "white",
		minWidth: "100%",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "80%",
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
		marginTop: 10,
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

export default Signup;
