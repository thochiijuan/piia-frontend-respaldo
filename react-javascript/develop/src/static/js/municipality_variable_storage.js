const DATABASE_NAME = "piia_georeferencer";
const DATABASE_VERSION = 1;
const FILE_STORE = "downloaded_files";

const MUNICIPALITY_FILE_NAME = "MunicipalityVariable.zip";
const MUNICIPALITY_FILE_URL =
    "https://api.dorito-develop.com/georeferencer/media/MunicipalityVariable/data.zip";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(
            DATABASE_NAME,
            DATABASE_VERSION
        );

        request.onupgradeneeded = () => {
            const database = request.result;

            if (!database.objectStoreNames.contains(FILE_STORE)) {
                database.createObjectStore(FILE_STORE, {
                    keyPath: "name",
                });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export async function getStoredFile(name) {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            FILE_STORE,
            "readonly"
        );

        const store = transaction.objectStore(FILE_STORE);
        const request = store.get(name);

        request.onsuccess = () => {
            resolve(request.result ?? null);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            database.close();
        };
    });
}

export async function saveFile(name, blob) {
    const database = await openDatabase();

    const record = {
        name,
        blob,
        size: blob.size,
        contentType: blob.type,
        downloadedAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            FILE_STORE,
            "readwrite"
        );

        const store = transaction.objectStore(FILE_STORE);
        store.put(record);

        transaction.oncomplete = () => {
            database.close();
            resolve(record);
        };

        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
}

export async function ensureMUNICIPALITYVariableStored({
    forceDownload = false,
} = {}) {
    if (!forceDownload) {
        const storedFile = await getStoredFile(
            MUNICIPALITY_FILE_NAME
        );

        if (storedFile) {
            console.log(
                "MunicipalityVariable cargado desde IndexedDB:",
                storedFile
            );

            return storedFile;
        }
    }

    console.log("Descargando MunicipalityVariable.zip...");

    const response = await fetch(MUNICIPALITY_FILE_URL, {
        method: "GET",

        // Como IndexedDB controla la caché, evitamos depender
        // de la caché HTTP cuando realmente se descarga.
        cache: "no-store",
    });

    if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
            `Error descargando MUNICIPALITYVariable.zip: ` +
            `${response.status} - ${responseText}`
        );
    }

    const blob = await response.blob();

    const storedFile = await saveFile(
        MUNICIPALITY_FILE_NAME,
        blob
    );

    console.log(
        "MUNICIPALITYVariable.zip guardado en IndexedDB:",
        storedFile
    );

    return storedFile;
}