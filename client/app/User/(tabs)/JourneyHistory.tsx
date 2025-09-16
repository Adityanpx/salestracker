// JourneyHistory.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const JourneyHistory = () => {
  const journeys = [
    {
      id: 1,
      purpose: "Client Meeting",
      date: "4th September 2025",
      distance: "20 km",
      start: "Office",
      end: "Client Site",
    },
    {
      id: 2,
      purpose: "Product Delivery",
      date: "5th September 2025",
      distance: "15 km",
      start: "Warehouse",
      end: "Retail Store",
    },
    {
      id: 3,
      purpose: "Site Visit",
      date: "6th September 2025",
      distance: "30 km",
      start: "Office",
      end: "Construction Site",
    },
    {
      id: 4,
      purpose: "Training Session",
      date: "7th September 2025",
      distance: "10 km",
      start: "Home",
      end: "Training Center",
    },
  ];
  
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-yellow-300 px-4 py-5 flex-row items-center justify-between shadow-md rounded-b-3xl">
        <Text className="text-lg font-bold">Your Journeys</Text>
        <TouchableOpacity onPress={() => router.push("/User/newjourney")}>
          <Ionicons name="add-circle" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Journey Cards */}
      <ScrollView className="p-4">
        {journeys.map((journey) => (
          <View
            key={journey.id}
            className="bg-white p-4 mb-4 rounded-2xl shadow-md"
          >
            {/* Card Header */}
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-base">{journey.purpose}</Text>
              <TouchableOpacity
                className="bg-blue-600 px-3 py-1 rounded-lg"
                onPress={() => router.push("/User/journeydetails")}
              >
                <Text className="text-white text-xs font-medium">View Details</Text>
              </TouchableOpacity>
            </View>

            {/* Date & Distance */}
            <View className="mt-2 flex-row justify-between">
              <Text className="text-sm text-gray-600">{journey.date}</Text>
              <Text className="text-sm text-gray-600">{journey.distance}</Text>
            </View>

            {/* Locations */}
            <View className="mt-3 space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#3b82f6" />
                <Text className="ml-2 text-sm font-medium">{journey.start}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#ef4444" />
                <Text className="ml-2 text-sm font-medium">{journey.end}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default JourneyHistory;