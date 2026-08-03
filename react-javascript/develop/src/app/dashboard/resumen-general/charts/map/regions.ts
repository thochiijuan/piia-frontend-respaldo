/**
 * ============================================================================
 * regions.ts
 * ----------------------------------------------------------------------------
 * Modelo de información de las regiones naturales de Colombia utilizado por
 * el Dashboard y el Geovisor Epidemiológico.
 *
 * Responsabilidades:
 * - Definir las regiones naturales.
 * - Asociar departamentos a cada región.
 * - Centralizar colores e información resumida.
 * - Proporcionar funciones auxiliares para consultar regiones.
 *
 * Este archivo actúa como una capa de configuración geográfica del sistema.
 *
 * Actualmente contiene datos simulados.
 * En producción los indicadores (casos y porcentajes) serán reemplazados por
 * información proveniente del backend.
 * ============================================================================
 */


/**
 * Representa la información asociada a una región natural.
 */
export interface RegionInfo {

    /** Nombre mostrado al usuario */
    name: string;

    /** Color utilizado en el mapa y la leyenda */
    color: string;

    /** Departamentos que pertenecen a la región */
    departments: string[];

    /** Número de casos reportados */
    cases: number;

    /** Participación porcentual respecto al total */
    percentage: number;
}

/**
 * Configuración de las regiones naturales de Colombia.
 *
 * Cada región contiene toda la información necesaria para
 * representarse visualmente dentro del Dashboard.
 */
export const REGIONS: Record<string, RegionInfo> = {


    /**
     * Valores simulados.
     *
     * Estos campos serán actualizados dinámicamente
     * cuando exista la integración con la API.
     */
    Caribe: {
        name: "Región Caribe",
        color: "#F5B63A",
        cases: 4562,
        percentage: 28.8,
        departments: [
            "Atlántico",
            "Bolívar",
            "Cesar",
            "Córdoba",
            "La Guajira",
            "Magdalena",
            "Sucre",
            "San Andrés y Providencia"
        ]
    },

    Andina: {
        name: "Región Andina",
        color: "#D78A4D",
        cases: 2141,
        percentage: 13.5,
        departments: [
            "Antioquia",
            "Boyacá",
            "Caldas",
            "Cundinamarca",
            "Huila",
            "Norte de Santander",
            "Quindío",
            "Risaralda",
            "Santander",
            "Tolima",
            "Bogotá D.C."
        ]
    },

    Pacífica: {
        name: "Región Pacífica",
        color: "#7F8FC7",
        cases: 1672,
        percentage: 10.6,
        departments: [
            "Chocó",
            "Valle del Cauca",
            "Cauca",
            "Nariño"
        ]
    },

    Amazonía: {
        name: "Región Amazonía",
        color: "#58A66B",
        cases: 3642,
        percentage: 23,
        departments: [
            "Amazonas",
            "Caquetá",
            "Guainía",
            "Guaviare",
            "Putumayo",
            "Vaupés"
        ]
    },

    Orinoquía: {
        name: "Región Orinoquía",
        color: "#B7D45A",
        cases: 3825,
        percentage: 24.1,
        departments: [
            "Arauca",
            "Casanare",
            "Meta",
            "Vichada"
        ]
    }

};

/**
 * Obtiene la región natural a la que pertenece un departamento.
 *
 * @param department Nombre del departamento.
 *
 * @returns
 * Información de la región encontrada o null si el departamento
 * no pertenece a ninguna región registrada.
 */
export function getRegionByDepartment(department: string) {

    return Object.values(REGIONS).find(region =>
        region.departments.includes(department)
    );

}