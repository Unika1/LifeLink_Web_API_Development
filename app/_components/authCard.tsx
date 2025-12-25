type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AuthCard({ title, children }: Props) {
  return (
    <div className="w-full max-w-md">
      <h1 className="mb-8 text-center text-2xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}
