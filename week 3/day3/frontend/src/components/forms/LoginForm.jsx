import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import FormInput from "./FormInput";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading,error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
  await login(data);
  
  };

   if (loading) return <Loader />;
  return (
    <div className="w-full  flex justify-center items-center text-white ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#1A1A40] px-8 py-10 rounded-2xl shadow-lg w-full max-w-md mt-5"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
{error && <p className="text-red-500 ">{error}</p>}

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
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition shadow"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="text-purple-600 font-medium cursor-pointer">Sign Up</span>
        </p>
      </form>
    </div>
  );
}
