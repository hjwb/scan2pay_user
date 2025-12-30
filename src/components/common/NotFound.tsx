import React from "react";
import { useNavigate } from "react-router";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/users/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-white text-black font-inter relative">
      <h1 className="text-[8rem] font-extrabold text-[#4D43EF] leading-none tracking-tight m-0">
        404
      </h1>
      <h2 className="text-2xl font-medium text-gray-800 mt-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 mt-4 max-w-md leading-relaxed">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <button
        onClick={goBack}
        className="mt-8 px-6 py-3 cursor-pointer bg-[#4D43EF] text-white font-semibold rounded-lg shadow-sm hover:bg-[#4D43EF]/70 transition ease-in-out duration-300"
      >
        Go Back
      </button>

      <footer className="absolute bottom-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Website
      </footer>
    </div>
  );
};

export default NotFound;
