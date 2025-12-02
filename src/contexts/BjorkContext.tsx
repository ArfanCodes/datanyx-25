import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BJORK_MESSAGES, BjorkMessageCategory } from '../config/bjorkMessages';

export type BjorkEmotion = 'normal' | 'sad';

interface BjorkState {
  emotion: BjorkEmotion;
  message: string;
  category: BjorkMessageCategory;
}

interface BjorkContextType {
  bjorkState: BjorkState;
  updateBjorkState: (category: BjorkMessageCategory, forceEmotion?: BjorkEmotion) => void;
  triggerPositiveAction: (customMessage?: string) => void;
  triggerNegativeAction: (customMessage?: string) => void;
  triggerNeutralAction: (customMessage?: string) => void;
  toggleEmotion: () => void;
}

const BjorkContext = createContext<BjorkContextType | undefined>(undefined);

const MESSAGE_COOLDOWN_MS = 4000; // 4 seconds cooldown

export const BjorkProvider = ({ children }: { children: ReactNode }) => {
  const [bjorkState, setBjorkState] = useState<BjorkState>({
    emotion: 'normal',
    message: 'Ready to help!',
    category: 'neutral_messages',
  });

  const lastUpdateTime = useRef<number>(Date.now());
  const messageIndexRef = useRef<{ [key: string]: number }>({
    happy_messages: 0,
    sad_messages: 0,
    neutral_messages: 0,
  });

  // Get a random message from a category, avoiding repetition
  const getMessageFromCategory = useCallback((category: BjorkMessageCategory): string => {
    const messages = BJORK_MESSAGES[category];
    const currentIndex = messageIndexRef.current[category] || 0;
    
    // Get next message in rotation
    const nextIndex = (currentIndex + 1) % messages.length;
    messageIndexRef.current[category] = nextIndex;
    
    return messages[nextIndex];
  }, []);

  // Update BJÖRK state with cooldown
  const updateBjorkState = useCallback((category: BjorkMessageCategory, forceEmotion?: BjorkEmotion) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime.current;

    // Check cooldown
    if (timeSinceLastUpdate < MESSAGE_COOLDOWN_MS) {
      return; // Skip update if within cooldown period
    }

    const newMessage = getMessageFromCategory(category);
    
    // Determine emotion based on category
    let emotion: BjorkEmotion = 'normal';
    if (forceEmotion) {
      emotion = forceEmotion;
    } else {
      emotion = category === 'sad_messages' ? 'sad' : 'normal';
    }

    setBjorkState({
      emotion,
      message: newMessage,
      category,
    });

    lastUpdateTime.current = now;
  }, [getMessageFromCategory]);

  // Convenience methods for triggering state changes
  const triggerPositiveAction = useCallback((customMessage?: string) => {
    if (customMessage) {
      setBjorkState({
        emotion: 'normal',
        message: customMessage,
        category: 'happy_messages',
      });
      lastUpdateTime.current = Date.now();
    } else {
      updateBjorkState('happy_messages', 'normal');
    }
  }, [updateBjorkState]);

  const triggerNegativeAction = useCallback((customMessage?: string) => {
    if (customMessage) {
      setBjorkState({
        emotion: 'sad',
        message: customMessage,
        category: 'sad_messages',
      });
      lastUpdateTime.current = Date.now();
    } else {
      updateBjorkState('sad_messages', 'sad');
    }
  }, [updateBjorkState]);

  const triggerNeutralAction = useCallback((customMessage?: string) => {
    if (customMessage) {
      setBjorkState({
        emotion: 'normal',
        message: customMessage,
        category: 'neutral_messages',
      });
      lastUpdateTime.current = Date.now();
    } else {
      updateBjorkState('neutral_messages', 'normal');
    }
  }, [updateBjorkState]);

  // Toggle between normal and sad emotions
  const toggleEmotion = useCallback(() => {
    const newEmotion: BjorkEmotion = bjorkState.emotion === 'normal' ? 'sad' : 'normal';
    const newCategory: BjorkMessageCategory = newEmotion === 'sad' ? 'sad_messages' : 'happy_messages';
    
    // Bypass cooldown for manual toggle
    const newMessage = getMessageFromCategory(newCategory);
    setBjorkState({
      emotion: newEmotion,
      message: newMessage,
      category: newCategory,
    });
    lastUpdateTime.current = Date.now();
  }, [bjorkState.emotion, getMessageFromCategory]);

  // Monitor app state and update BJÖRK automatically
  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check for emergency mode
        const emergencyMode = await AsyncStorage.getItem('@peso_emergency_mode_active');
        const recoveryPlan = await AsyncStorage.getItem('@peso_recovery_plan_active');

        if (emergencyMode === 'true' || recoveryPlan === 'true') {
          updateBjorkState('sad_messages', 'sad');
          return;
        }

        // Default to neutral if no specific state
        updateBjorkState('neutral_messages', 'normal');
      } catch (error) {
        console.error('Error checking app state for BJÖRK:', error);
      }
    };

    // Check state on mount
    checkAppState();

    // Set up periodic check (every 10 seconds)
    const interval = setInterval(checkAppState, 10000);

    return () => clearInterval(interval);
  }, [updateBjorkState]);

  return (
    <BjorkContext.Provider
      value={{
        bjorkState,
        updateBjorkState,
        triggerPositiveAction,
        triggerNegativeAction,
        triggerNeutralAction,
        toggleEmotion,
      }}
    >
      {children}
    </BjorkContext.Provider>
  );
};

export const useBjork = () => {
  const context = useContext(BjorkContext);
  if (!context) {
    throw new Error('useBjork must be used within BjorkProvider');
  }
  return context;
};
