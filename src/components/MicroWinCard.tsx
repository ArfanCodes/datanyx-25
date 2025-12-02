import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Target } from 'lucide-react-native';
import { colors } from '../utils/colors';

interface MicroWinCardProps {
    suggestedSaving: number;
    onSave: () => void;
    onDismiss: () => void;
}

export const MicroWinCard: React.FC<MicroWinCardProps> = ({
    suggestedSaving,
    onSave,
    onDismiss,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Target size={32} color={colors.buttonGreen} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Nice! You could save ₹{suggestedSaving} from that spend.
                    </Text>
                    <Text style={styles.subtitle}>
                        Round it up and we'll move ₹{suggestedSaving} to your Safety pot.
                    </Text>
                </View>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={onSave}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save ₹{suggestedSaving}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={onDismiss}
                    activeOpacity={0.7}
                >
                    <Text style={styles.dismissButtonText}>Not now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E8F8F0',
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 16,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#32D483',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        lineHeight: 22,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B6B6B',
        lineHeight: 20,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#32D483',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    dismissButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E8E8E8',
    },
    dismissButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B6B6B',
    },
});

