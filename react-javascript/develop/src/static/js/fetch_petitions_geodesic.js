import { endpoints } from "./endpoint_var";

export async function getDepartamentos() {
    const url =
        `${endpoints.georeferencer_endpoint}/api/v1/DepartmentVariable/get-name-and-id/`;

    console.log("URL departamentos:", url);

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
            `Error obteniendo departamentos: ${response.status} - ${responseText}`
        );
    }

    return response.json();
}

export async function getMunicipiosPorDepartamento(id) {
    if (!id) {
        throw new Error("Departamento no seleccionado");
    }

    const url =
        `${endpoints.georeferencer_endpoint}/api/v1/MunicipalityVariable/get-name-and-id/?DepartmentVariable=${id}`;

    console.log("URL municipios:", url);

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
            `Error obteniendo municipios: ${response.status} - ${responseText}`
        );
    }

    return response.json();
}

