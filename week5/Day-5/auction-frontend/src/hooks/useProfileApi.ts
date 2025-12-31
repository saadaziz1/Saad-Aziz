import { useCallback } from "react";
import { api } from "@/lib/api";
import { extractId } from "@/lib/profileUtils";
import { useAuthStore } from "@/stores/authStore";

export function useProfileApi() {
  const user = useAuthStore((s) => s.user);
  const updateUserInStore = useAuthStore((s) => s.updateUser);

  // Handles all profile section saves
  const handleProfileSave = useCallback(async (data: any, section: string, file?: File | null) => {
    if (!user) return;
    const userId = extractId(user);
    if (!userId) return;
    try {
      const formData = new FormData();
      const append = (k: string, v: any) =>
        v !== "" && v !== undefined && formData.append(k, String(v));

      if (section === "personal") {
        append("fullName", data.fullName);
        append("email", data.email);
        append("username", data.username);
        append("countryCode", data.countryCode);
        append("mobileNumber", data.mobileNumber);
        append("nationality", data.nationality);
        append("idType", data.idType);
        append("idNumber", data.idNumber);
        if (file) formData.append("profileImage", file);
      }
      if (section === "password") append("password", data.password);
      if (section === "address") {
        append("country", data.country);
        append("city", data.city);
        append("address1", data.address1);
        append("address2", data.address2);
        append("landline", data.landline);
        append("poBox", data.poBox);
      }
      if (section === "traffic") {
        append("trafficType", data.trafficType);
        append("trafficFileNumber", data.trafficFileNumber);
        append("plateNumber", data.plateNumber);
        append("issueCity", data.issueCity);
        append("driverLicenseNumber", data.driverLicenseNumber);
        append("plateCode", data.plateCode);
        append("plateState", data.plateState);
      }
      const res = await api.put(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = res.data;
      updateUserInStore(updatedUser);
      return { success: true, updatedUser };
    } catch (err: any) {
      return { success: false, error: err?.response?.data?.message || "Update failed" };
    }
  }, [user, updateUserInStore]);

  return { handleProfileSave };
}
