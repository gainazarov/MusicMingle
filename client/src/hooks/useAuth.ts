import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuth(redirectOn401: boolean = true) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  useEffect(() => {
    if (
      redirectOn401 &&
      error &&
      typeof window !== "undefined" &&
      error.message?.startsWith("401")
    ) {
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
  }, [error, redirectOn401]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
