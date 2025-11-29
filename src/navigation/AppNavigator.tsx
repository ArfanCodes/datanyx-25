import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabs } from './BottomTabs';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { SignupScreen } from '../screens/Auth/SignupScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetup/ProfileSetupScreen';
import { EmergencyModeScreen } from '../screens/Emergency/EmergencyModeScreen';
import { colors } from '../utils/colors';
import { useAuthStore } from '../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();

// Auth Navigator (Login/Signup)
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Onboarding Navigator (Profile Setup)
const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <OnboardingStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </OnboardingStack.Navigator>
  );
};

// App Navigator (Main App with Bottom Tabs)
const MainNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <AppStack.Screen name="Main" component={BottomTabs} />
      <AppStack.Screen
        name="EmergencyMode"
        component={EmergencyModeScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Emergency Mode',
          headerTintColor: colors.crisis,
        }}
      />
    </AppStack.Navigator>
  );
};

// Splash/Loading Screen
const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashTitle}>Peso</Text>
      <ActivityIndicator size="large" color={colors.buttonGreen} style={styles.splashLoader} />
    </View>
  );
};

// Root Navigator with Auth Check
export const AppNavigator = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const checkProfileSetup = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const profileComplete = await AsyncStorage.getItem('@peso_profile_setup_complete');
          setHasCompletedProfile(profileComplete === 'true');
        } catch (error) {
          console.error('Failed to check profile setup:', error);
          setHasCompletedProfile(false);
        } finally {
          setIsCheckingProfile(false);
        }
      } else {
        setIsCheckingProfile(false);
      }
    };

    checkProfileSetup();
  }, [isAuthenticated, isLoading]);

  // Listen for profile setup completion
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isAuthenticated && !hasCompletedProfile) {
        try {
          const profileComplete = await AsyncStorage.getItem('@peso_profile_setup_complete');
          if (profileComplete === 'true') {
            setHasCompletedProfile(true);
          }
        } catch (error) {
          console.error('Failed to check profile setup:', error);
        }
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, [isAuthenticated, hasCompletedProfile]);

  // Show splash while loading auth or profile status
  if (isLoading || isCheckingProfile) {
    return (
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : !hasCompletedProfile ? (
        <OnboardingNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.buttonGreen,
    marginBottom: 24,
  },
  splashLoader: {
    marginTop: 16,
  },
});
