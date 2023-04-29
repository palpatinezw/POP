import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Modal,
	Pressable,
	TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

function processDate(thisDate) {
	console.log("PROCESS", thisDate);
	// console.log("PROCESS", {
	//   day:thisDate.getDate().toString(),
	//   month:(thisDate.getMonth()+1).toString(),
	//   yr:(thisDate.getFullYear() - 2000).toString(),
	//   hr:thisDate.getHours().toString(),
	//   min:thisDate.getMinutes().toString()
	// })
	return {
		day: thisDate.getDate().toString(),
		month: (thisDate.getMonth() + 1).toString(),
		yr: (thisDate.getFullYear() - 2000).toString(),
		hr: thisDate.getHours().toString(),
		min: thisDate.getMinutes().toString(),
	};
}
function dateToMilitaryTime(date) {
	const hours = date.getHours();
	const mins = date.getMinutes();

	return (
		(hours < 10 ? "0" + hours : hours.toString()) +
		(mins < 10 ? "0" + mins : mins.toString())
	);
}
function dateToMilitaryDate(date) {
	const day = date.getDate();
	const yr = date.getFullYear();
	const month = date.getMonth();

	const dayOfWk = date.getDay();
	const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return `${day < 10 ? "0" + day : day}/${
		month + 1 < 10 ? "0" + (month + 1) : month + 1
	}/${yr - 2000} ${dayList[dayOfWk]}`;
}

export default function App() {
	const [curDate, setCurDate] = useState(new Date());
	const [modalVisible, setModalVisible] = useState(false);

	const [refresher, setRefresher] = useState(0);

	const [time, setTime] = useState("");
	const [date, setDate] = useState("");
	const [ordCount, setOrdCount] = useState("");
	const [boCount, setBoCount] = useState("");
	const [popCount, setPopCount] = useState("");
	const [ordMonth, setOrdMonth] = useState("");

	const [ordDate, setOrdDate] = useState(
		new Date("January 26, 2025 00:00:00")
	);
	const [boDate, setBoDate] = useState(new Date("April 29, 2023 11:00:00"));
	const [popDate, setPopDate] = useState(new Date("June 4, 2023 11:00:00"));

	// for all the editable date fields
	const [ordDayVal, setOrdDayVal] = useState();
	const [ordMonthVal, setOrdMonthVal] = useState();
	const [ordYrVal, setOrdYrVal] = useState();

	const [boDayVal, setBoDayVal] = useState();
	const [boMonthVal, setBoMonthVal] = useState();
	const [boYrVal, setBoYrVal] = useState();
	const [boHrVal, setBoHrVal] = useState();
	const [boMinVal, setBoMinVal] = useState();

	const [popDayVal, setPopDayVal] = useState();
	const [popMonthVal, setPopMonthVal] = useState();
	const [popYrVal, setPopYrVal] = useState();

	//QOTD
	let quoteLastEdit = 0;
	const [quote, setQuote] = useState("");

	async function updateFields() {
		console.log("ORD DATE", ordDate);
		return Promise.all([
			setOrdDayVal(processDate(ordDate).day),
			setOrdMonthVal(processDate(ordDate).month),
			setOrdYrVal(processDate(ordDate).yr),

			setPopDayVal(processDate(popDate).day),
			setPopMonthVal(processDate(popDate).month),
			setPopYrVal(processDate(popDate).yr),

			setBoDayVal(processDate(boDate).day),
			setBoMonthVal(processDate(boDate).month),
			setBoYrVal(processDate(boDate).yr),
			setBoHrVal(processDate(boDate).hr),
			setBoMinVal(processDate(boDate).min),
		]);
	}

	async function pageInit() {
		AsyncStorage.getItem("ordTime")
			.then((res) => {
				let temp = new Date(parseInt(res) ?? 0);
                console.log("ORD extract", temp)
				return temp!=NaN ? setOrdDate(temp) : setOrdDate(curDate);
			})
			.catch((err) => {
				console.log(err);
			}),
			AsyncStorage.getItem("popTime")
				.then((res) => {
					let temp = new Date(parseInt(res) ?? 0);
					return temp!=NaN ? setPopDate(temp) : setPopDate(curDate);
				})
				.catch((err) => {
					console.log(err);
				}),
			AsyncStorage.getItem("boTime")
				.then((res) => {
					let temp = new Date(parseInt(res) ?? 0);
					return temp!=NaN ? setBoDate(temp) : setBoDate(curDate);
				})
				.catch((err) => {
					console.log(err);
				});
	}

	async function updateDates() {
		let newBoDate = new Date(
			2000 + Number(boYrVal),
			Number(boMonthVal) - 1,
			Number(boDayVal),
			Number(boHrVal),
			Number(boMinVal)
		);
		let newPopDate = new Date(
			2000 + parseInt(popYrVal),
			parseInt(popMonthVal) - 1,
			parseInt(popDayVal)
		);
		let newOrdDate = new Date(
			2000 + parseInt(ordYrVal),
			parseInt(ordMonthVal) - 1,
			parseInt(ordDayVal)
		);
        console.log("ORD DATE", newOrdDate);
		var newBoTime = newBoDate.getTime();
		var newPopTime = newPopDate.getTime();
		var newOrdTime = newOrdDate.getTime();

		promiseArr = [];
		if (newBoDate != null) {
			// promiseArr.push(setBoDate(new Date(newBoTime)).catch((err) => {console.log(err)}))
			promiseArr.push(
				AsyncStorage.setItem("boTime", newBoTime.toString()).catch(
					(err) => {
						console.log(err);
					}
				)
			);
		}
		if (newPopDate != null) {
			// promiseArr.push(setPopDate(new Date(newPopTime)).catch((err) => {console.log(err)}))
			promiseArr.push(
				AsyncStorage.setItem("popTime", newPopTime.toString()).catch(
					(err) => {
						console.log(err);
					}
				)
			);
		}
		if (newOrdDate != null) {
			// promiseArr.push(setOrdDate(new Date(newOrdTime)).catch((err) => {console.log(err)}))
			promiseArr.push(
				AsyncStorage.setItem("ordTime", newOrdTime.toString()).catch(
					(err) => {
						console.log(err);
					}
				)
			);
		}

		return Promise.all(promiseArr)
			.then((val) => {
				pageInit();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		pageInit();
	}, []);
	useEffect(() => {
		setInterval(() => {
			// console.log("SET", new Date());
			let tempCurDate = new Date();
			setCurDate(tempCurDate);

			setTime(dateToMilitaryTime(tempCurDate));
			setDate(dateToMilitaryDate(tempCurDate));
		}, 1000);
	}, []);
	useEffect(() => {
		fetch("https://api.quotable.io/quotes/random?maxLength=50", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log(data)
				setQuote(`${data[0].content} - ${data[0].author}`);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	useEffect(() => {
		setOrdCount(
			Math.ceil((ordDate.getTime() - curDate.getTime()) / 86400000)
		);
		setBoCount(
			Math.ceil((boDate.getTime() - curDate.getTime()) / 86400000)
		);
		setPopCount(
			Math.ceil((popDate.getTime() - curDate.getTime()) / 604800000)
		);
		setOrdMonth(
			(ordDate.getFullYear() - curDate.getFullYear()) * 12 +
				ordDate.getMonth() -
				curDate.getMonth()
		);
	}, [curDate, ordDate, boDate, popDate]);

	return (
		<View style={styles.container}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(false);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<View style={styles.dateFormContainer}>
							<View style={styles.dateFormBox}>
								<Text style={styles.dateLabel}>BO</Text>
								<TextInput
									style={styles.dateInput}
									value={boDayVal}
									onChangeText={(text) => {
										setBoDayVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={boMonthVal}
									onChangeText={(text) => {
										setBoMonthVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={boYrVal}
									onChangeText={(text) => {
										setBoYrVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={boHrVal}
									onChangeText={(text) => {
										setBoHrVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={boMinVal}
									onChangeText={(text) => {
										setBoMinVal(text);
									}}
								></TextInput>
							</View>
							<View style={styles.dateFormBox}>
								<Text style={styles.dateLabel}>POP</Text>
								<TextInput
									style={styles.dateInput}
									value={popDayVal}
									onChangeText={(text) => {
										setPopDayVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={popMonthVal}
									onChangeText={(text) => {
										setPopMonthVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={popYrVal}
									onChangeText={(text) => {
										setPopYrVal(text);
									}}
								></TextInput>
							</View>
							<View style={styles.dateFormBox}>
								<Text style={styles.dateLabel}>ORD</Text>
								<TextInput
									style={styles.dateInput}
									value={ordDayVal}
									onChangeText={(text) => {
										setOrdDayVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={ordMonthVal}
									onChangeText={(text) => {
										setOrdMonthVal(text);
									}}
								></TextInput>
								<TextInput
									style={styles.dateInput}
									value={ordYrVal}
									onChangeText={(text) => {
										setOrdYrVal(text);
									}}
								></TextInput>
							</View>
						</View>
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={() => {
								updateDates();
								setModalVisible(!modalVisible);
							}}
						>
							<Text style={styles.textStyle}>DONE</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			<View style={styles.dateContainer}>
				<Text style={styles.timeText}>{time}</Text>
				<Text style={styles.dateText}>{date}</Text>
			</View>
			<TouchableOpacity
				style={styles.ORDContainer}
				onPress={() => {
					updateFields().then(() => {
						setModalVisible(true);
					});
				}}
			>
				<Text style={styles.ordCountText}>{ordCount}</Text>
				<Text style={styles.ordText}>days to ORD</Text>
			</TouchableOpacity>
			<View style={styles.countdownContainer}>
				<View style={styles.countNoContainer}>
					<View style={styles.countNoBox}>
						<Text style={styles.countNo}>{boCount}</Text>
					</View>
					<Text style={styles.countNoText}>DBBO</Text>
				</View>
				<View style={styles.countNoContainer}>
					<View style={styles.countNoBox}>
						<Text style={styles.countNo}>{popCount}</Text>
					</View>
					<Text style={styles.countNoText}>WBP</Text>
				</View>
				<View style={styles.countNoContainer}>
					<View style={styles.countNoBox}>
						<Text style={styles.countNo}>{ordMonth}</Text>
					</View>
					<Text style={styles.countNoText}>MBO</Text>
				</View>
			</View>
			<View style={styles.footerContainer}>
				<Text style={styles.paragraph}>QOTD: {quote}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingTop: Constants.statusBarHeight,
		backgroundColor: "#ecf0f1",
		padding: 10,
	},
	dateContainer: {
		flex: 2,
		padding: 10,
	},
	ORDContainer: {
		flex: 2,
		borderWidth: 2,
		borderRadius: 10,
		borderColor: "#32C484",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		backgroundColor: "#bfead2",
	},
	countdownContainer: {
		flex: 5,
		padding: 10,
	},
	countNoContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 5,
	},
	countNoBox: {
		height: 50,
		width: 50,
		borderWidth: 2,
		borderRadius: 10,
		borderColor: "#32C484",
		justifyContent: "center",
		alignItems: "center",
		textAlignVertical: "center",
	},
	footerContainer: {
		flex: 1,
		padding: 5,
		fontSize: 15,
	},
	paragraph: {
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
		padding: 10,
	},
	timeText: {
		fontFamily: "monospace",
		fontSize: 70,
	},
	dateText: {
		fontSize: 25,
	},
	ordText: {
		fontSize: 25,
	},
	ordCountText: {
		fontSize: 60,
	},
	countNoText: {
		fontSize: 30,
		marginLeft: 15,
	},
	countNo: {
		fontSize: 40,
		margin: 0,
		padding: 0,
		includeFontPadding: false,
	},

	// modal
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		width: "90%",
		backgroundColor: "#fbe6f0",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonClose: {
		backgroundColor: "#c43271",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	dateFormContainer: {
		padding: 10,
	},
	dateFormBox: {
		flexDirection: "row",
	},
	dateInput: {
		height: 40,
		width: 40,
		fontSize: 20,
		borderWidth: 2,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		textAlignVertical: "center",
		padding: 4,
		margin: 1,
	},
	dateLabel: {
		width: 45,
		fontSize: 20,
		justifyContent: "center",
		alignItems: "center",
		textAlignVertical: "center",
	},
});
