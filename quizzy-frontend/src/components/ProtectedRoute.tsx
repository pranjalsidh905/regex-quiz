import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  Component: React.FC;
  redirectPath: string; // Path to redirect if not authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { Component, redirectPath } = props;
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(redirectPath);
    }
  }, [token, navigate, redirectPath]);

  return token ? <Component /> : null;
};

export default ProtectedRoute;
