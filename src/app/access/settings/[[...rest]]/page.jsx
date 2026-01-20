import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black mb-6">Account_Settings</h2>
      <div className="bg-gray-50 border border-black/10 p-8">
        <UserProfile path="/access/settings" routing="path" />
      </div>
    </div>
  );
}
