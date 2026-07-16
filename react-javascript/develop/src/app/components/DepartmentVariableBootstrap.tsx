"use client";

import { useEffect } from "react";

import {
    ensureDepartmentVariableStored,
} from "../../static/js/department_variable_storage";

export default function DepartmentVariableBootstrap() {
    useEffect(() => {
        let componentMounted = true;

        const initializeDepartmentVariable = async () => {
            try {
                const storedFile =
                    await ensureDepartmentVariableStored();

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

        initializeDepartmentVariable();

        return () => {
            componentMounted = false;
        };
    }, []);

    return null;
}