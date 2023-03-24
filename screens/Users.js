import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TextInput,
	Button,
	TouchableOpacity,
	Text,
	KeyboardAvoidingView,
	ScrollView,
	SafeAreaView,
	Image,
} from "react-native";
import {
	Table,
	TableWrapper,
	Row,
	Rows,
	Col,
	Cell,
} from "react-native-table-component";

import { primary } from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { url } from "../constants/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../contexts/user-context";
import Loading from "../components/Loading";

const Users = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [image, setImage] = useState(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [signupLoading, setSignupLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	const { setUser, users, user } = useContext(UserContext);
	if (!user) {
		navigation.navigate("Home");
	}

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

	// TODO:TABLE HEAD
	const tableHead = ["Photo", "Name", "Email", "Role", "Status"];
	const widthArr = [100, 100, 150, 100, 100];

	const tableDat = [];
	for (let i = 0; i < users.length; i += 1) {
		const user = users[i];
		const tableUser = [
			user["image"],
			user["username"],
			user["email"],
			user["role"],
			user["status"],
		];
		tableDat.push(tableUser);
	}

	const element = (data, index) => (
		<View
			style={{
				width: 100,
				justifyContent: "center",
				alignItems: "center",
				marginVertical: 10,
			}}
		>
			<Image
				source={{ uri: data }}
				style={{
					width: 50,
					height: 50,
					borderRadius: 200,
				}}
			/>
		</View>
	);
	return (
		<ScrollView>
			<View style={styles.container}>
				<ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
					<Table
						borderStyle={{ borderColor: "transparent" }}
						style={{ padding: 5 }}
					>
						<Row
							data={tableHead}
							widthArr={widthArr}
							style={styles.head}
							textStyle={styles.text}
						/>
						{tableDat.map((rowData, index) => (
							<TableWrapper key={index} style={styles.row}>
								{rowData.map((cellData, cellIndex) => (
									<Cell
										key={cellIndex}
										data={cellIndex === 0 ? element(cellData, index) : cellData}
										textStyle={[
											styles.text,
											{ width: cellIndex === 2 ? 150 : 100 },
										]}
									/>
								))}
							</TableWrapper>
						))}
					</Table>
				</ScrollView>
			</View>
		</ScrollView>
	);
};

export default Users;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		paddingTop: 30,
		backgroundColor: "#fff",
		marginBottom: 80,
	},
	head: {
		height: 40,
		backgroundColor: "#808B97",
		textAlign: "center",
		paddingLeft: 5,
	},
	text: { width: 100 },
	row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
	btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
	btnText: { textAlign: "center", color: "#fff" },
});
