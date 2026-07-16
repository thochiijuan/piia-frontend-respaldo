export interface FilterStatus {
    filterPanel: {
        departamento: string;
        municipio: string;
        FilterPanelDengueComponent: {
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

export const initialFilterStatus: FilterStatus = {
    filterPanel: {
        departamento: "",
        municipio: "",
        FilterPanelDengueComponent: {
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

