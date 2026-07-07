"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, UserCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {

  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

}, []);

  const titles: Record<string, string> = {
    "/dashboard": "Inicio y Geovisor epidemiológico",
    "/dashboard/perfil": "Perfil",
    "/dashboard/resumen-general": "Resumen general",
    "/dashboard/indicadores-demograficos": "Indicadores demográficos",
    "/dashboard/geovisor-epidemiologico": "Geovisor epidemiológico",
    "/dashboard/reportes": "Reportes y exportación",
    "/dashboard/prediccion-epidemiologica": "Predicción epidemiológica",
    "/dashboard/auditoria": "Auditoría",
    "/dashboard/usuarios": "Gestión de usuarios",
  };

  return (
    <header className="bg-white rounded-[8px] border border-slate-200 px-6 py-4 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {titles[pathname] || "Dashboard"}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Análisis de la distribución de casos de dengue e IRA en general.
        </p>
      </div>

      <div className="relative flex items-center gap-4 text-sm text-slate-600">

  <span className="flex items-center gap-2">
  🧑‍⚕️ {user?.name || "Usuario"}
</span>

  {/* BOTON SETTINGS */}
  <button
    onClick={() => setOpenMenu(!openMenu)}
    className="hover:bg-slate-100 transition p-2 rounded-full"
  >
    <Settings size={18} />
  </button>

  {/* MENU */}
  {openMenu && (

    <div className="absolute top-12 right-0 w-[180px] bg-white border border-slate-200 rounded-[10px] shadow-lg overflow-hidden z-50">

      {/* PERFIL */}
      <button
        onClick={() => {
          router.push("/dashboard/perfil");
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition text-slate-700"
      >

        <UserCircle size={16} />

        Ver perfil

      </button>

      {/* LOGOUT */}
      <button
            onClick={() => {

                localStorage.removeItem("user");

                router.push("/login");

            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition text-slate-700 border-t border-slate-100"
            >

        <LogOut size={16} />

        Cerrar sesión

      </button>

    </div>

  )}

</div>

    </header>
  );
}