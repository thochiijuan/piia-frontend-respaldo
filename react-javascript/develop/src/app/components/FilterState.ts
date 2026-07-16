export interface FilterStatus {
    filterPanel: {
        FilterPanelDengueComponent: {
            departamento: string;
            municipio: string;
            anio: string;
            semana: string;
            eventos: {
                dengue: boolean;
                ira: boolean;
            };
            capas: {
                nivelesRiesgo: boolean;
                casos: boolean;
            };
        }
    };
}

export const initialFilterStats: FilterStatus = {
    filterPanel: {
        FilterPanelDengueComponent: {
            departamento: "",
            municipio: "",
            anio: "",
            semana: "",
            eventos: {
                dengue: true,
                ira: true,
            },
            capas: {
                nivelesRiesgo: true,
                casos: true
            },
        }
    },
}

