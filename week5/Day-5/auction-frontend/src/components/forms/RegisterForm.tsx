'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/countryCodes';
import { useRegister } from '@/hooks/useAuth';
import { registerSchema } from '@/lib/validationSchemas';
import * as yup from 'yup';

type FormData = yup.InferType<typeof registerSchema>;

export function RegisterForm() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      countryCode: 'pk',
    },
  });

  const countryCodes: Record<string, string> = Object.fromEntries(
    countries.map((c) => [c.key, c.dialCode])
  );

  const countryMax: Record<string, number> = Object.fromEntries(
    countries.map((c) => [
      c.key,
      typeof c.maxLength === 'number' ? c.maxLength : 10,
    ])
  );

  const agreeToTerms = watch('agreeToTerms');
  const selectedCountry = watch('countryCode') || 'pk';

  const onSubmit = async (data: FormData) => {
    try {
      const localNumber = (data.mobile || '').toString().replace(/^0+/, '');
      const dial = countryCodes[data.countryCode] ?? '+92';
      const mobileWithCode = `${dial}${localNumber}`;

      await registerMutation.mutateAsync({
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        mobileNumber: mobileWithCode,
      });
    } catch (error: any) {
      // Error handled by mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-medium text-[#4A5FBF] mb-4">
          Personal Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Your Full Name*
            </label>
            <Input
              type="text"
              {...register('fullName')}
              className={`w-full ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Email*
              </label>
              <Input
                type="email"
                {...register('email')}
                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Mobile Number*
              </label>
              <div className="flex">
                <Controller
                  control={control}
                  name="countryCode"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-25">
                        <SelectValue>
                          {field.value
                            ? `${field.value} (${countryCodes[field.value] ?? ''})`
                            : 'Select country'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.key} value={c.key}>
                            {c.name} {c.dialCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="flex-1 ml-2">
                  <Input
                    type="tel"
                    {...register('mobile')}
                    maxLength={countryMax[selectedCountry] ?? 10}
                    onChange={(e) => {
                       const raw = e.target.value || '';
                       const digits = raw.replace(/\D/g, '');
                       const maxLen = countryMax[selectedCountry] ?? 10;
                       const local = digits.slice(0, maxLen);
                       setValue('mobile', local);
                    }}
                    className={`w-full ${errors.mobile ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
               {errors.countryCode && (
                <p className="text-red-500 text-sm mt-1">{errors.countryCode.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div>
        <h3 className="text-lg font-medium text-[#4A5FBF] mb-4">
          Account Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username*
            </label>
            <div className="flex">
              <Input
                type="text"
                {...register('username')}
                className={`flex-1 ${errors.username ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2 text-[#4A5FBF] border-[#4A5FBF] bg-transparent"
              >
                Check Availability
              </Button>
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password*
              </label>
              <Input
                type="password"
                {...register('password')}
                className={`w-full ${errors.password ? 'border-red-500' : ''}`}
              />
               {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password*
              </label>
              <Input
                type="password"
                {...register('confirmPassword')}
                className={`w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div>
        <div className="flex items-start space-x-2">
          <Controller
            control={control}
            name="agreeToTerms"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                id="terms"
                checked={value}
                onCheckedChange={onChange}
              />
            )}
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="/terms" className="text-[#4A5FBF] hover:underline">
              Terms & Conditions
            </a>
          </label>
        </div>
        {errors.agreeToTerms && (
           <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || registerMutation.isPending}
        className={
            'w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white py-3'
        }
      >
        {isSubmitting || registerMutation.isPending ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
