import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Login from "./screens/Login";
import { Image, StyleSheet, Text, View } from "react-native";
import MyCart from "./screens/MyCart";
import Admin from "./screens/Admin";
import home from "./assets/icons/home.png";
import admin from "./assets/icons/user.png";
import cart from "./assets/icons/shopping-cart.png";
import enter from "./assets/icons/enter.png";
import { GlobalStyles } from "./constants/styles";
import AddProduct from "./screens/AddProduct";
import AddUser from "./screens/AddUser";
import ProductContextProvider from "./contexts/product-context";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from "./screens/Signup";
import { primary } from "./constants/colors";
import UserContextProvider, { UserContext } from "./contexts/user-context";
import { useCallback, useContext, useEffect } from "react";
import Profile from "./screens/Profile";
import Users from "./screens/Users";
import { Alert } from "react-native";
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AdminComponent = ({ navigation }) => {
	const { user } = useContext(UserContext);

	return (
		<Drawer.Navigator
			screenOptions={{
				headerShown: true,
				headerTitleAlign: "center",
				headerStyle: {
					backgroundColor: "#14213D",
				},
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontWeight: "bold",
				},
			}}
			initialRouteName="Users"
		>
			<Drawer.Screen
				name="AddProduct"
				component={AddProduct}
				options={{
					drawerLabel: "AddProduct",
					headerTitle: "Add Products",
					headerTitleAlign: "center",
				}}
			/>
			<Drawer.Screen
				name="Users"
				component={Users}
				options={{
					drawerLabel: "Users",
					headerTitle: "Users",
					headerTitleAlign: "center",
				}}
			/>
			<Drawer.Screen
				name="AddUser"
				component={AddUser}
				options={{
					drawerLabel: "AddUser",
					headerTitle: "Add Users",
					headerTitleAlign: "center",
				}}
			/>
		</Drawer.Navigator>
	);
};

const StackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
				headerTitleAlign: "center",
				headerStyle: {
					backgroundColor: "#14213D",
				},
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontWeight: "bold",
				},
			}}
			initialRouteName="Login"
		>
			<Stack.Screen name="Signup" component={Signup} />
			<Stack.Screen name="Login" component={Login} />
		</Stack.Navigator>
	);
};

const Bottom = ({ navigation }) => {
	const { user, setUser } = useContext(UserContext);
	// TODO::TRACK USER LOGIN
	useCallback(() => {
		const focusHandler = navigation.addListener("focus", () => {
			const getUser = async () => {
				const userFromLocaleStorage = await AsyncStorage.getItem(
					"anis-molla-user"
				);
				setUser(JSON.parse(userFromLocaleStorage));
			};
			getUser();
		});
		return focusHandler;
	}, [navigation]);

	return (
		<BottomTab.Navigator
			screenOptions={{
				tabBarShowLabel: false,
				tabBarHideOnKeyboard: true,
				tabBarStyle: {
					position: "absolute",
					bottom: 5,
					left: 5,
					right: 5,
					backgroundColor: "#14213D",
					borderTopColor: "none",
					height: 60,
					borderRadius: 5,
					...styles.shadow,
				},
			}}
		>
			<BottomTab.Screen
				name="Home"
				options={{
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								top: 5,
							}}
						>
							<Image
								source={require("./assets/icons/home.png")}
								style={{
									height: 20,
									width: 20,
									tintColor: focused ? "blue" : "white",
								}}
								resizeMode="contain"
							/>
							<Text
								style={{
									fontSize: 14,
									marginBottom: 10,
									marginTop: 5,
									color: focused ? "blue" : "white",
								}}
							>
								Home
							</Text>
						</View>
					),
				}}
				component={Home}
			/>
			<BottomTab.Screen
				name="MyCart"
				options={{
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								top: 5,
							}}
						>
							<Image
								source={require("./assets/icons/shopping-cart.png")}
								style={{
									height: 20,
									width: 20,
									tintColor: focused ? "blue" : "white",
								}}
								resizeMode="contain"
							/>
							<Text
								style={{
									fontSize: 14,
									marginBottom: 10,
									marginTop: 5,
									color: focused ? "blue" : "white",
								}}
							>
								MyCart
							</Text>
						</View>
					),
				}}
				component={MyCart}
			/>
			{user && user?._id ? (
				<BottomTab.Screen
					name="Profile"
					options={{
						headerShown: true,
						headerTitleAlign: "center",
						headerStyle: {
							backgroundColor: "#14213D",
						},
						headerTintColor: "#fff",
						headerTitleStyle: {
							fontWeight: "bold",
						},
						tabBarIcon: ({ focused }) => (
							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									top: 5,
								}}
							>
								<Image
									source={require("./assets/icons/shopping-cart.png")}
									style={{
										height: 20,
										width: 20,
										tintColor: focused ? "blue" : "white",
									}}
									resizeMode="contain"
								/>
								<Text
									style={{
										fontSize: 14,
										marginBottom: 10,
										marginTop: 5,
										color: focused ? "blue" : "white",
									}}
								>
									Profile
								</Text>
							</View>
						),
					}}
					component={Profile}
				/>
			) : (
				<BottomTab.Screen
					name="auth"
					options={{
						headerShown: false,
						tabBarIcon: ({ focused }) => (
							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									top: 5,
								}}
							>
								<Image
									source={require("./assets/icons/enter.png")}
									style={{
										height: 20,
										width: 20,
										tintColor: focused ? "blue" : "white",
									}}
									resizeMode="contain"
								/>
								<Text
									style={{
										fontSize: 14,
										marginBottom: 10,
										marginTop: 5,
										color: focused ? "blue" : "white",
									}}
								>
									Login
								</Text>
							</View>
						),
					}}
					component={StackNavigator}
				/>
			)}

			<BottomTab.Screen
				name="Admin"
				listeners={({ navigation }) => ({
					tabPress: (e) => {
						// Prevent default action
						e.preventDefault();
						if (!user) {
							Alert.alert(
								"Authentication Error",
								"Please log in to view Admin."
							);
							return;
						}
						navigation.navigate("Admin");
					},
				})}
				options={{
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								top: 5,
							}}
						>
							<Image
								source={require("./assets/icons/user.png")}
								style={{
									height: 20,
									width: 20,
									tintColor: focused ? "blue" : "white",
								}}
								resizeMode="contain"
							/>
							<Text
								style={{
									fontSize: 14,
									marginBottom: 10,
									marginTop: 5,
									color: focused ? "blue" : "white",
								}}
							>
								Admin
							</Text>
						</View>
					),
				}}
				component={AdminComponent}
			/>
		</BottomTab.Navigator>
	);
};

export default function App() {
	return (
		<>
			<StatusBar style="light" backgroundColor={primary} />
			<UserContextProvider>
				<ProductContextProvider>
					<NavigationContainer>
						<Bottom></Bottom>
					</NavigationContainer>
				</ProductContextProvider>
			</UserContextProvider>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	shadow: {
		shadowColor: "#fff",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.02,
		shadowRadius: 1,
		elevation: 2,
	},
});
