import SettingsForm from "./_components/SettingsForm";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
        <p className="mt-1 text-zinc-600">
          Manage system configuration and application preferences.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
