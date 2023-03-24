import {
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../contexts/user-context";
import { primary } from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
	const { user, setUser } = useContext(UserContext);
	// TODO::LOGOUT HANDLER
	const logoutHandler = async () => {
		await AsyncStorage.removeItem("anis-molla-user");
		setUser(null);
		navigation.navigate("Home");
	};
	return (
		<SafeAreaView style={styles.container}>
			<Image source={{ uri: user?.image }} style={styles.image} />
			<Text
				style={[styles.text, { textTransform: "capitalize", paddingTop: 10 }]}
			>
				{user?.name}
			</Text>
			<Text
				style={[styles.text, { textTransform: "capitalize", paddingTop: 10 }]}
			>
				{user?.email}
			</Text>
			<TouchableOpacity style={styles.button} onPress={logoutHandler}>
				<Text style={styles.textButton}>Logout</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		backgroundColor: primary,
		width: 100,
		padding: 10,
		borderRadius: 10,
		marginTop: 20,
	},
	text: {
		textAlign: "left",
		color: "black",
		fontSize: 20,
		fontWeight: 700,
		marginTop: 10,
	},
	textButton: {
		textAlign: "center",
		color: "white",
		fontSize: 20,
	},
	image: { width: 200, height: 200, borderRadius: 10 },
});
