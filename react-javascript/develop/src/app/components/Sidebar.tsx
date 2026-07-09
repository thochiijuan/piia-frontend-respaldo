"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const iconVersion = "20260709";

const sidebarIcons = {
  inicio:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Inicio.png",
  perfil:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Perfil.png",
  resumenGeneral:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Datos.png",
  indicadoresDemograficos:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Indicadores%20demograficos.png",
  geovisorEpidemiologico:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Geovisor%20epidemiol%C3%B3gico.png",
  reportes:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Reportes.png",
  prediccionEpidemiologica:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/predicci%C3%B3n%20epidemiol%C3%B3gica.png",
  gestionUsuarios:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Gestion%20de%20usuario.png",
  auditoria:
    "https://s3.dorito-develop.com/corporate-brand-assets/public/iconos/Auditoria.png",
};

function SidebarIcon({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image
      src={`${src}?v=${iconVersion}`}
      alt={alt}
      width={26}
      height={26}
      unoptimized
      className="h-[26px] w-[26px] shrink-0 object-contain"
    />
  );
}

type StoredUser = {
  role?: string;
};

function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as StoredUser;
  } catch {
    return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  const [user] = useState<StoredUser | null>(() => getStoredUser());

  return (
    <aside className="w-[240px] bg-[#001B44] text-white flex flex-col">
      {/* LOGO */}
      <div className="flex flex-col items-center pt-3 pb-0 border-b border-white/10">
        <Image
          src="/logo_omica.png"
          alt="Logo OMICAS"
          width={128}
          height={96}
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
          <SidebarIcon src={sidebarIcons.inicio} alt="Inicio" />

          <span>Inicio</span>
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
              <SidebarIcon src={sidebarIcons.perfil} alt="Perfil" />

              <span>Perfil</span>
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
              <SidebarIcon
                src={sidebarIcons.resumenGeneral}
                alt="Resumen general"
              />

              <span>Resumen general</span>
            </Link>

            <Link
              href="/dashboard/indicadores-demograficos"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/indicadores-demograficos"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <SidebarIcon
                src={sidebarIcons.indicadoresDemograficos}
                alt="Indicadores demográficos"
              />

              <span>Indicadores demográficos</span>
            </Link>

            <Link
              href="/dashboard/geovisor-epidemiologico"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/geovisor-epidemiologico"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <SidebarIcon
                src={sidebarIcons.geovisorEpidemiologico}
                alt="Geovisor epidemiológico"
              />

              <span>Geovisor epidemiológico</span>
            </Link>

            <Link
              href="/dashboard/reportes"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/reportes"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <SidebarIcon
                src={sidebarIcons.reportes}
                alt="Reportes y exportación"
              />

              <span>Reportes y exportación</span>
            </Link>

            <Link
              href="/dashboard/prediccion-epidemiologica"
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                pathname === "/dashboard/prediccion-epidemiologica"
                  ? "bg-[#4F46E5] text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <SidebarIcon
                src={sidebarIcons.prediccionEpidemiologica}
                alt="Predicción epidemiológica"
              />

              <span>Predicción epidemiológica</span>
            </Link>
          </div>
        </div>

        {/* ADMIN */}
        {user?.role === "ADMIN" && (
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
                <SidebarIcon
                  src={sidebarIcons.gestionUsuarios}
                  alt="Gestión de usuarios"
                />

                <span>Gestión usuarios</span>
              </Link>

              <Link
                href="/dashboard/auditoria"
                className={`flex items-center gap-3 px-3 py-2 rounded-[8px] transition ${
                  pathname === "/dashboard/auditoria"
                    ? "bg-[#4F46E5] text-white"
                    : "hover:bg-white/10 text-white"
                }`}
              >
                <SidebarIcon src={sidebarIcons.auditoria} alt="Auditoría" />

                <span>Auditoría</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* FOOTER SIDEBAR */}
      <div className="p-4 border-t border-white/10 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-500"></span>

          <span>Portal de Gestión PIIA</span>
        </div>
      </div>
    </aside>
  );
}
