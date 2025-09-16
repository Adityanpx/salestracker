import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getBalance, addBalance, getMemberProfile } from "../../lib/api";

// Define the Member type
type Member = {
  _id: string;
  name: string;
  email: string;
  status: string;
  role?: string;
};

export default function MemberProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.log("⚠️ No member ID provided in params");
        return;
      }

      try {
        console.log("🚀 Fetching profile for member ID:", id);

        // Fetch member profile
        const memberData: Member = await getMemberProfile(id);
        console.log("📄 Member profile fetched:", memberData);
        setMember(memberData);

        // Fetch balance
        const bal = await getBalance(id);
        console.log("💰 Balance fetched:", bal);
        setBalance(bal.amount ?? 0);
      } catch (err: unknown) {
        console.log("❌ Failed to fetch member profile or balance:", err);
        Alert.alert("Error", "Failed to fetch member profile");
      }
    };

    fetchData();
  }, [id]);

  const handleAddBalance = async () => {
    if (!amount) return Alert.alert("Error", "Enter an amount");

    try {
      setLoading(true);
      console.log(`💵 Adding balance: Rs. ${amount} to member ID: ${id}`);

      const res = await addBalance(id!, Number(amount));
      console.log("🔄 addBalance API response:", res);

      if (res.balance !== undefined) {
        setBalance(res.balance);
        Alert.alert("✅ Success", `Balance updated: Rs. ${res.balance}`);
        console.log(`✅ Balance successfully updated to Rs. ${res.balance}`);
        setAmount("");
        setModalVisible(false);
      } else {
        console.log("❌ Failed to update balance, API returned:", res);
        Alert.alert("❌ Error", res.message || "Failed to update balance");
      }
    } catch (err) {
      console.log("❌ addBalance error:", err);
      Alert.alert("❌ Error", "Something went wrong");
    } finally {
      setLoading(false);
      console.log("⏹ Finished handleAddBalance, loading set to false");
    }
  };

  if (!member) {
    console.log("⌛ Member data not loaded yet, showing loading...");
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-yellow-300 items-center py-6 rounded-b-xl">
        <View className="w-20 h-20 rounded-full bg-black mb-3" />
        <Text className="text-lg font-bold">{member.name}</Text>
        <Text className="text-gray-600">{member.email}</Text>
        <Text className="text-green-600 font-semibold capitalize">{member.status}</Text>
      </View>

      {/* Balance + Add */}
      <View className="flex-row justify-between mx-4 mt-4">
        <View className="flex-1 bg-white rounded-lg shadow p-3 mr-2">
          <Text className="text-gray-600">Current Balance:</Text>
          <Text className="font-bold mt-1">Rs. {balance}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log("🟡 Open Add Balance modal");
            setModalVisible(true);
          }}
          className="bg-yellow-300 rounded-lg px-5 justify-center items-center"
        >
          <Text className="font-semibold">+ Add Balance</Text>
        </TouchableOpacity>
      </View>

      {/* Journeys (Example placeholders) */}
      <Text className="text-base font-bold mx-4 mt-6 mb-3">Journeys</Text>
      {[1, 2].map((_, i) => (
        <View
          key={i}
          className="flex-row justify-between bg-white shadow rounded-lg mx-4 mb-4 p-3"
        >
          <View className="flex-1">
            <Text className="font-bold mb-1">Purpose</Text>
            <Text className="text-gray-500 mb-0.5">4th September 2025</Text>
            <Text className="text-gray-500 mb-2">20 km</Text>
            <Text className="text-gray-700">📍 Start Location</Text>
            <Text className="text-gray-700">🏁 End Location</Text>
          </View>
          <TouchableOpacity className="bg-black rounded px-3 py-2 self-center">
            <Text className="text-white font-semibold text-sm">View Details</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Modal for Enter Amount */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          console.log("❌ Modal closed without adding balance");
          setModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-4/5 p-6 shadow-lg">
            <Text className="text-lg font-bold mb-4 text-center">Enter Amount</Text>
            <TextInput
              placeholder="Enter amount"
              value={amount}
              onChangeText={(text) => {
                console.log("✏️ Amount input changed:", text);
                setAmount(text);
              }}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => {
                  console.log("❌ Cancel Add Balance clicked");
                  setModalVisible(false);
                }}
                className="bg-gray-300 rounded-lg px-4 py-2"
              >
                <Text className="font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddBalance}
                disabled={loading}
                className="bg-yellow-300 rounded-lg px-4 py-2"
              >
                <Text className="font-semibold">{loading ? "..." : "Add"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
