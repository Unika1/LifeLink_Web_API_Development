type Props = {
  label: string;
};

export default function SocialButton({ label }: Props) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white py-2 text-sm text-zinc-700 hover:bg-zinc-50"
    >
      {label}
    </button>
  );
}
