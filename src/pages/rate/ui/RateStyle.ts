import { StyleSheet } from "react-native";
import Colors from "../../../features/config/Colors";

const RateStyle = StyleSheet.create({
    pageContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    pageTitleRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    search: {
        borderWidth: 1.0,
        borderColor: "#888",
        flex: 1,
    },
    pageTitle: {
        flex: 1,
        color: Colors.primaryTextColor,
        fontWeight: 600,
        textAlign: "center",
        fontSize: 20.0,
        marginVertical: 10.0,
    },
    titleDate: {
        color: Colors.primaryTextColor,
    },
    rateLine: {
        display: "flex",
        flexDirection: "row",
        // borderBottomColor: "#555",
        // borderBottomWidth: 1.0,
    },
    rateLineOdd: {
        backgroundColor: "#444"
    },
    rateLineEven: {
        backgroundColor: "#555"
    },
    rateCc: {
        flex: 1
    },
    rateTxt: {
        flex: 5,
    },
    rateRate: {
        flex: 2,
    }
});

export default RateStyle;