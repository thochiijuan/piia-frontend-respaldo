"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {

  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);

useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

}, []);

  return (

    <aside className="w-[240px] bg-[#001B44] text-white flex flex-col">

      {/* LOGO */}
      <div className="flex flex-col items-center pt-3 pb-0 border-b border-white/10">

        <img
          src="/logo_omica.png"
          alt="Logo OMICAS"
          className="w-32 h-auto object-contain"
        />

      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">

        {/* INICIO */}
        <Link
          href="/dashboard"
          className={`w-full flex items-center gap-3 text-sm mb-8 px-4 py-3 rounded-[8px] transition ${
            pathname === "/dashboard"
              ? "bg-[#4F46E5] text-white"
              : "hover:bg-[#4338CA] text-white"
          }`}
        >
          🏠 Inicio
        </Link>

        {/* GESTIÓN */}
        <div className="mb-8">

          <p className="text-[11px] uppercase text-slate-500 font-semibold mb-3 tracking-[1.5px]">
            Gestión de usuario
          </p>

          <div className="flex flex-col gap-2">

            <Link
              href="/dashboard/perfil"
              className={`flex items-center gap-3 text-sm px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/perfil"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              👤 Perfil
            </Link>

          </div>

        </div>

        {/* ANÁLISIS */}
        <div className="mb-8">

          <p className="text-[11px] uppercase text-slate-500 font-semibold mb-3 tracking-[1.5px]">
            Análisis
          </p>

          <div className="flex flex-col gap-2 text-sm">

            <Link
              href="/dashboard/resumen-general"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/resumen-general"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              📊 Resumen general
            </Link>

            <Link
              href="/dashboard/indicadores-demograficos"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/indicadores-demograficos"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              🧬 Indicadores demográficos
            </Link>

            <Link
              href="/dashboard/geovisor-epidemiologico"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/geovisor-epidemiologico"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              🗺️ Geovisor epidemiológico
            </Link>

            <Link
              href="/dashboard/reportes"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/reportes"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              📄 Reportes y exportación
            </Link>

            <Link
              href="/dashboard/prediccion-epidemiologica"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/prediccion-epidemiologica"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              📈 Predicción epidemiológica
            </Link>

          </div>

        </div>

        {/* ADMIN */}
        {
          user?.role === "ADMIN" && (

            <div className="mb-8">

              <p className="text-[11px] uppercase text-slate-500 font-semibold mb-3 tracking-[1.5px]">
                Administración
              </p>

              <div className="flex flex-col gap-2 text-sm">

                <Link
                  href="/dashboard/usuarios"
                  className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                    pathname === "/dashboard/usuarios"
                      ? "bg-[#4F46E5] text-white"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  👥 Gestión usuarios
                </Link>

                <Link
                  href="/dashboard/auditoria"
                  className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                    pathname === "/dashboard/auditoria"
                      ? "bg-[#4F46E5] text-white"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  📋 Auditoría
                </Link>

              </div>

            </div>

          )
        }

      </nav>

      {/* FOOTER SIDEBAR */}
        <div className="p-4 border-t border-white/10 text-xs text-slate-400">

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-slate-500"></span>

            <span>
              Portal de Gestión PIIA
            </span>

          </div>

        </div>

      </aside>

    );
  }