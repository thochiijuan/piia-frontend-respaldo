"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Settings,
    UserCircle,
    LogOut,
} from "lucide-react";

import DashboardFilters from "../dashboard/resumen-general/DashboardFilters";

import GeovisorFilters from "../dashboard/geovisor-epidemiologico/components/GeovisorFilters";

interface UserData {
    name?: string;
}

export default function Header() {

    const pathname = usePathname();
    const router = useRouter();

    const [openMenu, setOpenMenu] = useState(false);

    const [user, setUser] =
        useState<UserData | null>(null);

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            setUser(
                JSON.parse(storedUser)
            );

        }

    }, []);

    /**
     * ============================================================================
     * TÍTULOS
     * ============================================================================
     */
    const titles: Record<string, string> = {

        "/dashboard":
            "Inicio y Geovisor epidemiológico",

        "/dashboard/perfil":
            "Perfil",

        "/dashboard/resumen-general":
            "Resumen General",

        "/dashboard/indicadores-demograficos":
            "Indicadores demográficos",

        "/dashboard/geovisor-epidemiologico":
            "Geovisor epidemiológico",

        "/dashboard/reportes":
            "Reportes y exportación",

        "/dashboard/prediccion-epidemiologica":
            "Predicción epidemiológica",

        "/dashboard/auditoria":
            "Auditoría",

        "/dashboard/usuarios":
            "Gestión de usuarios",

    };

    /**
     * ============================================================================
     * SUBTÍTULOS
     * ============================================================================
     */
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

    /**
     * ============================================================================
     * FILTROS SEGÚN EL MÓDULO
     * ============================================================================
     */
    const showDashboardFilters =
        pathname === "/dashboard/resumen-general";

    const showGeovisorFilters =
        pathname === "/dashboard/geovisor-epidemiologico";

    return (

        <header
            className="
                flex
                items-center
                justify-between
                gap-6
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-6
                py-5
            "
        >

            {/* ============================================================
                IZQUIERDA
            ============================================================ */}

            <div className="shrink-0">

                <h1 className="text-[32px] font-bold text-slate-800">

                    {titles[pathname] || "Dashboard"}

                </h1>

                <p className="mt-1 text-[15px] text-slate-500">

                    {subtitles[pathname] || ""}

                </p>

            </div>

            {/* ============================================================
                DERECHA
            ============================================================ */}

            <div className="flex min-w-0 flex-1 items-center justify-end gap-6">

                {/* ========================================================
                    FILTROS - RESUMEN GENERAL
                ======================================================== */}

                {showDashboardFilters && (

                    <DashboardFilters />

                )}

                {/* ========================================================
                    FILTROS - GEOVISOR EPIDEMIOLÓGICO
                ======================================================== */}

                {showGeovisorFilters && (

                    <GeovisorFilters />

                )}

                {/* ========================================================
                    USUARIO
                ======================================================== */}

                <div className="relative flex shrink-0 items-center gap-4">

                    <span className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-700">

                        🧑‍⚕️ {user?.name || "Usuario"}

                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setOpenMenu(!openMenu)
                        }
                        className="
                            rounded-full
                            p-2
                            transition
                            hover:bg-slate-100
                        "
                    >

                        <Settings size={18} />

                    </button>

                    {/* ====================================================
                        MENÚ DE USUARIO
                    ==================================================== */}

                    {openMenu && (

                        <div
                            className="
                                absolute
                                right-0
                                top-12
                                z-50
                                w-[190px]
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                shadow-lg
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/dashboard/perfil"
                                    )
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    text-sm
                                    transition
                                    hover:bg-slate-50
                                "
                            >

                                <UserCircle size={16} />

                                Ver perfil

                            </button>

                            <button
                                type="button"
                                onClick={() => {

                                    localStorage.removeItem(
                                        "user"
                                    );

                                    router.push(
                                        "/login"
                                    );

                                }}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    border-t
                                    border-slate-100
                                    px-4
                                    py-3
                                    text-sm
                                    transition
                                    hover:bg-slate-50
                                "
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