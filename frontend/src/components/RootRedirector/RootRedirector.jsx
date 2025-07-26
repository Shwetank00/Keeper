import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RootRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("RootRedirector: Component mounted/updated."); // Debugging line
    const token = localStorage.getItem("accessToken");
    console.log(
      "RootRedirector: Value read from localStorage for 'accessToken':",
      token
    ); // Crucial debugging line

    if (token) {
      console.log("RootRedirector: Token found, navigating to /home."); // Debugging line
      navigate("/home", { replace: true });
    } else {
      console.log("RootRedirector: No token found, navigating to /login."); // Debugging line
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return null;
};
