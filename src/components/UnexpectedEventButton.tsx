import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { colors } from '../utils/colors';

interface UnexpectedEventButtonProps {
    onPress: () => void;
}

export const UnexpectedEventButton: React.FC<UnexpectedEventButtonProps> = ({
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                <AlertTriangle size={24} color={colors.growth} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Unexpected Event?</Text>
                <Text style={styles.subtitle}>Log emergencies or sudden expenses.</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#FFB84D',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF4E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 13,
        color: '#6B6B6B',
        lineHeight: 18,
    },
});

