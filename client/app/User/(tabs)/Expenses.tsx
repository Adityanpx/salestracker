// screens/user/Expenses.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getApprovals } from "../../../lib/api";

interface Expense {
  _id: string;
  purpose?: string;
  amount: number;
  status: "pending" | "approved" | "denied";
  submittedAt: string;
  member?: { name?: string; email?: string } | null;
  expenseType?: string; // renamed to match admin field
}

const Expenses = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const tabs = ["All", "Pending", "Approved", "Rejected"];

  // ================= Fetch Expenses =================
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      // fetch approvals for this user (not admin)
      const data = await getApprovals(token, undefined, false);
      console.log("Fetched user approvals:", data);

      setExpenses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching expenses:", err);
      Alert.alert("Error", err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ================= Filter by active tab =================
  const filteredExpenses = expenses.filter((exp) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return exp.status === "pending";
    if (activeTab === "Approved") return exp.status === "approved";
    if (activeTab === "Rejected") return exp.status === "denied";
    return true;
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FFD700" />
        <Text className="mt-2 text-gray-600">Loading expenses...</Text>
      </View>
    );
  }

  // ================= Render single expense =================
  const renderExpense = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      className="bg-white p-4 mb-4 rounded-2xl shadow-md active:opacity-90"
      onPress={() => router.push(`/User/expensedetails?id=${item._id}`)}
    >
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-xs text-blue-600 font-medium uppercase">
            {item.expenseType || "Expense"}
          </Text>
          <Text className="text-base font-bold text-gray-800 mt-1">
            {item.purpose || item.expenseType}
          </Text>
          {item.member && (
            <Text className="text-gray-500 text-xs mt-1">
              By: {item.member.name || item.member.email}
            </Text>
          )}
        </View>
        <Text className="text-base font-bold text-gray-800">₹{item.amount}</Text>
      </View>

      <Text className="text-sm text-gray-600 mt-2">
        {new Date(item.submittedAt).toLocaleDateString()}
      </Text>

      <View className="mt-3">
        <Text
          className={`text-sm font-semibold ${
            item.status === "pending"
              ? "text-yellow-600"
              : item.status === "approved"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-yellow-300 px-4 py-5 flex-row items-center justify-between shadow-md rounded-b-3xl">
        <Text className="text-lg font-bold">Expenses</Text>
      </View>

      {/* Tabs */}
      <FlatList
        data={tabs}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, marginTop: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveTab(item as any)}
            className={`mx-1 rounded-full items-center justify-center ${
              activeTab === item ? "bg-yellow-300" : "bg-white"
            }`}
            style={{ minWidth: 90, height: 40 }}
          >
            <Text
              className={`text-sm font-medium ${
                activeTab === item ? "text-black" : "text-gray-600"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Expenses List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item._id}
        renderItem={renderExpense}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={true}
        className="mt-4"
      />
    </View>
  );
};

export default Expenses;
