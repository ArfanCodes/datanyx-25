import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { BjorkEmotion } from '../contexts/BjorkContext';

interface BjorkBadgeProps {
  emotion: BjorkEmotion;
}

export const BjorkBadge: React.FC<BjorkBadgeProps> = ({ emotion }) => {
  const imageSource = emotion === 'normal' 
    ? require('../../assets/mascot/bjork_normal.png')
    : require('../../assets/mascot/bjork_sad.png');

  return (
    <View style={[styles.container, emotion === 'sad' && styles.containerSad]}>
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F8F0',
    borderWidth: 2,
    borderColor: '#32D483',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  containerSad: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FFB84D',
  },
  image: {
    width: 36,
    height: 36,
  },
});
