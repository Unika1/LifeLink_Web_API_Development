"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface Settings {
  appName: string;
  appVersion: string;
  appDescription: string;
  maxBloodUnitsPerDonation: number;
  donationIntervalDays: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    appName: "LifeLink",
    appVersion: "1.0.0",
    appDescription: "Blood donation management system",
    maxBloodUnitsPerDonation: 450,
    donationIntervalDays: 90,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">General</h2>

            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Application Name
              </label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange("appName", e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="App Name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Version
                </label>
                <input
                  type="text"
                  value={settings.appVersion}
                  onChange={(e) => handleChange("appVersion", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                  placeholder="1.0.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Description
              </label>
              <textarea
                value={settings.appDescription}
                onChange={(e) => handleChange("appDescription", e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                placeholder="App description..."
              />
            </div>
          </div>

          {/* Blood Donation Settings */}
          <div className="space-y-4 border-t border-zinc-200 pt-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Blood Donation Rules
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Max Units Per Donation (ml)
                </label>
                <input
                  type="number"
                  value={settings.maxBloodUnitsPerDonation}
                  onChange={(e) =>
                    handleChange("maxBloodUnitsPerDonation", Number(e.target.value))
                  }
                  min="0"
                  className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Donation Interval (days)
                </label>
                <input
                  type="number"
                  value={settings.donationIntervalDays}
                  onChange={(e) =>
                    handleChange("donationIntervalDays", Number(e.target.value))
                  }
                  min="0"
                  className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4 border-t border-zinc-200 pt-6">
            <h2 className="text-lg font-semibold text-zinc-900">Notifications</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleChange("emailNotifications", e.target.checked)
                  }
                  className="h-4 w-4 rounded border border-zinc-300 text-[#d4002a] focus:ring-2 focus:ring-red-100"
                />
                <label
                  htmlFor="emailNotifications"
                  className="text-sm font-medium text-zinc-700"
                >
                  Enable Email Notifications
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={(e) =>
                    handleChange("smsNotifications", e.target.checked)
                  }
                  className="h-4 w-4 rounded border border-zinc-300 text-[#d4002a] focus:ring-2 focus:ring-red-100"
                />
                <label
                  htmlFor="smsNotifications"
                  className="text-sm font-medium text-zinc-700"
                >
                  Enable SMS Notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Button Actions */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-200 pt-6">
          <button
            type="button"
            onClick={() =>
              setSettings({
                appName: "LifeLink",
                appVersion: "1.0.0",
                appDescription: "Blood donation management system",
                maxBloodUnitsPerDonation: 450,
                donationIntervalDays: 90,
                emailNotifications: true,
                smsNotifications: false,
              })
            }
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            disabled={saving}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#d4002a] px-6 py-2 text-sm font-semibold text-white hover:bg-[#b8002a] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
