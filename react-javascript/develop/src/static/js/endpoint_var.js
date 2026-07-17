const appHost = process.env.NEXT_PUBLIC_APP_HOST;

const s3_endpoint = `https://s3.${appHost}`;
const repository_endpoint = `https://api.${appHost}/repository`;
const georeferencer_endpoint = `https://api.${appHost}/georeferencer`;

export const logos = {
    omicas:
        `${s3_endpoint}/corporate-brand-assets/public/omicas_logo_transparente_1.png`,
    mariaCano:
        `${s3_endpoint}/corporate-brand-assets/public/maria_cano_logo.png`,
    sgr:
        `${s3_endpoint}/corporate-brand-assets/public/SGR.png`,
    clinicaCosta:
        `${s3_endpoint}/corporate-brand-assets/public/clinica_de_la_costa.png`,
    minciencias:
        `${s3_endpoint}/corporate-brand-assets/public/minciencias_logo.png`,
    universidadCauca:
        `${s3_endpoint}/corporate-brand-assets/public/universidad_del_cauca_logo.jpg`,
    hospitalUniversitario:
        `${s3_endpoint}/corporate-brand-assets/public/hospital_universitario_logo.png`,
    omicasLogoBlanco:
        `${s3_endpoint}/corporate-brand-assets/public/omicas_logo_blanco.png`,
};

export const iconos = {
    inicio:
        `${s3_endpoint}/corporate-brand-assets/public/iconos/Inicio.png?v=20260709`,
};

export const endpoints = {
    s3_endpoint,
    repository_endpoint,
    georeferencer_endpoint,
};

export const departmentsIDs = [3, 8, 13, 17, 30]
export const departmentsColors = ["#E71224", "#00A0D7", "#66CC00", "#FFC114", "#AB008B"]