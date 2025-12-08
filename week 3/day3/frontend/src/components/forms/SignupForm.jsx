import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Loader from '../Loader';
import FormInput from './FormInput';
import { useAuth } from '../../hooks/useAuth';

const SignupForm = () => {
  const navigate = useNavigate();
  const { register: registerAuth, loading,error } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    await registerAuth(userData);
   
  };

  if (loading) return <Loader />;

  return (
 <div className="w-full  flex justify-center items-center text-white ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#1A1A40] px-8 py-10 rounded-2xl shadow-lg w-full max-w-md mt-5"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
{error && <p className="text-red-500 mb-4">{error}</p>}
        <FormInput
          label="Full Name"
          type="text"
          register={register("name", { required: "Full name is required" })}
          error={errors.name}
          placeholder="John Doe"
        />

        <FormInput
          label="Email"
          type="email"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          error={errors.email}
          placeholder="example@mail.com"
        />

        <FormInput
          label="Password"
          type="password"
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password}
          placeholder="Enter your password"
        />

        <FormInput
          label="Confirm Password"
          type="password"
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition shadow"
        >
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <span onClick={() => navigate('/')} className="text-purple-600 font-medium cursor-pointer">Sign in</span>
        </p>
      </form>
    </div>
  )
}

export default SignupForm