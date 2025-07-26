import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RootRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem("accessToken");

    if (token) {
      // If a token exists, redirect to the home page
      navigate("/home", { replace: true });
    } else {
      // If no token, redirect to the login page
      navigate("/login", { replace: true });
    }
  }, [navigate]); // Re-run effect if navigate function changes (unlikely, but good practice)

  // You can render a loading spinner or null while the redirect happens
  return null;
};
