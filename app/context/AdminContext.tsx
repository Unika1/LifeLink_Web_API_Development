"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminSearch() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminSearch must be used within AdminProvider");
  }
  return context;
}
