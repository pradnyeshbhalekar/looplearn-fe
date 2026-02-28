import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "../../types/admin";

type Props = PropsWithChildren<{}>;

const AdminRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;