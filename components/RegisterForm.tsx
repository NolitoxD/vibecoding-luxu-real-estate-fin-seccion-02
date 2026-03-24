"use client";

import { useState } from "react";
import { registerUser } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const res = await registerUser(email, password);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-display bg-[#EEF6F6] min-h-screen flex items-center justify-center p-4 antialiased text-[#19322F] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D9ECC8]/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#006655]/10 rounded-full blur-3xl"></div>
      </div>

      <main className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#006655] rounded-xl mb-6 shadow-soft text-white">
            <span className="material-icons text-3xl font-material-icons">
              person_add
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#19322F] mb-2">
            Crear cuenta
          </h1>
          <p className="text-[#19322F]/60">
            Regístrate para acceder a LuxeEstate
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)] p-8 sm:p-10 w-full border border-gray-100 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-[#006655] focus:border-[#006655]"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-[#006655] focus:border-[#006655]"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#006655] text-white rounded-lg font-medium hover:bg-[#004d40] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#19322F]/70">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#006655] hover:text-[#004d40] transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
