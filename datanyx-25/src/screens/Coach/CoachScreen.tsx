import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, Smile, Frown, PartyPopper, AlertCircle } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { spacing } from '../../theme/spacing';
import { useCoachStore, ChatMessage, MascotEmotion } from '../../store/coachStore';

// Mascot Component
const Mascot = ({ emotion }: { emotion: MascotEmotion }) => {
  const getMascotConfig = () => {
    switch (emotion) {
      case 'happy':
        return { icon: <Smile size={40} color={colors.white} />, color: colors.buttonGreen, label: 'Happy' };
      case 'worried':
        return { icon: <Frown size={40} color={colors.white} />, color: colors.crisis, label: 'Worried' };
      case 'celebrate':
        return { icon: <PartyPopper size={40} color={colors.white} />, color: colors.growth, label: 'Celebrate' };
      case 'guiding':
      default:
        return { icon: <Bot size={40} color={colors.white} />, color: colors.buttonGreen, label: 'Guiding' };
    }
  };

  const config = getMascotConfig();

  return (
    <View style={[styles.mascotContainer, { backgroundColor: config.color }]}>
      {config.icon}
      <View style={styles.mascotBadge}>
        <Text style={styles.mascotBadgeText}>{config.label}</Text>
      </View>
    </View>
  );
};

// Chat Bubble Component
const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.sender === 'user';
  return (
    <View style={[styles.bubbleContainer, isUser ? styles.userBubbleContainer : styles.botBubbleContainer]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <Bot size={20} color={colors.white} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

export const CoachScreen = () => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, error, mascotEmotion, sendMessage } = useCoachStore();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    await sendMessage(text);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Money Coach</Text>
            <Text style={styles.subtitle}>Ask me anything about your finances</Text>
          </View>
          <Mascot emotion={mascotEmotion} />
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                👋 Hi! I'm your AI Money Coach.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Try asking: "How do I save more this month?"
              </Text>
            </View>
          }
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={colors.textLight} />
                  <Text style={styles.typingText}>Coach is thinking...</Text>
                </View>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color={colors.crisis} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null
          }
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your question..."
            placeholderTextColor={colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  mascotContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    position: 'relative',
  },
  mascotBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: colors.textDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mascotBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  chatContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  bubbleContainer: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userBubbleContainer: {
    justifyContent: 'flex-end',
  },
  botBubbleContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.buttonGreen,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.buttonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
  },
  botMessageText: {
    color: colors.textDark,
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginLeft: 40,
    marginBottom: spacing.md,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  typingText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.crisis,
    marginLeft: 8,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    opacity: 0.6,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: Platform.OS === 'ios' ? 100 : 90, // Increased padding to clear bottom tab bar
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textDark,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.buttonGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
});