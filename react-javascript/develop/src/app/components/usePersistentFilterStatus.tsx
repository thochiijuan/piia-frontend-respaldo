"use client";

import { useEffect, useState } from "react";

import type { Dispatch, SetStateAction } from "react";
import type { FilterStatus } from "./FilterState";

const STORAGE_KEY = "piia_filter_status";

interface PersistentFilterStatus {
    statusDict: FilterStatus;
    setStatusDict: Dispatch<SetStateAction<FilterStatus>>;
    statusLoaded: boolean;
}

export function usePersistentFilterStatus(
    initialStatus: FilterStatus
): PersistentFilterStatus {
    const [statusDict, setStatusDict] =
        useState < FilterStatus > (initialStatus);

    const [statusLoaded, setStatusLoaded] =
        useState(false);

    useEffect(() => {
        try {
            const storedStatus =
                localStorage.getItem(STORAGE_KEY);

            if (storedStatus) {
                const parsedStatus =
                    JSON.parse(storedStatus) as Partial<FilterStatus>;

                setStatusDict((previousStatus) => ({
                    ...previousStatus,
                    ...parsedStatus,

                    filterPanel: {
                        ...previousStatus.filterPanel,
                        ...parsedStatus.filterPanel,
                    },
                }));
            }
        } catch (error) {
            console.error(
                "No se pudo cargar el estado de los filtros:",
                error
            );

            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setStatusLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!statusLoaded) {
            return;
        }

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(statusDict)
            );
        } catch (error) {
            console.error(
                "No se pudo guardar el estado de los filtros:",
                error
            );
        }
    }, [statusDict, statusLoaded]);

    return {
        statusDict,
        setStatusDict,
        statusLoaded,
    };
}