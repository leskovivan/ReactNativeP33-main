import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MemoryButtonTypes } from "../model/MemoryButtonTypes";

interface MemoryButtonProps {
    type: MemoryButtonTypes;
    text: string;
    onPress?: () => void;
}

export default function MemoryButton({ type, text, onPress }: MemoryButtonProps) {
    const isEnabled = type === MemoryButtonTypes.enabled;

    return (
        <TouchableOpacity 
            style={[styles.container, isEnabled ? styles.enabled : styles.disabled]}
            onPress={isEnabled ? onPress : undefined}
            disabled={!isEnabled}
        >
            <Text style={[styles.text, isEnabled ? styles.textEnabled : styles.textDisabled]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    enabled: {
        // backgroundColor: 'transparent',
    },
    disabled: {
        // backgroundColor: 'transparent',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textEnabled: {
        color: '#F7FFFF',
    },
    textDisabled: {
        color: '#555',
    }
});
