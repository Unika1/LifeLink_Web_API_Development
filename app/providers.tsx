"use client";

import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./admin/context/AdminContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>{children}</AdminProvider>
    </AuthProvider>
  );
}
