import {
    Users,
    Baby,
    PersonStanding,
    VenusAndMars,
    ChartNoAxesCombined,
} from "lucide-react";

/**
 * ============================================================================
 * MAPA DE ICONOS
 * ----------------------------------------------------------------------------
 * Convierte el nombre del icono enviado por el Backend en un componente
 * de Lucide React.
 *
 * Ejemplo:
 *
 * API:
 * {
 *    "icon": "users"
 * }
 *
 * Frontend:
 * <Users />
 * ============================================================================
 */

export const demographicIcons = {

    users: Users,

    baby: Baby,

    personStanding: PersonStanding,

    venusMars: VenusAndMars,

    chart: ChartNoAxesCombined,

};