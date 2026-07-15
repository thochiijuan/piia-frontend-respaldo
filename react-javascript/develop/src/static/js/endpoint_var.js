const s3_enpoint = `https://s3.${process.env.APP_HOST}/`
const repository_endpoint = `https://api.${process.env.APP_HOST}/repository`
const georeferencer_endpoint = `https://s3.${process.env.APP_HOST}/georeferencer`

const logos = {
    omicas:
        `s3_enpoint}/corporate-brand-assets/public/omicas_logo_transparente_1.png`,
    omicas_2:
        `${s3_enpoint}/corporate-brand-assets/public/omicas_logo_transparente_1.png`,
    mariaCano:
        `${s3_enpoint}/corporate-brand-assets/public/maria_cano_logo.png`,
    sgr:
        `${s3_enpoint}/corporate-brand-assets/public/SGR.png`,
    clinicaCosta:
        `${s3_enpoint}/corporate-brand-assets/public/clinica_de_la_costa.png`,
    minciencias:
        `${s3_enpoint}/corporate-brand-assets/public/minciencias_logo.png`,
    universidadCauca:
        `${s3_enpoint}/corporate-brand-assets/public/universidad_del_cauca_logo.jpg`,
    hospitalUniversitario:
        `${s3_enpoint}/corporate-brand-assets/public/hospital_universitario_logo.png`,
};
export default logos