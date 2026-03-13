import { StyleSheet } from "react-native";
import Colors from "../../../features/config/Colors";

const NotFoundStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333', // Or match App background
    },
    errorCode: {
        fontSize: 72,
        fontWeight: 'bold',
        color: Colors.primaryTextColor || '#f1f1f1',
    },
    message: {
        fontSize: 24,
        color: Colors.primaryTextColor || '#f1f1f1',
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        color: '#888',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    }
});

export default NotFoundStyle;
