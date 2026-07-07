"use client";


import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Lock,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {

  try {

    setError("");

    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {

      setError(data.message);

      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    router.push("/dashboard");

  } catch (error) {

    console.error(error);

    setError("Error al iniciar sesión");

  }
};
  return (
    <main className="relative w-full h-screen overflow-hidden bg-white">

      {/* FONDO */}
      <div className="absolute inset-0">

        <Image
          src="/datos-importantes-dengue.jpg"
          alt="Background"
          fill
          priority
          className="object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

      </div>

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 w-full h-6 bg-[#2E6EA6]" />

      {/* LOGOS SUPERIORES */}
      <div className="absolute top-12 left-12 z-10">

        <Image
          src="/LOGO_OMICAS.png"
          alt="OMICAS"
          width={120}
          height={120}
          className="object-contain"
        />

      </div>

      <div className="absolute top-10 right-14 flex items-center gap-10 z-10">

        <Image
          src="/datos-imporantes-dengue.png"
          alt="Ciencias"
          width={120}
          height={120}
          className="object-contain"
        />

        <Image
          src="/sgr.png"
          alt="SGR"
          width={120}
          height={120}
          className="object-contain"
        />

      </div>

      {/* LOGIN CARD */}
      <div className="relative z-20 flex items-center justify-center h-full">

        <div className="w-[430px] bg-white/90 backdrop-blur-sm rounded-[28px] shadow-xl px-8 py-10 border border-white/50">

        {error && (

            <div className="flex flex-col items-center text-center mb-5 -mt-2">

                {/* ICONO */}
                <div className="w-10 h-10 rounded-full bg-[#EEF4FB] flex items-center justify-center mb-2">

                <AlertCircle
                    size={18}
                    strokeWidth={2.5}
                    className="text-[#2F80ED]"
                />

                </div>

                {/* TITULO */}
                <h3 className="text-[#2F80ED] font-semibold text-[15px] mb-1">
                  {error}
                </h3>

                {/* MENSAJE */}
                <p className="text-[#6B7280] text-[13px] leading-[20px] max-w-[320px]">
                La contraseña que ingresaste no coincide con nuestros
                registros. Por favor, inténtalo de nuevo.
                </p>

            </div>

            )}

          {/* USER */}
          <div className="mb-6">

            <label className="block text-[15px] font-semibold text-slate-600 mb-3">
              Usuario / Correo electrónico
            </label>

            <div className="flex items-center border border-slate-200 rounded-full px-4 h-[54px] bg-white">

              <Mail size={18} className="text-[#2E6EA6]" />

              <input
                type="text"
                placeholder="Correo electrónico"
                value={user}
                onChange={(e) => {
                setUser(e.target.value);
                setError("");
                }}
                className="flex-1 ml-3 outline-none text-sm text-slate-700 bg-transparent"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-[15px] font-semibold text-slate-600 mb-3">
              Contraseña
            </label>

            <div className="flex items-center border border-slate-200 rounded-full px-4 h-[54px] bg-white">

              <Lock size={18} className="text-[#2E6EA6]" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 ml-3 outline-none text-sm text-slate-700 bg-transparent"
              />

              <button>
                <EyeOff
                  size={18}
                  className="text-[#2E6EA6]"
                />
              </button>

            </div>

          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-8">

            <button
                onClick={handleLogin}
                className="bg-[#2E6EA6] hover:bg-[#245985] transition text-white font-medium rounded-full px-14 py-3 text-sm shadow-md"
                >
                    
              Ingresar
            </button>

          </div>

          {/* FORGOT */}
          <p className="text-center text-slate-500 text-sm mt-5 font-medium cursor-pointer hover:text-slate-700 transition">
            ¿Olvidaste tu contraseña?
          </p>

        </div>

      </div>

      {/* LOGOS INFERIORES */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-10 flex-wrap justify-center px-10">

        <Image
          src="/logo1.png"
          alt="logo"
          width={100}
          height={50}
          className="object-contain opacity-90"
        />

        <Image
          src="/logo2.png"
          alt="logo"
          width={100}
          height={50}
          className="object-contain opacity-90"
        />

        <Image
          src="/logo3.png"
          alt="logo"
          width={100}
          height={50}
          className="object-contain opacity-90"
        />

        <Image
          src="/logo4.png"
          alt="logo"
          width={120}
          height={50}
          className="object-contain opacity-90"
        />

        <Image
          src="/logo5.png"
          alt="logo"
          width={120}
          height={50}
          className="object-contain opacity-90"
        />

      </div>

    </main>
  );
}