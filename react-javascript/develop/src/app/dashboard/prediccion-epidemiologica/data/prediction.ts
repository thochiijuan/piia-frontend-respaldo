/**
 * ============================================================================
 * TIPOS - PREDICCIÓN EPIDEMIOLÓGICA
 * ============================================================================
 */

export type PredictionSummaryTheme =
    | "red"
    | "blue"
    | "purple"
    | "orange"
    | "cyan"
    | "green";


export type PredictionSummaryType =
    | "risk"
    | "observed"
    | "expected"
    | "municipalities"
    | "climate"
    | "confidence";


export type ClimateVariable =
    | "temperature"
    | "rain"
    | "humidity";


export interface PredictionSummaryData {

    id: string;

    title: string;

    value: string | number;

    description: string;

    theme: PredictionSummaryTheme;

    type: PredictionSummaryType;

    /**
     * Minigráfica para algunas tarjetas.
     */
    trend?: number[];

    /**
     * Porcentaje de confianza del modelo.
     */
    confidence?: number;

    /**
     * Variables climáticas críticas.
     */
    climateVariables?: ClimateVariable[];

}