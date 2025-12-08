import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-purple-600">404</h1>
      <p className="text-xl text-gray-700 mt-4">Page Not Found</p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
      >
        Go Home
      </button>
    </div>
  );
}
