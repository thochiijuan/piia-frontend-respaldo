import {

    AgeGroupData,

    GenderData,

    LifeCycleData,

} from "./demographicCharts";

/**
 * ============================================================================
 * MOCK - GRÁFICOS DEMOGRÁFICOS
 * ============================================================================
 */

export const ageGroupMock: AgeGroupData[] = [

    {

        ageGroup: "<1 Año",

        dengue: 45,

        ira: 37,

    },

    {

        ageGroup: "1 a 4",

        dengue: 27,

        ira: 30,

    },

    {

        ageGroup: "5 a 9",

        dengue: 30,

        ira: 56,

    },

    {

        ageGroup: "10 a 14",

        dengue: 27,

        ira: 35,

    },

    {

        ageGroup: "15 a 19",

        dengue: 34,

        ira: 67,

    },

    {

        ageGroup: "20 a 29",

        dengue: 34,

        ira: 23,

    },

    {

        ageGroup: "30 a 39",

        dengue: 34,

        ira: 21,

    },

    {

        ageGroup: "40 a 49",

        dengue: 24,

        ira: 45,

    },

    {

        ageGroup: "50 a 59",

        dengue: 34,

        ira: 33,

    },

    {

        ageGroup: "60 años y más",

        dengue: 32,

        ira: 45,

    },

];

export const genderMock: GenderData[] = [

    {

        gender: "Masculino",

        cases: 58,

    },

    {

        gender: "Femenino",

        cases: 42,

    },

];

export const lifeCycleMock: LifeCycleData[] = [

    {

        stage: "Primera infancia",

        dengue: 1245,

        ira: 1976,

    },

    {

        stage: "Infancia",

        dengue: 1102,

        ira: 3167,

    },

    {

        stage: "Adolescencia",

        dengue: 1239,

        ira: 1788,

    },

    {

        stage: "Juventud",

        dengue: 2145,

        ira: 2356,

    },

    {

        stage: "Adulto",

        dengue: 3200,

        ira: 3987,

    },

    {

        stage: "Adulto Mayor",

        dengue: 1899,

        ira: 2489,

    },

];