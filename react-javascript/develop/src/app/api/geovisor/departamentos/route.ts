/**
 * ============================================================================
 * API INTERNA - DEPARTAMENTOS DE COLOMBIA
 * ----------------------------------------------------------------------------
 * Obtiene los límites departamentales oficiales desde DANE - DIVIPOLA 2025.
 * ============================================================================
 */

const DANE_DEPARTMENTS_URL =
    "https://geoportal.dane.gov.co/mparcgis/rest/services/Divipola/Serv_DIVIPOLA_MGN_2025/FeatureServer/319/query";

export async function GET() {

    try {

        const params = new URLSearchParams({

            where: "1=1",

            outFields:
                "DPTO_CCDGO,DPTO_CNMBRE",

            returnGeometry:
                "true",

            outSR:
                "4326",

            returnZ:
                "false",

            returnM:
                "false",

            returnTrueCurves:
                "false",

            f:
                "geojson",

        });

        const url =
            `${DANE_DEPARTMENTS_URL}?${params.toString()}`;

        console.log(
            "Consultando límites departamentales DANE:",
            url
        );

        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Accept:
                            "application/geo+json, application/json",
                    },
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Error DANE:",
                response.status,
                errorText
            );

            return Response.json(
                {
                    error:
                        "No fue posible consultar los límites departamentales.",
                },
                {
                    status: 502,
                }
            );

        }

        const geoJson =
            await response.json();

        return Response.json(
            geoJson,
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "Error obteniendo departamentos:",
            error
        );

        return Response.json(
            {
                error:
                    "Error interno obteniendo los departamentos.",
            },
            {
                status: 500,
            }
        );

    }

}