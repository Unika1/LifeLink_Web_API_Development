import EditUserForm from "./_components/EditUserForm";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export default async function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="mx-auto max-w-3xl">
      <EditUserForm userId={id} />
    </div>
  );
}
