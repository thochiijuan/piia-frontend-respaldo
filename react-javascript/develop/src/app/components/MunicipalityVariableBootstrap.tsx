"use client";

import { useEffect } from "react";

import {
    ensureMUNICIPALITYVariableStored,
} from "../../static/js/municipality_variable_storage";

export default function MunicipalityVariableBootstrap() {
    useEffect(() => {
        let componentMounted = true;

        const initializeMunicipalityVariable = async () => {
            try {
                const storedFile =
                    await ensureMUNICIPALITYVariableStored();

                if (!componentMounted) {
                    return;
                }

                console.log(
                    "Archivo geográfico disponible:",
                    storedFile.name,
                    storedFile.size
                );
            } catch (error) {
                console.error(
                    "No se pudo inicializar DepartmentVariable:",
                    error
                );
            }
        };

        initializeMunicipalityVariable();

        return () => {
            componentMounted = false;
        };
    }, []);

    return null;
}