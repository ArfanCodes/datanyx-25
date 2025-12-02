import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function App() {
  useEffect(() => {
    // When a notification comes in
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const title = notification.request.content.title || "";
        const body = notification.request.content.body || "";

        // Parse UPI SMS format
        const parsed = parseUPI(body);
        if (parsed) {
          console.log("💰 Parsed Transaction:", parsed);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>SMS Parsing via Notifications Active</Text>
    </View>
  );
}

// 📌 Very simple UPI SMS parser
function parseUPI(text: string) {
  const amountRegex = /(?:Rs\.?|INR)\s?([\d,]+\.\d{2})/i;
  const upiIdRegex = /(upi|vpa)[:\s]*([\w@.-]+)/i;

  const amountMatch = text.match(amountRegex);
  const upiMatch = text.match(upiIdRegex);

  if (!amountMatch) return null;

  return {
    amount: amountMatch[1].replace(",", ""),
    upiId: upiMatch ? upiMatch[2] : null,
    raw: text,
    time: Date.now(),
  };
}
