/**
 * ============================================================================
 * DEMOGRAPHIC SUMMARY
 * ----------------------------------------------------------------------------
 * Modelos correspondientes a las tarjetas superiores del módulo
 * Indicadores Demográficos.
 *
 * Estas interfaces definen el contrato entre el Backend y el Frontend.
 * ============================================================================
 */

/**
 * Representa una tarjeta KPI del módulo.
 */
export interface DemographicCard {

    /**
     * Identificador único.
     * Facilita localizar la tarjeta desde el Backend.
     */
    id: string;

    /**
     * Nombre del indicador.
     */
    title: string;

    /**
     * Valor principal.
     */
    value: string | number;

    /**
     * Texto descriptivo.
     */
    description: string;

    /**
     * Color institucional asociado al indicador.
     */
    color: string;

    /**
     * Nombre del icono enviado por la API.
     *
     * Ejemplo:
     * users
     * baby
     * accessibility
     * venus-mars
     * chart
     */
    icon: string;

}

/**
 * Conjunto de indicadores superiores.
 */
export interface DemographicSummary {

    cards: DemographicCard[];

}