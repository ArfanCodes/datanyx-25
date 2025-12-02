import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { BjorkEmotion } from '../contexts/BjorkContext';

interface BjorkMascotProps {
  emotion: BjorkEmotion;
  message: string;
  size?: 'small' | 'medium' | 'large';
  showMessage?: boolean;
  animate?: boolean;
  onPress?: () => void;
}

const SIZE_CONFIG = {
  small: {
    width: 80,
    height: 80,
    fontSize: 12,
    bubbleMaxWidth: 180,
  },
  medium: {
    width: 140,
    height: 140,
    fontSize: 15,
    bubbleMaxWidth: 240,
  },
  large: {
    width: 180,
    height: 180,
    fontSize: 17,
    bubbleMaxWidth: 280,
  },
};

export const BjorkMascot: React.FC<BjorkMascotProps> = ({
  emotion,
  message,
  size = 'medium',
  showMessage = true,
  animate = true,
  onPress,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const previousMessage = useRef(message);

  // Get the correct image based on emotion
  const imageSource = emotion === 'normal' 
    ? require('../../assets/mascot/bjork_normal.png')
    : require('../../assets/mascot/bjork_sad.png');

  // Handle press with scale animation
  const handlePress = () => {
    if (onPress) {
      // Quick scale down and up animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      onPress();
    }
  };

  // Animate message change
  useEffect(() => {
    if (message !== previousMessage.current) {
      // Fade out old message
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        previousMessage.current = message;
        // Fade in new message
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [message, textFadeAnim]);

  // Bounce animation based on emotion
  useEffect(() => {
    if (animate) {
      if (emotion === 'normal') {
        // Gentle bounce animation for normal
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -8,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        // Slow droop for sad
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 4,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }

    // Fade in animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [emotion, animate, bounceAnim, fadeAnim]);

  const sizeConfig = SIZE_CONFIG[size];

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: bounceAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Image
          source={imageSource}
          style={{
            width: sizeConfig.width,
            height: sizeConfig.height,
          }}
          resizeMode="contain"
        />
        {showMessage && message && (
          <Animated.View 
            style={[
              styles.messageBubble, 
              emotion === 'sad' && styles.messageBubbleSad,
              { 
                maxWidth: sizeConfig.bubbleMaxWidth,
                opacity: textFadeAnim,
              }
            ]}
          >
            <Text 
              style={[styles.messageText, { fontSize: sizeConfig.fontSize }]}
              numberOfLines={3}
              adjustsFontSizeToFit
            >
              {message}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#E8F8F0',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#32D483',
    alignSelf: 'center',
  },
  messageBubbleSad: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FFB84D',
  },
  messageText: {
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});
