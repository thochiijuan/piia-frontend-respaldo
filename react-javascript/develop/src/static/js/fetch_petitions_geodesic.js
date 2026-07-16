import { endpoints } from "./endpoint_var";

export default async function getDepartamentos() {
    const url =
        `${endpoints.georeferencer_endpoint}/api/v1/DepartmentVariable/get-name-and-id/`;

    console.log("URL departamentos:", url);

    const response = await fetch(url, {
        method: "GET",
    });
    console.log(response)
    if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
            `Error obteniendo departamentos: ${response.status} - ${responseText}`
        );
    }

    return response.json();
}