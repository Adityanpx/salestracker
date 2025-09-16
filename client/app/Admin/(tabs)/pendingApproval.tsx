// screens/admin/AdminApprovals.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApprovals, updateApprovalStatus, bulkUpdateApprovals } from "../../../lib/api";

interface Approval {
  _id: string;
  expenseType: string;
  amount: number;
  description?: string;
  status: "pending" | "approved" | "denied";
  submittedAt: string;
  member?: { name?: string; email?: string } | null;
}

const AdminApprovals = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ================= Fetch Approvals =================
  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const data = await getApprovals(token, "pending", true); // Admin fetch
      console.log("Fetched approvals:", data);
      setApprovals(data); // data is array of approvals
      setSelectedIds([]);
    } catch (err: any) {
      console.error("Error fetching approvals:", err);
      Alert.alert("Error", err.message || "Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  // ================= Approve / Deny single approval =================
  const handleApproveDeny = async (id: string, status: "approved" | "denied") => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await updateApprovalStatus(token, id, status);
      Alert.alert(`✅ ${status} successfully`);
      setSelectedIds([]);
      fetchApprovals();
    } catch (err: any) {
      console.error("Approve/Deny failed:", err);
      Alert.alert("Error", err.message || `Failed to ${status}`);
    }
  };

  // ================= Bulk Approve / Deny =================
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async (status: "approved" | "denied") => {
    if (selectedIds.length === 0) return Alert.alert("Select at least one approval");
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await bulkUpdateApprovals(selectedIds, status, token);
      Alert.alert(`✅ Bulk ${status}`);
      fetchApprovals();
    } catch (err: any) {
      console.error("Bulk update error:", err);
      Alert.alert("Error", err.message || "Failed to bulk update");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <View className="flex-row justify-center mb-2 space-x-4 mt-4">
          <TouchableOpacity
            onPress={() => handleBulkUpdate("approved")}
            className="bg-green-500 px-4 py-2 rounded"
          >
            <Text className="text-white font-semibold">Bulk Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBulkUpdate("denied")}
            className="bg-red-500 px-4 py-2 rounded"
          >
            <Text className="text-white font-semibold">Bulk Deny</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="p-4">
        {approvals.length === 0 ? (
          <Text className="text-center mt-10 text-gray-500">No pending approvals</Text>
        ) : (
          approvals.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => toggleSelect(item._id)}
              className={`bg-white p-4 mb-4 rounded-xl shadow-md ${
                selectedIds.includes(item._id) ? "border-2 border-blue-500" : ""
              }`}
            >
              <Text className="font-bold text-gray-800">{item.expenseType}</Text>
              <Text className="text-gray-500">
                By: {item.member?.name || item.member?.email || "Unknown"}
              </Text>
              <Text className="text-gray-700 mt-1">₹{item.amount}</Text>
              {item.description && <Text className="text-gray-600">{item.description}</Text>}
              <Text className="text-gray-500 mt-1">
                {new Date(item.submittedAt).toLocaleDateString()}
              </Text>

              <View className="flex-row mt-3 space-x-3">
                <TouchableOpacity
                  onPress={() => handleApproveDeny(item._id, "approved")}
                  className="bg-green-500 px-4 py-2 rounded"
                >
                  <Text className="text-white font-semibold">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleApproveDeny(item._id, "denied")}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  <Text className="text-white font-semibold">Deny</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default AdminApprovals;
