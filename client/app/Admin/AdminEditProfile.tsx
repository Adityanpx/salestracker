import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAdminProfile, getAdminProfile } from "../../../salestracker-main User apk 2/lib/api";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

const AdminProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("identicon");
  const [seed, setSeed] = useState("admin123");
  const [avatar, setAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // fetch profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const profile = await getAdminProfile(token);
        setName(profile.name || "");
        setEmail(profile.email || "");
        setAvatar(profile.avatar || `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`);
      } catch (err) {
        console.error("Failed to load profile:", err);
        Alert.alert("Error", "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // update avatar when style/seed changes
  useEffect(() => {
    if (seed) {
      setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`);
    }
  }, [selectedStyle, seed]);

  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      const res = await updateAdminProfile({ name, avatar }, token);
      Alert.alert("Success", "Profile updated successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-yellow-200">
      <View className="p-4 items-center">
        {/* Avatar */}
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full bg-gray-400" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-400 justify-center items-center">
            <Text className="text-white text-2xl">👤</Text>
          </View>
        )}

        {/* Name + Edit Icon */}
        <View className="flex-row items-center mt-2">
          <Text className="text-lg font-bold mr-2">{name}</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Ionicons name="create-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <Text className="text-sm text-gray-600">{email}</Text>
      </View>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center px-4">
          <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
            {/* Avatar Preview */}
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full self-center mb-4" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-400 self-center justify-center items-center mb-4">
                <Text className="text-white text-2xl">👤</Text>
              </View>
            )}

            {/* Avatar Style Picker */}
            <Text className="mt-2 font-semibold text-gray-700">Select Avatar Style</Text>
            <View className="border border-gray-300 rounded-lg mt-2 mb-4 overflow-hidden">
              <Picker selectedValue={selectedStyle} onValueChange={(item) => setSelectedStyle(item)}>
                {AVATAR_STYLES.map((style) => (
                  <Picker.Item key={style} label={style} value={style} />
                ))}
              </Picker>
            </View>

            {/* Seed Input */}
            <Text className="font-semibold text-gray-700">Avatar Seed</Text>
            <TextInput
              value={seed}
              onChangeText={setSeed}
              placeholder="Enter seed"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-4"
            />

            {/* Name Input */}
            <Text className="font-semibold text-gray-700">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-6"
            />

            {/* Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => setShowModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg">
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile} className="px-6 py-2 bg-black rounded-lg">
                <Text className="text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AdminProfile;
