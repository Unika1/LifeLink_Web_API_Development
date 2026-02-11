"use client";

import { useParams } from "next/navigation";
import EditUserForm from "./_components/EditUserForm";

export default function AdminUserEditPage() {
  const params = useParams();
  return <EditUserForm userId={params.id as string} />;
}
