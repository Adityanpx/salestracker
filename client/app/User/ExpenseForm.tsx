// ExpenseForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type ReceiptFile = {
  uri: string;
  name: string;
  type: string;
};

const ExpenseForm = () => {
  const [selectedType, setSelectedType] = useState("Fuel");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receiptFile, setReceiptFile] = useState<ReceiptFile | null>(null);

  const expenseTypes = ["Fuel", "Accomodation", "Food", "Parking", "Miscellaneous"];
  const router = useRouter();

  // 📂 Pick file
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setReceiptFile({
        uri: file.uri,
        name: file.name ?? "receipt",
        type: file.mimeType ?? "application/octet-stream",
      });
    }
  };

  // 📤 Save expense
const handleSave = async () => {
  if (!amount || !selectedType || !receiptFile) {
    Alert.alert("Error", "Please fill all required fields and upload a bill.");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return Alert.alert("Unauthorized", "Please login again.");

    const formData = new FormData();
    formData.append("expenseType", selectedType.toLowerCase());
    formData.append("amount", amount);
    formData.append("description", description);

    const fileToUpload =
      Platform.OS === "web"
        ? new File([await (await fetch(receiptFile.uri)).blob()], receiptFile.name, { type: receiptFile.type })
        : { uri: receiptFile.uri, name: receiptFile.name, type: receiptFile.type };

    formData.append("receipt", fileToUpload as any);

    const res = await fetch("http://192.168.1.109:5000/api/approvals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // only this header
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to save expense");
    }

    const data = await res.json();
    Alert.alert("Success", "Expense submitted for approval!");
    router.push("/User/pendingscreen");
  } catch (err: any) {
    console.error(err);
    Alert.alert("Error", err.message || "Something went wrong");
  }
};



  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-yellow-300 px-4 py-5 flex-row items-center shadow-md rounded-b-3xl">
        <Ionicons name="arrow-back-outline" size={24} color="black" />
        <Text className="ml-3 text-lg font-bold">Add Expense Details</Text>
      </View>

      <ScrollView className="p-4">
        {/* Expense Type */}
        <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
          <Text className="font-semibold text-base mb-2">
            Expense Type <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {expenseTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg border shadow-sm ${
                  selectedType === type
                    ? "bg-yellow-300 border-yellow-400"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedType === type ? "text-black" : "text-gray-700"
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount */}
        <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
          <Text className="font-semibold text-base mb-2">
            Amount <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="Rs. 20"
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Description */}
        <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
          <Text className="font-semibold text-base mb-2">Description</Text>
          <TextInput
            placeholder="Enter description"
            multiline
            numberOfLines={3}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Add Bills */}
        <View className="bg-white p-4 rounded-2xl shadow-md mb-4 items-center justify-center">
          <Text className="font-semibold text-base mb-2">
            Add Bills <Text className="text-red-500">*</Text>
          </Text>
          <TouchableOpacity
            onPress={pickFile}
            className="border border-gray-300 rounded-xl w-full h-28 flex items-center justify-center"
          >
            <Ionicons name="document-text-outline" size={28} color="black" />
            {receiptFile && (
              <Text className="mt-2 text-sm text-gray-600">
                Selected: {receiptFile.name}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Save & Cancel */}
        <TouchableOpacity
          className="bg-gray-900 py-3 rounded-xl mb-3 shadow-md"
          onPress={handleSave}
        >
          <Text className="text-center text-white font-semibold text-base">
            Save
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-gray-400 py-3 rounded-xl shadow-sm"
          onPress={() => router.back()}
        >
          <Text className="text-center text-gray-800 font-semibold text-base">
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ExpenseForm;
