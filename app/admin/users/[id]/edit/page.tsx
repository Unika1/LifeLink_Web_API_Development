import EditUserForm from "./_components/EditUserForm";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export default function AdminUserEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <EditUserForm userId={params.id} />
    </div>
  );
}
