import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { url } from "../constants/url";

export const UserContext = createContext();
const UserContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const getUser = async () => {
			const data = JSON.parse(await AsyncStorage.getItem("anis-molla-user"));
			if (data) {
				setUser(data);
			} else {
				setUser(null);
			}
		};
		getUser();

		const getUsers = async () => {
			const response = await fetch(`${url}/api/user/`);
			const data = await response.json();
			setUsers(data);
			console.log(data);
		};
		getUsers();
	}, []);
	const value = {
		user,
		setUser,
		users,
		setUsers,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
