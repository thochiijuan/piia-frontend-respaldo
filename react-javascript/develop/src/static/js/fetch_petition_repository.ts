import {
    endpoints
} from "./endpoint_var";

export interface CatalogNode {
    _key: string;
    _id?: string;
    name: string;
    type: string;
    slug?: string;
    description?: string | null;
    parent_key?: string | null;
    path?: string;
    depth?: number;
    metadata?: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
}

export interface RepositoryAsset {
    _key: string;
    _id?: string;
    name: string;
    kind: string;
    slug?: string;
    description?: string | null;
    primary_node_key?: string;
    asset_path?: string;
    tags?: string[];
    status?: string;
    visibility?: string;
    current_version_key?: string | null;
    logical_metadata?: Record<string, unknown>;
}

const repository_endpoint = endpoints.repository_endpoint

const REPOSITORY_BASE_URL = String(
    repository_endpoint
).replace(/\/+$/, "");

function extractList<T>(
    payload: unknown
): T[] {
    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (
        typeof payload !== "object" ||
        payload === null
    ) {
        return [];
    }

    const record =
        payload as Record<string, unknown>;

    const possibleKeys = [
        "items",
        "results",
        "data",
        "nodes",
        "assets",
    ];

    for (const key of possibleKeys) {
        const value = record[key];

        if (Array.isArray(value)) {
            return value as T[];
        }
    }

    return [];
}

async function getJsonList<T>(
    url: string,
    signal?: AbortSignal
): Promise<T[]> {
    console.log(url)
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal,
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        let detail = "";

        try {
            const errorBody =
                await response.json();

            if (
                typeof errorBody?.detail ===
                "string"
            ) {
                detail = errorBody.detail;
            } else if (
                typeof errorBody?.message ===
                "string"
            ) {
                detail = errorBody.message;
            }
        } catch {
            detail = "";
        }

        throw new Error(
            detail ||
            `Error ${response.status}: ${response.statusText}`
        );
    }

    const payload: unknown =
        await response.json();

    return extractList<T>(payload);
}

/*
 * Obtiene únicamente los nodos raíz.
 */
export function getRootCatalogNodes(
    signal?: AbortSignal
): Promise<CatalogNode[]> {
    const query = new URLSearchParams({
        root_only: "true",
        limit: "100",
        offset: "0",
    });

    return getJsonList<CatalogNode>(
        `${REPOSITORY_BASE_URL}/catalog-nodes?${query}`,
        signal
    );
}

/*
 * Obtiene solamente los hijos directos
 * de la carpeta seleccionada.
 */
export function getCatalogNodeChildren(
    nodeKey: string,
    signal?: AbortSignal
): Promise<CatalogNode[]> {
    const query = new URLSearchParams({
        limit: "100",
        offset: "0",
    });

    return getJsonList<CatalogNode>(
        `${REPOSITORY_BASE_URL}/catalog-nodes/${encodeURIComponent(
            nodeKey
        )}/children?${query}`,
        signal
    );
}

/*
 * Obtiene los assets contenidos directamente
 * en el nodo seleccionado.
 */
export function getAssetsByCatalogNode(
    nodeKey: string,
    signal?: AbortSignal
): Promise<RepositoryAsset[]> {
    const query = new URLSearchParams({
        include_linked: "false",
        limit: "100",
        offset: "0",
    });

    return getJsonList<RepositoryAsset>(
        `${REPOSITORY_BASE_URL}/assets/by-node/${encodeURIComponent(
            nodeKey
        )}?${query}`,
        signal
    );
}