// // lib/api.js
// export const API_BASE = "http://192.168.1.4:5000/api";

// // ===== Admin =====
// export async function adminRegister(name, email, password) {
//   const res = await fetch(`${API_BASE}/admin/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, password }),
//   });
//   return res.json();
// }

// export async function adminLogin(email, password) {
//   const res = await fetch(`${API_BASE}/admin/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   return res.json();
// }

// export async function addMember(email, password, type, token) {
//   const res = await fetch(`${API_BASE}/admin/members/add`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ email, password, type }),
//   });
//   const data = await res.json();
//   return { ok: res.ok, data };
// }
// export async function getAdminProfile(token) {
//   const res = await fetch(`${API_BASE}/admin/profile`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch admin profile");
//   return res.json(); // { id, name, email, avatar }
// }


// export async function getMembers(token) {
//   const res = await fetch(`${API_BASE}/admin/members`, {
//     method: "GET",
//     headers: { 
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}` 
//     },
//   });
//   if (!res.ok) throw new Error("Failed to fetch members");
//   return res.json();
// }


// // ===== Member =====
// export async function memberRegister(email, password, token, name) {
//   const res = await fetch(`${API_BASE}/member/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password, token, name }),
//   });
//   return res.json();
// }

// export async function memberLogin(email, password) {
//   const res = await fetch(`${API_BASE}/member/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   return res.json();
// }

// // ===== Approvals =====
// export async function getApprovals(token, status) {
//   const query = status ? `?status=${status}` : "";
//   const res = await fetch(`${API_BASE}/approvals${query}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error("Failed to fetch approvals");
//   const json = await res.json();
//   return json.approvals || [];
// }

// export async function getPendingApprovals(token) {
//   try {
//     const res = await fetch(`${API_BASE}/approvals?status=pending`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(text || "Failed to fetch pending approvals");
//     }

//     const json = await res.json();
//     // Ensure approvals is always an array
//     return Array.isArray(json.approvals) ? json.approvals : [];
//   } catch (err) {
//     console.error("getPendingApprovals error:", err);
//     return [];
//   }
// }




// export async function approveApproval(token, id) {
//   const res = await fetch(`${API_BASE}/approvals/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ status: "approved" }),
//   });
//   if (!res.ok) throw new Error("Failed to approve approval");
//   return res.json();
// }

// export async function denyApproval(token, id) {
//   const res = await fetch(`${API_BASE}/approvals/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ status: "denied" }),
//   });
//   if (!res.ok) throw new Error("Failed to deny approval");
//   return res.json();
// }


// export async function bulkDeny(ids, token) {
//   const res = await fetch(`${API_BASE}/approvals/bulk`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ ids, status: "denied" }),
//   });
//   if (!res.ok) throw new Error("Failed to bulk deny");
//   return res.json();
// }

// export async function bulkApprove(ids, token) {
//   const res = await fetch(`${API_BASE}/approvals/bulk`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ ids }),
//   });
//   if (!res.ok) throw new Error("Failed to bulk approve");
//   return res.json();
// }


// // ===== Balance =====
// export async function addBalance(memberId, amount, token) {
//   console.log("➡️ Sending addBalance:", { memberId, amount, token });
//   const res = await fetch(`${API_BASE}/balance/${memberId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`, // must be REAL token
//     },
//     body: JSON.stringify({ amount }),
//   });

//   const data = await res.json().catch(() => ({}));
//   console.log("⬅️ Response addBalance:", res.status, data);

//   if (!res.ok) throw new Error(data.message || "Failed to add balance");
//   return data;
// }

// export async function getBalance(memberId, token) {
//   console.log("➡️ Fetching balance:", { memberId, token });
//   const res = await fetch(`${API_BASE}/balance/${memberId}`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   const data = await res.json().catch(() => ({}));
//   console.log("⬅️ Response getBalance:", res.status, data);

//   if (!res.ok) throw new Error(data.message || "Failed to fetch balance");
//   return data;
// }
// export async function updateAdminProfile(data, token) {
//   const res = await fetch(`${API_BASE}/admin/profile`, {
//     method: "PUT", // ✅ must match backend
//     headers: { 
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || "Failed to update profile");
//   }

//   return res.json();
// }
// // ===== Approvals =====
// export async function getDeniedApprovals(token) {
//   const res = await fetch(`${API_BASE}/approvals?status=denied`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch denied approvals");
//   const json = await res.json();
//   return json.approvals || [];
// }


// lib/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE = "http://192.168.1.4:5000/api";

// =======================
// Auth (common for all)
// =======================
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { token, member }
}

// =======================
// Superadmin & Admin
// =======================
export async function createAdmin(name, email, password, token) {
  const res = await fetch(`${API_BASE}/admin/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Failed to create admin");
  return res.json();
}

// =======================
// Member Auth
// =======================
export async function memberRegister(name, email, password, inviteToken) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, token: inviteToken }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json(); // { message: "Registration completed" }
}

export async function memberLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { token, name, role }
}

export async function getAdminProfile(token) {
  try {
    const res = await fetch("http://192.168.1.4:5000/api/admin/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to fetch admin profile");
    }

    const data = await res.json();
    return data; // { name, email, avatar, ... }
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    throw err;
  }
}

export async function updateAdminProfile(data, token) {
  const res = await fetch(`${API_BASE}/admin/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update admin profile");
  return res.json();
}


export const getMembers = async () => {
  const token = await AsyncStorage.getItem("token");
  const res = await fetch("http://192.168.1.4:5000/api/members", {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data; // <-- this is an array of members
};
export async function addMember(name, email, password, token) {
  const res = await fetch(`${API_BASE}/admin/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Failed to add member");
  return res.json();
}

// =======================
// Approvals
// =======================





// ===== Admin Approvals =====






// ✅ Get balance of a member
export async function getBalance(memberId) {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${API_BASE}/balance/${memberId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch balance: " + res.status);
    const data = await res.json();
    return data; // { amount: number }
  } catch (err) {
    console.log("getBalance error:", err);
    throw err;
  }
}

// Add balance
export async function addBalance(memberId, amount) {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${API_BASE}/balance/${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) throw new Error("Failed to add balance: " + res.status);
    const data = await res.json();
    return data; // { balance: number }
  } catch (err) {
    console.log("addBalance error:", err);
    throw err;
  }
}

export async function getUserProfile(token) {
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to fetch user profile");
    }

    const data = await res.json();
    return data; // { name, email, avatar, style, seed }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
}

export async function updateUserProfile(data, token) {
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // { name, avatar, style, seed }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to update user profile");
    }

    return res.json(); // updated profile object
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw err;
  }
}
export async function getMemberProfile(memberId) {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const res = await fetch(`${API_BASE}/members/${memberId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch member profile: " + res.status);
    const data = await res.json();
    console.log("Member profile fetched:", data);
    return data; // single member object
  } catch (err) {
    console.log("getMemberProfile error:", err);
    throw err;
  }
}

export async function createApproval(formData, token) {
  const res = await fetch(`${API_BASE}/approvals`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ================= Get Approvals =================
// User → GET /approvals
// Admin → GET /admin/approvals?status=pending
export async function getApprovals(token, status, isAdmin = false) {
  const query = status ? `?status=${status}` : "";
  const url = isAdmin
    ? `${API_BASE}/admin/approvals${query}`
    : `${API_BASE}/approvals${query}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();

  // ✅ Always return the array
  return data.approvals || [];
}
// ================= Approve/Deny Single (Admin) =================
export async function updateApprovalStatus(token, id, status) {
  try {
    const res = await fetch(`${API_BASE}/admin/approvals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("HTTP " + res.status + ": " + text);
    }

    return await res.json();
  } catch (err) {
    console.error("updateApprovalStatus failed:", err);
    throw err;
  }
}

// ================= Bulk Update (Admin) =================
export async function bulkUpdateApprovals(ids, status, token) {
  const res = await fetch(`${API_BASE}/admin/approvals/bulk`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids, status }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}