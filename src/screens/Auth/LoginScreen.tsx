import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { useAuthStore } from '../../store/authStore';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigation will be handled automatically by AppNavigator
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    console.log('Google Sign-In clicked');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Wallet size={40} color={colors.buttonGreen} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to Peso</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#9A9A9A"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9A9A9A"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Google Sign-In Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* App Version Footer */}
          <Text style={styles.versionText}>Manage your money with clarity ✨</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B6B6B',
  },
  form: {
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 52,
  },
  errorText: {
    color: '#E53935',
    fontSize: 14,
    marginBottom: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  signInButton: {
    backgroundColor: colors.buttonGreen,
    borderRadius: 32,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.buttonGreen,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: colors.white,
    borderRadius: 32,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    gap: 12,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerText: {
    fontSize: 15,
    color: '#6B6B6B',
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.buttonGreen,
  },
  versionText: {
    fontSize: 12,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 24,
  },
});
