export default function FormInput({ label, type, register, error, placeholder }) {
  return (
    <div className="mb-5">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        {...register}
        className="w-full px-4 py-2 border border-[#8758ff] placeholder:text-[#ffffff4d] rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
