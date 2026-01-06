/* sell-your-car/page.tsx */
"use client";

import Head from "next/head";
import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { CAR_MAKES, CAR_MODELS_BY_MAKE } from '@/types/car-enums';

import { HeroSection } from "@/components/layout/hero-section";
import { useCreateCar } from "@/hooks/useCars";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sellCarSchema } from "@/lib/validationSchemas";
import { countries } from "@/lib/countryCodes";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Type inference from schema would be ideal, but for now defining explicit interface matching schema
interface SellCarFormData {
  partyType: "dealer" | "private";
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  mileage: number;
  engineSize: string;
  paint: string;
  gccSpecs: string;
  notes?: string;
  accidentHistory: string;
  serviceHistory: string;
  modified: string; // 'stock' | 'modified'
  maxBid: string;
  photos?: File[] | null;
}

export default function SellYourCarPage() {
  return <SellYourCarContent />;
}

function SellYourCarContent() {
  const createCarMutation = useCreateCar();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SellCarFormData>({
    resolver: yupResolver(sellCarSchema) as any,
    defaultValues: {
      partyType: "dealer",
      countryCode: "us",
      modified: "stock",
      maxBid: "",
      photos: [],
    },
  });

  // Watch for dynamic country code display or other logic if needed
  const countryCode = watch("countryCode");
  const partyType = watch("partyType");
  const modificationStatus = watch("modified");
  const currentPhotos = watch("photos") || [];
  const selectedMake = watch('make');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));

    if (currentPhotos.length + validFiles.length > 6) {
      alert("You can only upload a maximum of 6 photos.");
      return;
    }

    const updatedPhotos = [...(currentPhotos || []), ...validFiles].slice(0, 6);

    // Generate previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews].slice(0, 6));

    setValue("photos", updatedPhotos, { shouldValidate: true });
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...currentPhotos];
    updatedPhotos.splice(index, 1);

    const updatedPreviews = [...previewUrls];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]); // Cleanup
    }
    updatedPreviews.splice(index, 1);

    setPreviewUrls(updatedPreviews);
    setValue("photos", updatedPhotos, { shouldValidate: true });
  };

  const onSubmit = async (data: SellCarFormData) => {
    if (!isAuthenticated) {
      toast.warning("Please login to list your car for auction");
      router.push("/login");
      return;
    }
    try {
      const formData = new FormData();

      // Basic Fields
      formData.append('title', `${data.year} ${data.make} ${data.model}`.trim());
      formData.append('description', data.notes || '');
      formData.append('make', data.make);
      formData.append('model', data.model);
      formData.append('year', data.year);
      formData.append('bodyType', 'sedan'); // Hardcoded in original, keep or make dynamic? keeping for consistency

      // Starting Price
      const numericPrice = Number(String(data.maxBid).replace(/[^0-9.-]+/g, ""));
      formData.append('startingPrice', String(numericPrice));

      // Timestamps
      formData.append('startTime', new Date().toISOString());
      formData.append('endTime', new Date(Date.now() +  5 * 60 * 1000).toISOString()); // 7 days default

      // Additional Specs
      formData.append('vin', data.vin);
      formData.append('mileage', String(data.mileage));
      formData.append('engineSize', data.engineSize);
      formData.append('paint', data.paint);
      formData.append('gccSpecs', data.gccSpecs);
      formData.append('accidentHistory', data.accidentHistory);
      formData.append('serviceHistory', data.serviceHistory);
      formData.append('modified', data.modified);

      // User/Contact Info (Backend might expect these separately or part of user profile? 
      // Original code didn't explicitly send firstName/lastName/email/phone in formData separate from User object,
      // but maybe they are needed for the listing contact info. 
      // I will assume the backend handles the logged-in user, but if these are temporary contact fields for the listing `meta`, 
      // I should append them if the backend supports it. The original code collected them but didn't clearly append them to formData 
      // other than potentially implicit logic. I will append them to be safe if the schema expects it.)
      // Checking original handleSubmit... it NOT appending firstName, lastName, phone to formData. Only car details.
      // However, it validates them. I will append them just in case backend expects them as metadata.
      formData.append('contactFirstName', data.firstName);
      formData.append('contactLastName', data.lastName);
      formData.append('contactEmail', data.email);
      const selectedCountry = countries.find(c => c.key === data.countryCode);
      const dial = selectedCountry?.dialCode || "+1";
      formData.append('contactPhone', `${dial}${data.phone}`);

      // Photos
      if (data.photos) {
        data.photos.forEach((file) => {
          formData.append('photos', file);
        });
      }

      await createCarMutation.mutateAsync(formData);


      // Reset form
      reset({
        partyType: "dealer",
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "us",
        phone: "",
        vin: "",
        year: "",
        make: "",
        model: "",
        mileage: undefined,
        engineSize: "",
        paint: "",
        gccSpecs: "",
        notes: "",
        accidentHistory: "",
        serviceHistory: "",
        modified: "stock",
        maxBid: "",
        photos: [],
      });

      setPreviewUrls([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.log(error);
    }
  };

  const countryCodesList = countries.map(c => ({ value: c.key, label: c.dialCode, name: c.name }));

  return (
    <>
      <HeroSection
        title="Sell Your Car"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sell Your Car" }]}
      />
      <Head>
        <title>Sell Your Car — Tell us about your car</title>
        <meta name="description" content="Tell us about the car you want to sell" />
      </Head>

      <main className="bg-white py-10 min-h-[70vh]">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-10">
            Tell us about your car
          </h1>
          <p className="text-[#535353] text-lg mb-7.5">
            Please give us some basics about yourself and car you’d like to sell.
            We’ll also need details about the car’s title status as well as photos.
          </p>
          <p className="text-[#535353] text-lg mb-13">
            We’ll respond to your application within a business day.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black" noValidate>

            {/* --- YOUR INFO SECTION --- */}
            <section className="bg-[#DBE8FF] border border-slate-200 rounded-lg p-5">
              <div className="mb-3 border-b pb-2">
                <div className="inline-block border-b-[5px] border-[#FFC300] pb-2">
                  <h2 className="text-2xl font-bold">Your Info</h2>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xl font-medium mb-2">Dealer or Private party?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("partyType", "dealer")}
                    className={`px-5 py-1.5 rounded-sm border text-sm transition-colors ${partyType === "dealer"
                      ? "bg-white border-sky-700 shadow-sm text-sky-700 font-semibold"
                      : "bg-white border-[#929292] text-gray-600"
                      }`}
                  >
                    Dealer
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("partyType", "private")}
                    className={`px-5 py-1.5 rounded-sm border text-sm transition-colors ${partyType === "private"
                      ? "bg-white border-sky-700 shadow-sm text-sky-700 font-semibold"
                      : "bg-white border-[#929292] text-gray-600"
                      }`}
                  >
                    Private party
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xl font-medium">First name*</label>
                  <Input
                    {...register("firstName")}
                    className={`mt-1 block w-full rounded-sm border px-3 py-2 text-sm bg-white ${errors.firstName ? "border-red-500" : "border-[#929292]"}`}
                  />
                  {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block text-xl font-medium">Last name*</label>
                  <Input
                    {...register("lastName")}
                    className={`mt-1 block w-full rounded-sm border px-3 py-2 text-sm bg-white ${errors.lastName ? "border-red-500" : "border-[#929292]"}`}
                  />
                  {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>}
                </div>

                <div>
                  <label className="block text-xl font-medium">Email*</label>
                  <Input
                    type="email"
                    {...register("email")}
                    className={`mt-1 block w-full rounded-sm border px-3 py-2 text-sm bg-white ${errors.email ? "border-red-500" : "border-[#929292]"}`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xl font-medium">Phone number*</label>
                  <div className="flex mt-1">
                    <Controller
                      control={control}
                      name="countryCode"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-28 rounded-sm bg-white border border-[#929292]">
                            <SelectValue placeholder="+1" />
                          </SelectTrigger>

                          <SelectContent className="bg-white border border-[#2E3D83] max-h-60 overflow-y-auto">
                            {countryCodesList.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label} ({country.name})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      {...register("phone")}
                      placeholder="1234567890"
                      className={`ml-2 flex-1 rounded-sm bg-white border px-3 py-2 text-sm ${errors.phone ? "border-red-500" : "border-[#929292]"}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            {/* --- CAR DETAILS SECTION --- */}
            <section className="bg-[#DBE8FF] border border-slate-200 rounded-lg p-5">
              <div className="mb-3 border-b">
                <div className="inline-block border-b-[5px] border-[#FFC300] pb-2">
                  <h2 className="text-2xl font-bold">Car Details</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* VIN */}
                <div>
                  <label className="block text-xl font-medium">VIN*</label>
                  <Input
                    {...register("vin")}
                    className={`mt-1 block w-full rounded-sm bg-white border ${errors.vin ? "border-red-500" : "border-[#929292]"}`}
                  />
                  {errors.vin && <p className="text-xs text-red-600 mt-1">{errors.vin.message}</p>}
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xl font-medium">Year*</label>
                  <Controller
                    control={control}
                    name="year"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`mt-1 block w-full rounded-sm bg-white border ${errors.year ? "border-red-500" : "border-[#929292]"}`}>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#2E3D83]">
                          {Array.from({ length: 30 }).map((_, i) => (
                            <SelectItem key={i} value={String(2025 - i)}>{2025 - i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year.message}</p>}
                </div>

                {/* Make */}
                <div>
                  <label className="block text-xl font-medium">Make*</label>
                  <Controller
                    control={control}
                    name="make"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className={`mt-1 block w-full rounded-sm bg-white border ${errors.make ? 'border-red-500' : 'border-[#929292]'
                            }`}
                        >
                          <SelectValue placeholder="Select Make" />
                        </SelectTrigger>

                        <SelectContent className="bg-white border border-[#2E3D83]">
                          {CAR_MAKES.map((make) => (
                            <SelectItem key={make} value={make}>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.make && <p className="text-xs text-red-600 mt-1">{errors.make.message}</p>}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-xl font-medium">Model*</label>
                  <Controller
                    control={control}
                    name="model"
                    render={({ field }) => {
                      const models =
                        CAR_MODELS_BY_MAKE[selectedMake] || ['Other'];

                      return (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedMake}
                        >
                          <SelectTrigger
                            className={`mt-1 block w-full rounded-sm bg-white border ${errors.model ? 'border-red-500' : 'border-[#929292]'
                              }`}
                          >
                            <SelectValue
                              placeholder={
                                selectedMake ? 'Select Model' : 'Select Make first'
                              }
                            />
                          </SelectTrigger>

                          <SelectContent className="bg-white border border-[#2E3D83]">
                            {models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />

                  {errors.model && <p className="text-xs text-red-600 mt-1">{errors.model.message}</p>}
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-xl font-medium">Mileage (in miles)*</label>
                  <Input
                    {...register("mileage")}
                    type="number"
                    className={`mt-1 block w-full rounded-sm bg-white border ${errors.mileage ? "border-red-500" : "border-[#929292]"}`}
                  />
                  {errors.mileage && <p className="text-xs text-red-600 mt-1">{errors.mileage.message}</p>}
                </div>

                {/* Engine Size */}
                <div>
                  <label className="block text-xl font-medium">Engine size*</label>
                  <Controller
                    control={control}
                    name="engineSize"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`mt-1 block w-full rounded-sm bg-white border ${errors.engineSize ? "border-red-500" : "border-[#929292]"}`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#2E3D83]">
                          <SelectItem value="4">4 Cylinder</SelectItem>
                          <SelectItem value="6">6 Cylinder</SelectItem>
                          <SelectItem value="8">8 Cylinder</SelectItem>
                          <SelectItem value="10">10 Cylinder</SelectItem>
                          <SelectItem value="12">12 Cylinder</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.engineSize && <p className="text-xs text-red-600 mt-1">{errors.engineSize.message}</p>}
                </div>

                {/* Paint */}
                <div>
                  <label className="block text-xl font-medium">Paint*</label>
                  <Controller
                    control={control}
                    name="paint"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`mt-1 block w-full rounded-sm bg-white border ${errors.paint ? "border-red-500" : "border-[#929292]"}`}>
                          <SelectValue placeholder="Select Paint" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#2E3D83]">
                          <SelectItem value="Original Paint">Original Paint</SelectItem>
                          <SelectItem value="Partially Repainted">Partially Repainted</SelectItem>
                          <SelectItem value="Totally Repainted">Totally Repainted</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.paint && <p className="text-xs text-red-600 mt-1">{errors.paint.message}</p>}
                </div>

                {/* GCC Specs */}
                <div>
                  <label className="block text-xl font-medium">Has GCC Specs*</label>
                  <Controller
                    control={control}
                    name="gccSpecs"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`mt-1 block w-full rounded-sm bg-white border ${errors.gccSpecs ? "border-red-500" : "border-[#929292]"}`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#2E3D83]">
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gccSpecs && <p className="text-xs text-red-600 mt-1">{errors.gccSpecs.message}</p>}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <label className="block text-xl font-medium">Noteworthy options/features</label>
                <textarea
                  {...register("notes")}
                  rows={5}
                  className="mt-1 block w-full rounded-sm bg-white border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              {/* History & Modification */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xl font-medium">Accident History*</label>
                  <Controller
                    control={control}
                    name="accidentHistory"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`mt-1 block w-full rounded-sm bg-white border ${errors.accidentHistory ? "border-red-500" : "border-[#929292]"}`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#2E3D83]">
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.accidentHistory && <p className="text-xs text-red-600 mt-1">{errors.accidentHistory.message}</p>}
                </div>

                <div>
                  <label className="block text-xl font-medium">Full Service History*</label>
                  <Controller
                    control={control}
                    name="serviceHistory"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`mt-1 block w-full rounded-sm bg-white border ${errors.serviceHistory ? "border-red-500" : "border-[#929292]"}`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#2E3D83]">
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.serviceHistory && <p className="text-xs text-red-600 mt-1">{errors.serviceHistory.message}</p>}
                </div>
              </div>

              {/* Modifications & Price */}
              <div className="mt-4 flex flex-col md:flex-row md:items-end md:gap-4 gap-3">
                <div className="flex-1">
                  <label className="block text-xl font-medium">Has the car been modified?*</label>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setValue("modified", "stock")}
                      className={`px-3 py-1.5 rounded-sm bg-white border text-sm transition-colors ${modificationStatus === "stock"
                        ? "border-sky-700 shadow-sm text-sky-700 font-semibold"
                        : "border-slate-300 text-gray-600"
                        }`}
                    >
                      Completely stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("modified", "modified")}
                      className={`px-3 py-1.5 rounded-sm bg-white border text-sm transition-colors ${modificationStatus === "modified"
                        ? "border-sky-700 shadow-sm text-sky-700 font-semibold"
                        : "border-slate-300 text-gray-600"
                        }`}
                    >
                      Modified
                    </button>
                  </div>
                  {errors.modified && <p className="text-xs text-red-600 mt-1">{errors.modified.message}</p>}
                </div>

                <div className="w-full md:w-1/2 pl-0 md:pl-2">
                  <label className="block text-xl font-medium">Starting Price (USD)*</label>
                  <Input
                    {...register("maxBid")}
                    placeholder="25000"
                    className={`mt-1 block w-full rounded-sm bg-white border ${errors.maxBid ? "border-red-500" : "border-[#929292]"}`}
                  />
                  {errors.maxBid && <p className="text-xs text-red-600 mt-1">{errors.maxBid.message}</p>}
                </div>
              </div>

              {/* --- PHOTOS SECTION --- */}
              <div className="mt-8">
                <label className="block text-xl font-medium mb-3">Upload Photos </label>




                {currentPhotos.length >= 6 ? (
                  <p className="text-sm font-semibold text-orange-500">Max limit reached (6/6)</p>
                ) : (
                  <button type="button" className="px-4 py-2 bg-white border border-[#2E3D83] text-[#2E3D83] text-sm rounded-sm font-medium hover:bg-[#1e2a5c] transition-colors relative">
                    Add Photos (max 6)

                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </button>
                )}
              </div>


              {errors.photos && <p className="text-xs text-red-600 mt-2">{(errors.photos as any).message}</p>}

              {/* Photo Previews */}
              {currentPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded overflow-hidden border bg-gray-100 flex-shrink-0"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="p-[1px] bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Photo number label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}




              <div className="mt-6">
                <button
                  type="submit"
                  disabled={createCarMutation.isPending}
                  className={`inline-flex items-center px-4 py-2 rounded-sm text-white font-medium ${createCarMutation.isPending
                    ? "bg-slate-400"
                    : "bg-[#2E3D83] hover:bg-sky-700"
                    }`}
                >
                  {createCarMutation.isPending ? "Submitting…" : "Submit"}
                </button>
              </div>

            </section>
          </form>
        </div>
      </main>
    </>
  );
}
