/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	Dimensions,
	StyleSheet,
	ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const { width } = Dimensions.get("window");
import SelectDropdown from "react-native-select-dropdown";

export default Dropdown2 = ({ data, setItem, title }) => {
	return (
		<View style={styles.viewContainer}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical={false}
				contentContainerStyle={styles.scrollViewContainer}
			>
				<View style={styles.dropdownsRow}>
					<SelectDropdown
						data={data}
						onSelect={(selectedItem, index) => {
							setItem(selectedItem);
							console.log(selectedItem);
						}}
						defaultButtonText={title}
						buttonTextAfterSelection={(selectedItem, index) => {
							return selectedItem;
						}}
						rowTextForSelection={(item, index) => {
							return item;
						}}
						buttonStyle={styles.dropdown1BtnStyle}
						buttonTextStyle={styles.dropdown1BtnTxtStyle}
						renderDropdownIcon={(isOpened) => {
							return (
								<FontAwesome
									name={isOpened ? "chevron-up" : "chevron-down"}
									color={"#444"}
									size={18}
								/>
							);
						}}
						dropdownIconPosition={"right"}
						dropdownStyle={styles.dropdown1DropdownStyle}
						rowStyle={styles.dropdown1RowStyle}
						rowTextStyle={styles.dropdown1RowTxtStyle}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "#fff",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 10,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	headerTitle: { color: "#000", fontWeight: "bold", fontSize: 16 },

	viewContainer: { width, marginVertical: 15, backgroundColor: "#fff" },
	scrollViewContainer: {
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	dropdownsRow: {
		flexDirection: "row",
		width: "80%",
		backgroundColor: "#fff",
	},

	dropdown1BtnStyle: {
		flex: 1,
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#444",
	},
	dropdown1BtnTxtStyle: { color: "#000", textAlign: "left" },
	dropdown1DropdownStyle: { backgroundColor: "gray" },
	dropdown1RowStyle: {
		backgroundColor: "#fff",
		borderBottomColor: "#000",
	},
	dropdown1RowTxtStyle: { color: "#000", textAlign: "left" },

	dropdown2BtnStyle: {
		flex: 1,
		height: 50,
		backgroundColor: "#FFF",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#444",
	},
	dropdown2BtnTxtStyle: { color: "#444", textAlign: "left" },
	dropdown2DropdownStyle: { backgroundColor: "#EFEFEF" },
	dropdown2RowStyle: {
		backgroundColor: "#EFEFEF",
		borderBottomColor: "#C5C5C5",
	},
	dropdown2RowTxtStyle: { color: "#444", textAlign: "left" },
});
