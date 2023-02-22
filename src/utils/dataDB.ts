export default class IDB<T> {
    private db: IDBDatabase | null = null;

    constructor(private readonly dbName: string, private readonly storeName: string, private readonly version: number, private readonly keyPath?: keyof T & string) {}

    private async _open(): Promise<IDBDatabase> {
        if (this.db) return Promise.resolve(this.db);
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = (event) => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    let store = db.createObjectStore(this.storeName, {
                        keyPath: this.keyPath ?? undefined,
                    });

                    store.createIndex("", "");
                }
                this.db = db;
            };
            request.onsuccess = (event) => {
                this.db = request.result;
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(request.error);
            };
        });
    }

    private async _onRequestComplete<R>(request: IDBRequest<R>): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(request.error);
            };
        });
    }

    async add(item: T): Promise<IDBValidKey> {
        const db = await this._open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.add(item);
        return await this._onRequestComplete(request);
    }

    async put(item: T): Promise<IDBValidKey> {
        const db = await this._open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.put(item);
        return await this._onRequestComplete(request);
    }

    async delete(id: IDBValidKey): Promise<void> {
        const db = await this._open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
        await this._onRequestComplete(request);
    }

    async update(id: IDBValidKey, changes: Partial<T>): Promise<void> {
        const db = await this._open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const existing = await this._onRequestComplete(store.get(id));
        if (existing) {
            const updated = { ...existing, ...changes, id };
            await this._onRequestComplete(store.put(updated));
        }
    }

    async getAll(): Promise<T[]> {
        const db = await this._open();
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        return await this._onRequestComplete(request);
    }
}
