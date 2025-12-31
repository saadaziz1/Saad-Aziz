"use client";
import { useState, useEffect, memo, useRef } from "react";
import { FormInput } from "./InputForm";
import { FormSection } from "./FormSection";
import {
  personalSchema,
  passwordSchema,
  addressSchema,
  trafficSchema,
} from "@/lib/profileValidation";
import { countries } from "@/lib/countryCodes";
import { Input } from "@/components/ui/input";

export interface ProfileFormData {
  // Personal Information
  fullName: string;
  email: string;
  username: string;
  countryCode: string;
  mobileNumber: string;
  nationality: string;
  profileImage: string;
  idType: string;
  idNumber: string;

  // Personal Interests
  password: string;

  // Address
  address1: string;
  address2: string;
  city: string;
  poBox: string;
  country: string;
  landline: string;
  // Safe Ride Information
  trafficType: string;

  plateNumber: string;
  issueCity: string;
  driverLicenseNumber: string;
  plateCode: string;
  plateState: string;
  trafficFileNumber: string;
}

interface ProfileFormProps {
  initialData?: ProfileFormData | null;
  onSubmit?: (
    data: ProfileFormData,
    section: string,
    file?: File | null
  ) => void | Promise<void>;
}

function ProfileFormComponent({
  initialData = null,
  onSubmit,
}: ProfileFormProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Keep track of whether we're in editing mode to prevent state loss
  const initialDataRef = useRef<ProfileFormData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>(() => {
    const normalized = normalizeData(initialData);
    initialDataRef.current = normalized;
    return normalized;
  });

  // Helper to normalize data
  function normalizeData(
    data: Partial<ProfileFormData> | null | undefined
  ): ProfileFormData {
    return {
      fullName: data?.fullName ?? "",
      email: data?.email ?? "",
      username: data?.username ?? "",
      countryCode: data?.countryCode ?? "",
      mobileNumber: data?.mobileNumber ?? "",
      nationality: data?.nationality ?? "",
      profileImage: data?.profileImage ?? "",
      idType: data?.idType ?? "",
      idNumber: data?.idNumber ?? "",
      password: data?.password ?? "",
      address1: data?.address1 ?? "",
      address2: data?.address2 ?? "",
      city: data?.city ?? "",
      poBox: data?.poBox ?? "",
      country: data?.country ?? "",
      landline: data?.landline ?? "",
      trafficType: data?.trafficType ?? "",
      plateNumber: data?.plateNumber ?? "",
      issueCity: data?.issueCity ?? "",
      driverLicenseNumber: data?.driverLicenseNumber ?? "",
      plateCode: data?.plateCode ?? "",
      plateState: data?.plateState ?? "",
      trafficFileNumber: data?.trafficFileNumber ?? "",
    };
  }

  // The reset bug happened because formData was being reset from initialData on every prop change, even while editing. Now, we only sync formData from initialData when not editing.
  // The reset bug happened because formData was being reset from initialData on every prop change, even while editing. Now, we only sync formData from initialData when not editing.
  useEffect(() => {
    if (editingSection) return;
    if (!initialData) return;

    // Normalize new incoming data
    const normalized = normalizeData(initialData);

    // Check if the new data is actually different from what we last initialized with
    // This breaks the loop if parent passes a new object reference with same content
    if (JSON.stringify(normalized) === JSON.stringify(initialDataRef.current)) return;

    setFormData(normalized);
    initialDataRef.current = normalized;
    setErrors({});
  }, [initialData, editingSection]);

  // Validation logic per section
  async function validateSection(section: string): Promise<boolean> {
    let schema;
    if (section === "personal") schema = personalSchema;
    if (section === "password") schema = passwordSchema;
    if (section === "address") schema = addressSchema;
    if (section === "traffic") schema = trafficSchema;
    if (!schema) return true;
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: Record<string, string | null> = {};
      if (err.inner) {
        err.inner.forEach((e: any) => {
          if (e.path) newErrors[e.path] = e.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      next[field] = null;
      return next;
    });
  };

  const handleSaveSection = async (section: string) => {
    const valid = await validateSection(section);
    if (!valid) return;
    onSubmit?.(formData, section, profileFile);
    setEditingSection(null);
    setProfileFile(null);
  };

  const getFieldsForSection = (section: string) => {
    switch (section) {
      case "personal":
        return [
          "fullName",
          "email",
          "phone",
          "nationality",
          "idType",
          "idNumber",
          "profileImage",
        ];
      case "password":
        return ["password"];
      case "address":
        return ["country", "city", "address1", "address2", "landline", "poBox"];
      case "traffic":
        return [
          "trafficType",
          "trafficFileNumber",
          "plateNumber",
          "issueCity",
          "driverLicenseNumber",
          "plateCode",
          "plateState",
        ];
      default:
        return [];
    }
  };

  const handleCancelSection = (section: string) => {
    const fields = getFieldsForSection(section) as (keyof ProfileFormData)[];
    if (initialDataRef.current) {
      setFormData((prev) => {
        const copy = { ...prev };
        fields.forEach((f) => {
          copy[f] = initialDataRef.current![f];
        });
        return copy;
      });
    }
    setEditingSection(null);
    setProfileFile(null);
  };

  useEffect(() => {
    if (editingSection !== "password") setPasswordVisible(false);
  }, [editingSection]);

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <FormSection
        title="Personal Information"
        sectionKey="personal"
        editingSection={editingSection}
        onEdit={setEditingSection}
        onSave={handleSaveSection}
        onCancel={handleCancelSection}
      >
        <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1fr_1fr] gap-4 items-start">
          {/* Profile image column */}
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="w-30 h-30 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {formData.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                // placeholder
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/placeholder.svg"
                  alt="Placeholder"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {editingSection === "personal" && (
              <div className="mt-2 flex flex-col items-center">
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setProfileFile(f);
                    if (f) {
                      const url = URL.createObjectURL(f);
                      setFormData((p) => ({ ...p, profileImage: url }));
                    } else if (initialDataRef.current) {
                      setFormData((p) => ({
                        ...p,
                        profileImage: initialDataRef.current!.profileImage,
                      }));
                    }
                  }}
                />
                <label htmlFor="profile-image-input">
                  <span className="inline-block px-4 py-2 mt-2 bg-[#2E3D83] text-white rounded-lg shadow hover:bg-[#4356b3] cursor-pointer transition-colors duration-150">
                    {profileFile ? "Change Image" : "Select Image"}
                  </span>
                </label>
                {profileFile && (
                  <span className="text-xs text-gray-500 mt-1">
                    {profileFile.name}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                label="Username"
                value={formData.username || ""}
                field="username"
                section="personal"
                editingSection={editingSection}
                passwordVisible={passwordVisible}
                onChange={handleInputChange}
                togglePassword={() => setPasswordVisible((v) => !v)}
                error={errors.username ?? undefined}
              />
              <FormInput
                label="Full Name"
                value={formData.fullName}
                field="fullName"
                section="personal"
                editingSection={editingSection}
                passwordVisible={passwordVisible}
                onChange={handleInputChange}
                togglePassword={() => setPasswordVisible((v) => !v)}
                error={errors.fullName ?? undefined}
              />
              <FormInput
                label="Email"
                value={formData.email}
                field="email"
                section="personal"
                editingSection={editingSection}
                passwordVisible={passwordVisible}
                onChange={handleInputChange}
                togglePassword={() => setPasswordVisible((v) => !v)}
                error={errors.email ?? undefined}
              />
              <div className="flex items-center">
                <label className="w-62 text-lg font-semibold text-[#2E3D83]">
                  Mobile Number
                </label>
                <div className="relative flex items-center w-full">
                  {editingSection === "personal" ? (
                    <>
                      <select
                        className="absolute left-2 top-1/2 -translate-y-1/2 border-none bg-transparent text-sm w-16 focus:outline-none"
                        value={formData.countryCode}
                        onChange={(e) =>
                          handleInputChange("countryCode", e.target.value)
                        }
                        style={{ zIndex: 2 }}
                      >
                        <option value="">Code</option>
                        {countries.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.dialCode}
                          </option>
                        ))}
                      </select>
                      <Input
                        type="text"
                        className="w-full max-w-sm px-2 py-1.5 text-lg pl-20"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "mobileNumber",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        maxLength={
                          countries.find(
                            (c) => c.key === formData.countryCode
                          )?.maxLength || 15
                        }
                        placeholder="Mobile Number"
                      />
                    </>
                  ) : (
                    // Read-only display
                    <p className="text-lg text-[#939393]">
                      {formData.countryCode
                        ? `${countries.find(c => c.key === formData.countryCode)?.dialCode || formData.countryCode} ${formData.mobileNumber}`
                        : formData.mobileNumber || " "}
                    </p>
                  )}
                </div>
                {errors.mobileNumber && (
                  <span className="text-sm text-red-500">
                    {errors.mobileNumber}
                  </span>
                )}
              </div>
              <FormInput
                label="Nationality"
                value={formData.nationality}
                field="nationality"
                section="personal"
                editingSection={editingSection}
                passwordVisible={passwordVisible}
                onChange={handleInputChange}
                togglePassword={() => setPasswordVisible((v) => !v)}
                error={errors.nationality ?? undefined}
              />
              <FormInput
                label="ID Type"
                value={formData.idType}
                field="idType"
                section="personal"
                editingSection={editingSection}
                passwordVisible={passwordVisible}
                onChange={handleInputChange}
                togglePassword={() => setPasswordVisible((v) => !v)}
                error={errors.idType ?? undefined}
              />
              <FormInput
                label="ID Number"
                value={formData.idNumber}
                field="idNumber"
                section="personal"
                editingSection={editingSection}
                passwordVisible={passwordVisible}
                onChange={handleInputChange}
                togglePassword={() => setPasswordVisible((v) => !v)}
                error={errors.idNumber ?? undefined}
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Password Section */}
      <FormSection
        title="Password"
        sectionKey="password"
        editingSection={editingSection}
        onEdit={setEditingSection}
        onSave={handleSaveSection}
        onCancel={handleCancelSection}
      >
        <FormInput
          label="Password"
          value={formData.password}
          field="password"
          section="password"
          editingSection={editingSection}
          passwordVisible={passwordVisible}
          onChange={handleInputChange}
          togglePassword={() => setPasswordVisible((v) => !v)}
          error={errors.password ?? undefined}
        />
      </FormSection>

      {/* Address Section */}
      <FormSection
        title="Address"
        sectionKey="address"
        editingSection={editingSection}
        onEdit={setEditingSection}
        onSave={handleSaveSection}
        onCancel={handleCancelSection}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Country"
            value={formData.country}
            field="country"
            section="address"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.country ?? undefined}
          />

          <FormInput
            label="City"
            value={formData.city}
            field="city"
            section="address"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.city ?? undefined}
          />

          <FormInput
            label="Address 1"
            value={formData.address1}
            field="address1"
            section="address"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.address1 ?? undefined}
          />
          <FormInput
            label="Address 2"
            value={formData.address2}
            field="address2"
            section="address"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.address2 ?? undefined}
          />
          <FormInput
            label="Land Line Number"
            value={formData.landline}
            field="landline"
            section="address"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.landline ?? undefined}
          />

          <FormInput
            label="P.O Box"
            value={formData.poBox}
            field="poBox"
            section="address"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.poBox ?? undefined}
          />
        </div>
      </FormSection>

      {/* Safe Ride Information Section */}
      <FormSection
        title="Trafic File Information"
        sectionKey="traffic"
        editingSection={editingSection}
        onEdit={setEditingSection}
        onSave={handleSaveSection}
        onCancel={handleCancelSection}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Traffic Information Type"
            value={formData.trafficType}
            field="trafficType"
            section="traffic"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.trafficType ?? undefined}
          />
          <FormInput
            label="Plate State"
            value={formData.plateState}
            field="plateState"
            section="traffic"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.plateState ?? undefined}
          />
          <FormInput
            label="Traffic File Number"
            value={formData.trafficFileNumber}
            field="trafficFileNumber"
            section="traffic"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.trafficFileNumber ?? undefined}
          />
          <FormInput
            label="Plate Code"
            value={formData.plateCode}
            field="plateCode"
            section="traffic"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.plateCode ?? undefined}
          />
          <FormInput
            label="Plate Number"
            value={formData.plateNumber}
            field="plateNumber"
            section="traffic"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.plateNumber ?? undefined}
          />
          <FormInput
            label="Driver License Number"
            value={formData.driverLicenseNumber}
            field="driverLicenseNumber"
            section="traffic"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.driverLicenseNumber ?? undefined}
          />
          <FormInput
            label="Issue City"
            value={formData.issueCity}
            field="issueCity"
            section="traffic"
            editingSection={editingSection}
            passwordVisible={passwordVisible}
            onChange={handleInputChange}
            togglePassword={() => setPasswordVisible((v) => !v)}
            error={errors.issueCity ?? undefined}
          />
        </div>
      </FormSection>

      {/* Save/Cancel handled per-section in header */}
    </div>
  );
}

// Memoize with deep comparison of initialData
export const ProfileForm = memo(ProfileFormComponent);
