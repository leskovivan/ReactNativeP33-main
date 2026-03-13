import { StyleSheet } from "react-native";
import Colors from "../../../features/config/Colors";

const HomeStyle = StyleSheet.create({
    pageContainer: {
        flex: 1,
        padding: 10,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primaryTextColor,
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    itemWrapper: {
        width: '48%', // Approx 2 columns
        marginBottom: 20,
    },
    itemSquare: {
        width: '100%',
        aspectRatio: 1, // Keep it square
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent
        borderRadius: 8,
        marginBottom: 8,
    },
    itemTextPlaceholder: {
        width: '80%',
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent
        borderRadius: 4,
    }
});

export default HomeStyle;
