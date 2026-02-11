"use client";

import { useParams } from "next/navigation";
import EditHospitalForm from "./_components/EditHospitalForm";

export default function AdminHospitalEditPage() {
  const params = useParams();
  return <EditHospitalForm hospitalId={params.id as string} />;
}
