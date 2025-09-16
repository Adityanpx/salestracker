import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { login } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const data = await login(email, password);
      console.log("🔹 Login response:", data);

//       if (data.token) {
//         await AsyncStorage.setItem("token", data.token);
//         Alert.alert("Login Successful", `Welcome ${data.name || "User"}!`);
//         const savedToken = await AsyncStorage.getItem("token");
// console.log("🟢 Saved token after login:", savedToken);

if (data.token) {
  await AsyncStorage.removeItem("token");   // 🔹 clear old token first
  await AsyncStorage.setItem("token", data.token); // 🔹 save fresh admin token
  Alert.alert("Login Successful", `Welcome ${data.name || "User"}!`);
  const savedToken = await AsyncStorage.getItem("token");
  console.log("🟢 Saved token after login:", savedToken);
        if (data.role === "admin") {
          router.replace("/Admin/(tabs)/home");
        } else {
          router.replace("/User/(tabs)/home");
        }
      }
    } catch (error: unknown) {
      console.log("❌ Login error:", error);

      // If it's a fetch/axios error, log the response
      if (error instanceof Error) {
        console.log("Error message:", error.message);
      }
      Alert.alert(
        "Login Failed",
        "Could not connect to server. Make sure your backend is running and your IP is correct."
      );
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="items-center mt-8">
        <Image
          source={require("../assets/images/1fbef6d60f27e33dbc6815848528bc306351b952.png")}
          className="w-40 h-20"
          resizeMode="contain"
        />
      </View>

      <Text className="text-2xl font-bold text-center mt-6 text-black">
        Login With Us!
      </Text>

      <View className="mt-8 space-y-4">
        <TextInput
          placeholder="Email *"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />
        <TextInput
          placeholder="Password *"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black py-3 rounded-2xl mt-6"
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-600 mt-4">
        Don’t Have An Account?{" "}
        <Link href="/register" className="font-semibold text-black">
          Register
        </Link>
      </Text>
    </View>
  );
}
