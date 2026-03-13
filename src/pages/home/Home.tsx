import { ScrollView, Text, View } from "react-native";
import HomeStyle from "./ui/HomeStyle";

export default function Home() {
    const skeletonItems = Array.from({ length: 6 }); // Generate 6 placeholder items

    return (
        <View style={HomeStyle.pageContainer}>
            <Text style={HomeStyle.pageTitle}>Hello, World!</Text>

            <ScrollView contentContainerStyle={HomeStyle.itemsContainer}>
                {skeletonItems.map((_, index) => (
                    <View key={index} style={HomeStyle.itemWrapper}>
                        <View style={HomeStyle.itemSquare} />
                        <View style={HomeStyle.itemTextPlaceholder} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}