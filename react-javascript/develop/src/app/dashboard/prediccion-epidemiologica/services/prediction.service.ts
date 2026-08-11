import {
    predictionSummaryMock,
} from "../data/prediction.mock";

import type {
    PredictionSummaryData,
} from "../data/prediction";


/**
 * ============================================================================
 * SERVICIO - PREDICCIÓN EPIDEMIOLÓGICA
 * ============================================================================
 */
export async function getPredictionSummaryData():
    Promise<PredictionSummaryData[]> {

    return Promise.resolve(
        predictionSummaryMock
    );

}