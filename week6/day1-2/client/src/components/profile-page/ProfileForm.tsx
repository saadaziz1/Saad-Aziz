"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProfile } from '@/hooks/useProfile';
import { useProfileStore } from '@/store/useProfileStore';
import { cn } from '@/lib/utils';
import { integralCF } from '@/styles/fonts';
import { profileSchema, ProfileFormData } from '@/lib/validations/schemas';
import toast from 'react-hot-toast';

export const ProfileForm = () => {
    const { profile, updateProfile, isUpdating } = useProfile();
    const { isEditing, setIsEditing } = useProfileStore();
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: profile?.name || '',
            email: profile?.email || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile(data);
            toast.success('Profile updated successfully! ✨');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
            console.error('Failed to update profile:', error);
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h2 className={cn(integralCF.className, "text-xl md:text-2xl uppercase")}>Profile Details</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all text-sm md:text-base"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                        <input
                            {...register('name')}
                            type="text"
                            disabled={!isEditing}
                            className={cn(
                                "w-full px-4 py-3 border rounded-xl transition-all text-sm md:text-base",
                                isEditing 
                                    ? errors.name 
                                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500" 
                                        : "border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    : "border-gray-100 bg-gray-50 text-gray-600"
                            )}
                            placeholder="Enter your full name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                        <input
                            {...register('email')}
                            type="email"
                            disabled={!isEditing}
                            className={cn(
                                "w-full px-4 py-3 border rounded-xl transition-all text-sm md:text-base",
                                isEditing 
                                    ? errors.email 
                                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500" 
                                        : "border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    : "border-gray-100 bg-gray-50 text-gray-600"
                            )}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                        <input
                            {...register('phone')}
                            type="tel"
                            disabled={!isEditing}
                            className={cn(
                                "w-full px-4 py-3 border rounded-xl transition-all text-sm md:text-base",
                                isEditing 
                                    ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                                    : "border-gray-100 bg-gray-50 text-gray-600"
                            )}
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Address</label>
                        <input
                            {...register('address')}
                            type="text"
                            disabled={!isEditing}
                            className={cn(
                                "w-full px-4 py-3 border rounded-xl transition-all text-sm md:text-base",
                                isEditing 
                                    ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                                    : "border-gray-100 bg-gray-50 text-gray-600"
                            )}
                            placeholder="Enter your address"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">{errors.address.message}</p>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 sm:flex-none bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all text-sm md:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};