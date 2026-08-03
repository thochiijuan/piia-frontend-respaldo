"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

import DashboardFilters from "../dashboard/resumen-general/DashboardFilters";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const titles: Record<string, string> = {
    "/dashboard": "Inicio y Geovisor epidemiológico",
    "/dashboard/perfil": "Perfil",
    "/dashboard/resumen-general": "Resumen General",
    "/dashboard/indicadores-demograficos": "Indicadores demográficos",
    "/dashboard/geovisor-epidemiologico": "Geovisor epidemiológico",
    "/dashboard/reportes": "Reportes y exportación",
    "/dashboard/prediccion-epidemiologica":
      "Predicción epidemiológica",
    "/dashboard/auditoria": "Auditoría",
    "/dashboard/usuarios": "Gestión de usuarios",
  };

  const subtitles: Record<string, string> = {
    "/dashboard":
      "Visualización general del sistema.",

    "/dashboard/perfil":
      "Información del usuario.",

    "/dashboard/resumen-general":
      "Panorama epidemiológico de Dengue e IRA.",

    "/dashboard/indicadores-demograficos":
      "Análisis de la población.",

    "/dashboard/geovisor-epidemiologico":
      "Visualización espacial de los casos.",

    "/dashboard/reportes":
      "Exportación de información.",

    "/dashboard/prediccion-epidemiologica":
      "Modelos predictivos epidemiológicos.",

    "/dashboard/auditoria":
      "Seguimiento de acciones del sistema.",

    "/dashboard/usuarios":
      "Administración de usuarios.",
  };

  const showDashboardFilters =
    pathname === "/dashboard/resumen-general";

  return (
    <header className="bg-white rounded-xl border border-slate-200 px-6 py-4 flex items-center justify-between">

      {/* IZQUIERDA */}

      <div>

        <h1 className="text-[32px] font-bold text-slate-800">

          {titles[pathname] || "Dashboard"}

        </h1>

        <p className="text-[15px] text-slate-500 mt-1">

          {subtitles[pathname] || ""}

        </p>

      </div>

      {/* DERECHA */}

      <div className="flex items-center gap-8">

        {/* SOLO EN RESUMEN GENERAL */}

        {showDashboardFilters && (
          <DashboardFilters />
        )}

        {/* USUARIO */}

        <div className="relative flex items-center gap-4">

          <span className="flex items-center gap-2 text-sm text-slate-700">

            🧑‍⚕️ {user?.name || "Usuario"}

          </span>

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="hover:bg-slate-100 transition p-2 rounded-full"
          >
            <Settings size={18} />
          </button>

          {openMenu && (

            <div className="absolute top-12 right-0 w-[190px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">

              <button
                onClick={() => router.push("/dashboard/perfil")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition"
              >

                <UserCircle size={16} />

                Ver perfil

              </button>

              <button
                onClick={() => {

                  localStorage.removeItem("user");

                  router.push("/login");

                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition border-t border-slate-100"
              >

                <LogOut size={16} />

                Cerrar sesión

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}