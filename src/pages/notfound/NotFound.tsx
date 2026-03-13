import { Text, View } from "react-native";
import NotFoundStyle from "./ui/NotFoundStyle";

export default function NotFound() {
    return (
        <View style={NotFoundStyle.container}>
            <Text style={NotFoundStyle.errorCode}>404</Text>
            <Text style={NotFoundStyle.message}>Page not found</Text>
            <Text style={NotFoundStyle.description}>
                The page you are looking for does not exist or has been moved.
            </Text>
        </View>
    );
}
