import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
    percentage: number;
    spent: number;
    budget: number;
    size?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    spent,
    budget,
    size = 160,
}) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(percentage, 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Determine color based on percentage
    let progressColor = '#32D483'; // Normal - green
    if (percentage >= 100) {
        progressColor = '#E53935'; // Danger - red
    } else if (percentage >= 90) {
        progressColor = '#FFB74D'; // Warning - orange
    }

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E8E8E8"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            {/* Center Text */}
            <View style={styles.centerContent}>
                <Text style={[styles.percentageText, { color: progressColor }]}>
                    {Math.round(percentage)}%
                </Text>
                <Text style={styles.labelText}>spent</Text>
                <Text style={styles.amountText}>
                    ₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    centerContent: {
        position: 'absolute',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 36,
        fontWeight: '700',
        letterSpacing: -1,
    },
    labelText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B6B6B',
        marginTop: 2,
        marginBottom: 6,
    },
    amountText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9A9A9A',
    },
});
