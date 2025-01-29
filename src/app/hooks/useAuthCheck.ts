import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Import js-cookie
import { USER_TOKEN } from "lib/constants";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const router = useRouter();

  useEffect(() => {
    // Retrieve the token from the HTTP cookie
    const token = Cookies.get(USER_TOKEN); // Get the token cookie

    if (token) {
      // Optionally, you can decode the JWT to check for expiration (if needed)
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const expiration = decodedToken.exp * 1000; // Convert to milliseconds
        if (Date.now() < expiration) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          Cookies.remove(USER_TOKEN); // Remove expired token
          // router.push("/signing");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        setIsAuthenticated(false);
        // router.push("/signing");
      }
    } else {
      setIsAuthenticated(false);
      // router.push("/signing");
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
