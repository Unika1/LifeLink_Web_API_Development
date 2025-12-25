type Props = {
  type?: string;
  placeholder: string;
  error?: string;
};

export default function FormInput({
  type = "text",
  placeholder,
  error,
}: Props) {
  return (
    <div className="mb-5 w-full">
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border-b border-zinc-300 py-3 outline-none
             text-zinc-900 placeholder:text-zinc-400 bg-transparent
             focus:border-zinc-500"
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
