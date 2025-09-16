import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { memberRegister } from "../lib/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteToken, setInviteToken] = useState(""); // renamed for clarity
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !inviteToken) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      // Call backend API
      const data = await memberRegister(name, email, password, inviteToken);

      console.log("🔹 Register response:", data);

      if (data.message === "Registration completed" || data.success) {
        Alert.alert("Success", "Account activated! Please login.");
        router.replace("/login"); // replace so back button doesn’t return to register
      } else {
        Alert.alert("Failed", data.message || "Registration failed");
      }
    } catch (e) {
      console.log("Register error:", e);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Logo */}
      <View className="items-center mt-8">
        <Image
          source={require("../assets/images/1fbef6d60f27e33dbc6815848528bc306351b952.png")}
          className="w-40 h-10"
          resizeMode="contain"
        />
      </View>

      <Text className="text-2xl font-bold text-center mt-6 text-black">
        Register With Us!
      </Text>

      {/* Form */}
      <View className="mt-8 space-y-4">
        <TextInput
          placeholder="Full Name *"
          value={name}
          onChangeText={setName}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />
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
        <TextInput
          placeholder="Invite Token *"
          value={inviteToken}
          onChangeText={setInviteToken}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        className="bg-black py-3 rounded-2xl mt-6"
      >
        <Text className="text-white text-center font-semibold">Register</Text>
      </TouchableOpacity>

      {/* Already User */}
      <Text className="text-center text-gray-600 mt-4">
        Already A User?{" "}
        <Link href="/login" className="font-semibold text-black">
          Log In
        </Link>
      </Text>
    </View>
  );
}
