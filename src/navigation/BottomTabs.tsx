import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, TrendingUp, AlertTriangle, Book, User } from 'lucide-react-native';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { SpendingScreen } from '../screens/Spending/SpendingScreen';
import { LeaksScreen } from '../screens/Leaks/LeaksScreen';
import { CoachScreen } from '../screens/Coach/CoachScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

const TAB_ACTIVE_COLOR = '#1A1A1A';
const TAB_INACTIVE_COLOR = '#1A1A1A';
const BADGE_COLOR = '#EDE9FF';

interface TabIconProps {
  isFocused: boolean;
  icon: React.ElementType;
}

const TabIcon = ({ isFocused, icon: Icon }: TabIconProps) => {
  const animValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const badgeScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const badgeOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.badge,
          {
            opacity: badgeOpacity,
            transform: [{ scale: badgeScale }],
          },
        ]}
      />
      <Animated.View
        style={{
          opacity,
          transform: [{ scale }],
        }}
      >
        <Icon
          size={24}
          color={TAB_ACTIVE_COLOR}
          strokeWidth={2.5}
        />
      </Animated.View>
    </View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  // Calculate padding bottom to be safe area + some spacing, or just safe area if it's large enough
  const paddingBottom = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.tabBar, { paddingBottom }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let IconComponent;
        switch (route.name) {
          case 'Home': IconComponent = Home; break;
          case 'Spending': IconComponent = TrendingUp; break;
          case 'Leaks': IconComponent = AlertTriangle; break;
          case 'Coach': IconComponent = Book; break;
          case 'Profile': IconComponent = User; break;
          default: IconComponent = Home;
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            <TabIcon isFocused={isFocused} icon={IconComponent} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Spending" component={SpendingScreen} />
      <Tab.Screen name="Leaks" component={LeaksScreen} />
      <Tab.Screen name="Coach" component={CoachScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: BADGE_COLOR,
  },
});
