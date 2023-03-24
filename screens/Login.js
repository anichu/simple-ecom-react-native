import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	View,
	Alert,
	KeyboardAvoidingView,
	ScrollView,
} from "react-native";
import Loading from "../components/Loading";
import { primary, secondary } from "../constants/colors";
import { url } from "../constants/url";
import { UserContext } from "../contexts/user-context";

export default function Login({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setUser } = useContext(UserContext);
	const [loginLoading, setLoginLoading] = useState(false);
	// TODO::EMAIL VALIDATION REGEX
	const isValidEmail = (email) => {
		// Email validation regex
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		return regex.test(email);
	};

	const handleLogin = async () => {
		if (!email || !isValidEmail(email)) {
			Alert.alert("Invalid email", "Please enter a valid email address.");
			return;
		}

		if (!password || password.length < 5) {
			Alert.alert(
				"Invalid password",
				"Password should be at least 6 characters long."
			);
			return;
		}

		// TODO::HTTP CALL TO SERVER FOR AUTHENTICATION

		try {
			setLoginLoading(true);
			const response = await fetch(`${url}/api/user/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const data = await response.json();
				await AsyncStorage.setItem("anis-molla-user", JSON.stringify(data));
				setUser(data);
				navigation.navigate("Home");
			} else {
				const data = await response.json();

				throw new Error(
					data?.message ? data?.message : "Something went wrong!"
				);
			}
			setLoginLoading(false);
		} catch (error) {
			Alert.alert("wrong!!!", error.message);
			setLoginLoading(false);
		}
	};
	if (loginLoading) {
		return <Loading />;
	}
	return (
		<KeyboardAvoidingView style={styles.container}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					secureTextEntry
				/>
				<TouchableOpacity style={styles.button} onPress={handleLogin}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
				<View style={styles.signupInfo}>
					<Text>Create an account.</Text>
					<TouchableOpacity onPress={() => navigation.navigate("Signup")}>
						<Text style={styles.linkText}>SignUp</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		marginVertical: 20,
		backgroundColor: "white",
		minWidth: "100%",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "70%",
		borderRadius: 10,
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		margin: 20,
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
	},
	signupInfo: {
		flexDirection: "row",
		width: "80%",
		marginTop: 10,
	},
});
