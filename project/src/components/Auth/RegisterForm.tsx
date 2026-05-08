import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Loader } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

type UserRole = "restaurant" | "society" | "ngo";

export default function RegisterForm({ onSwitchToLogin, onClose }: RegisterFormProps) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "restaurant" as UserRole,
    address: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    const ok = await register({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      address: form.address,
      lat: 0,
      lng: 0,
      password: form.password,
    });
    setLoading(false);

    if (!ok) return setError("Registration failed. Try another email.");

    onClose();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-2">
        {(["restaurant", "society", "ngo"] as UserRole[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setForm({ ...form, role })}
            className={`px-3 py-2 rounded border ${
              form.role === role ? "bg-green-100 border-green-500" : ""
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <input className="w-full border p-3 rounded" name="full_name" placeholder="Organization Name"
        value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />

      <input className="w-full border p-3 rounded" name="phone" placeholder="Phone"
        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />

      <input className="w-full border p-3 rounded" name="email" type="email" placeholder="Email"
        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

      <input className="w-full border p-3 rounded" name="address" placeholder="Address"
        value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />

      <input className="w-full border p-3 rounded" type="password" placeholder="Password"
        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />

      <input className="w-full border p-3 rounded" type="password" placeholder="Confirm Password"
        value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />

      <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded">
        {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Create Account"}
      </button>
    </form>
  );
}
