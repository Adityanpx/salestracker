import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { getUserProfile, updateUserProfile } from "../../../lib/api";

const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

const EditProfileUser = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("identicon");
  const [seed, setSeed] = useState("user123");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Unauthorized", "Please login again.");
          setLoading(false);
          return;
        }

        const data = await getUserProfile(token);
        setName(data.name || "");
        setEmail(data.email || "");
        setSelectedStyle(data.style || "identicon");
        setSeed(data.seed || "user123");
        setAvatar(
          data.avatar ||
            `https://api.dicebear.com/7.x/${data.style || "identicon"}/svg?seed=${data.seed || "user123"}`
        );
      } catch (err: unknown) {
        console.error("Failed to load profile:", err);
        Alert.alert("Error", err instanceof Error ? err.message : "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Update avatar preview dynamically
  useEffect(() => {
    setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`);
  }, [selectedStyle, seed]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("Unauthorized", "Please login again.");

      await updateUserProfile({ name, avatar, style: selectedStyle, seed }, token);
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4" contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View className="bg-yellow-300 px-4 py-5 flex-row items-center justify-center shadow-md rounded-b-3xl mb-6">
        <Text className="text-lg font-bold text-gray-800">Edit Profile</Text>
      </View>

      {/* Avatar */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: avatar }}
          className="w-32 h-32 rounded-full bg-gray-300 border-2 border-gray-400"
        />
      </View>

      {/* Name */}
      <Text className="font-semibold text-gray-700 mb-1">Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-white text-gray-800"
      />

      {/* Email (read-only) */}
      <Text className="font-semibold text-gray-700 mb-1">Email</Text>
      <TextInput
        value={email}
        editable={false}
        className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-200 text-gray-600"
      />

      {/* Avatar Style */}
      <Text className="font-semibold text-gray-700 mb-1">Avatar Style</Text>
      <View className="border border-gray-300 rounded-lg mb-4 overflow-hidden bg-white">
        <Picker selectedValue={selectedStyle} onValueChange={setSelectedStyle}>
          {AVATAR_STYLES.map((style) => (
            <Picker.Item key={style} label={style} value={style} />
          ))}
        </Picker>
      </View>

      {/* Avatar Seed */}
      <Text className="font-semibold text-gray-700 mb-1">Avatar Seed</Text>
      <TextInput
        value={seed}
        onChangeText={setSeed}
        placeholder="Enter seed"
        className="border border-gray-300 rounded-lg px-3 py-2 mb-6 bg-white text-gray-800"
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        className={`bg-black py-3 rounded-lg items-center ${saving ? "opacity-50" : ""}`}
      >
        <Text className="text-white font-bold">{saving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileUser;
