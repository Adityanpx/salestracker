import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function NewJourneyScreen() {
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  // Mock coordinates
  const start = { latitude: 18.5204, longitude: 73.8567 };
  const end = { latitude: 18.5380, longitude: 73.8850 };

  const handleStartJourney = () => {
    // Normally you would navigate to JourneyMap, but for now just alert
    alert(`Journey started!\nStart: ${start.latitude}, ${start.longitude}\nEnd: ${end.latitude}, ${end.longitude}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => alert("Go Back")}>
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Journey</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Locations */}
        <View style={styles.locationRow}>
          <View style={styles.inputWithIcon}>
            <Ionicons name="compass" size={18} color="#222" style={{ marginRight: 10 }} />
            <TouchableOpacity style={{ flex: 1 }}>
              <Text style={styles.placeholder}>Choose Start Location</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputWithIcon, { marginTop: 14 }]}>
            <Ionicons name="location" size={18} color="#222" style={{ marginRight: 10 }} />
            <TouchableOpacity style={{ flex: 1 }}>
              <Text style={styles.placeholder}>Choose End Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Journey Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Journey Details</Text>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>Purpose *</Text>
            <TextInput
              placeholder="e.g., Site Visit, meeting,..."
              placeholderTextColor="#999"
              value={purpose}
              onChangeText={setPurpose}
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Notes</Text>
            <TextInput
              placeholder="Add notes (optional)"
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              multiline
            />
          </View>

          <View style={{ marginTop: 18 }}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleStartJourney}>
              <Link href="/User/(tabs)/home">
              <Text style={styles.primaryButtonText}>Start Journey</Text>
              </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ghostButton} onPress={() => alert("Cancelled")}>
              <Link href="/User/(tabs)/home">
              <Text style={styles.ghostButtonText}>Cancel</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f2f0" },
  header: {
    backgroundColor: "#F7DF6E",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  container: { padding: 16 },
  locationRow: { marginTop: 10 },
  inputWithIcon: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 4,
  },
  placeholder: { color: "#222", fontSize: 14 },
  card: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontWeight: "700", fontSize: 16, color: "#222" },
  label: { marginBottom: 8, color: "#444" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700" },
  ghostButton: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
    paddingVertical: 12,
    alignItems: "center",
  },
  ghostButtonText: { color: "#222", fontWeight: "700" },
});
