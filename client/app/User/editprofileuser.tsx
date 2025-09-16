// EditProfileUser.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function EditProfileUser() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Keith Rabois");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="bg-[#FBD971] flex-row items-center px-4 py-3">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text className="ml-3 font-bold text-lg text-black">Edit Profile</Text>
      </View>

      {/* Form */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-5 py-6"
      >
        {/* Name Input */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          className="border border-yellow-400 rounded-md px-4 py-3 mb-5 text-black"
          placeholderTextColor="#999"
        />

        {/* Old Password */}
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Old Password"
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-black"
          placeholderTextColor="#999"
        />

        {/* New Password */}
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-black"
          placeholderTextColor="#999"
        />

        {/* Confirm Password */}
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 mb-8 text-black"
          placeholderTextColor="#999"
        />

        {/* Save Button */}
        <TouchableOpacity className="bg-[#1A1E27] rounded-lg py-4 mb-4 shadow-md shadow-black/30">
        <Link href="/User/(tabs)/profile">
          <Text className="text-center text-white font-bold text-base">
            Save
          </Text>
          </Link>
        </TouchableOpacity>

        {/* Cancel Button */}
        <Link href="/User/(tabs)/profile">

        <TouchableOpacity className="border border-gray-400 rounded-lg py-4 shadow-sm">
          <Text className="text-center text-black font-semibold text-base">
            Cancel
          </Text>
        </TouchableOpacity>
        </Link>
        
      </ScrollView>
    </View>
  );
}