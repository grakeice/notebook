/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

interface StorageItem {
	id: string;
	data: unknown;
	createdAt: Date;
	updatedAt: Date;
}

export class StorageService {
	private static instance: StorageService;
	private dbName = "LexicalNotebook";
	private version = 1;
	private storeName = "notes";
	private db: IDBDatabase | null = null;

	static getInstance(): StorageService {
		if (!StorageService.instance) {
			StorageService.instance = new StorageService();
		}
		return StorageService.instance;
	}

	private async initDB(): Promise<IDBDatabase> {
		if (this.db) {
			return this.db;
		}

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);

			request.onerror = () => {
				reject(new Error(`IndexedDB error: ${request.error?.message}`));
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// ストアが存在しない場合のみ作成
				if (!db.objectStoreNames.contains(this.storeName)) {
					const store = db.createObjectStore(this.storeName, {
						keyPath: "id",
					});
					store.createIndex("createdAt", "createdAt", {
						unique: false,
					});
					store.createIndex("updatedAt", "updatedAt", {
						unique: false,
					});
				}
			};
		});
	}

	async save(key: string, data: unknown): Promise<void> {
		const maxRetries = 3;
		try {
			// リトライ機能を追加
			let retryCount = 0;

			while (retryCount < maxRetries) {
				try {
					const db = await this.initDB();

					// 既存アイテムの取得用トランザクション
					const readTransaction = db.transaction(
						[this.storeName],
						"readonly",
					);
					const readStore = readTransaction.objectStore(
						this.storeName,
					);

					const existingItem = await new Promise<StorageItem | null>(
						(resolve) => {
							const request = readStore.get(key);

							request.onsuccess = () => {
								const result = request.result as
									| StorageItem
									| undefined;
								resolve(result || null);
							};

							request.onerror = () => {
								resolve(null); // エラーの場合は新規作成として扱う
							};
						},
					);

					// 書き込み用の新しいトランザクション
					const writeTransaction = db.transaction(
						[this.storeName],
						"readwrite",
					);
					const writeStore = writeTransaction.objectStore(
						this.storeName,
					);

					const now = new Date();
					const item: StorageItem = {
						id: key,
						data,
						createdAt: existingItem ? existingItem.createdAt : now,
						updatedAt: now,
					};

					return new Promise((resolve, reject) => {
						const request = writeStore.put(item);

						request.onsuccess = () => resolve();
						request.onerror = () =>
							reject(
								new Error(
									`Failed to save item: ${request.error?.message}`,
								),
							);

						// トランザクションのエラーハンドリングも追加
						writeTransaction.onerror = () =>
							reject(
								new Error(
									`Transaction failed: ${writeTransaction.error?.message}`,
								),
							);
					});
				} catch (error) {
					retryCount++;
					if (retryCount >= maxRetries) {
						throw error;
					}
					await new Promise((resolve) =>
						setTimeout(resolve, 100 * retryCount),
					);
				}
			}
		} catch (error) {
			console.error("StorageService save error:", error);
			throw new Error(
				`Failed to save after ${maxRetries} attempts: ${error}`,
			);
		}
	}

	async load(key: string): Promise<unknown | null> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readonly");
			const store = transaction.objectStore(this.storeName);

			return new Promise((resolve, reject) => {
				const request = store.get(key);

				request.onsuccess = () => {
					const result = request.result as StorageItem | undefined;
					resolve(result ? result.data : null);
				};

				request.onerror = () =>
					reject(
						new Error(
							`Failed to load item: ${request.error?.message}`,
						),
					);
			});
		} catch (error) {
			console.error("StorageService load error:", error);
			return null;
		}
	}

	async delete(key: string): Promise<void> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readwrite");
			const store = transaction.objectStore(this.storeName);

			return new Promise((resolve, reject) => {
				const request = store.delete(key);

				request.onsuccess = () => resolve();
				request.onerror = () =>
					reject(
						new Error(
							`Failed to delete item: ${request.error?.message}`,
						),
					);
			});
		} catch (error) {
			console.error("StorageService delete error:", error);
			throw error;
		}
	}

	async getAllKeys(): Promise<string[]> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readonly");
			const store = transaction.objectStore(this.storeName);

			return new Promise((resolve, reject) => {
				const request = store.getAllKeys();

				request.onsuccess = () => {
					resolve(request.result as string[]);
				};

				request.onerror = () =>
					reject(
						new Error(
							`Failed to get keys: ${request.error?.message}`,
						),
					);
			});
		} catch (error) {
			console.error("StorageService getAllKeys error:", error);
			return [];
		}
	}

	async getAllItems(): Promise<StorageItem[]> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readonly");
			const store = transaction.objectStore(this.storeName);

			return new Promise((resolve, reject) => {
				const request = store.getAll();

				request.onsuccess = () => {
					resolve(request.result as StorageItem[]);
				};

				request.onerror = () =>
					reject(
						new Error(
							`Failed to get all items: ${request.error?.message}`,
						),
					);
			});
		} catch (error) {
			console.error("StorageService getAllItems error:", error);
			return [];
		}
	}

	async getItemsByDateRange(
		startDate: Date,
		endDate: Date,
	): Promise<StorageItem[]> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readonly");
			const store = transaction.objectStore(this.storeName);
			const index = store.index("updatedAt");

			return new Promise((resolve, reject) => {
				const range = IDBKeyRange.bound(startDate, endDate);
				const request = index.getAll(range);

				request.onsuccess = () => {
					resolve(request.result as StorageItem[]);
				};

				request.onerror = () =>
					reject(
						new Error(
							`Failed to get items by date range: ${request.error?.message}`,
						),
					);
			});
		} catch (error) {
			console.error("StorageService getItemsByDateRange error:", error);
			return [];
		}
	}

	async clear(): Promise<void> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction([this.storeName], "readwrite");
			const store = transaction.objectStore(this.storeName);

			return new Promise((resolve, reject) => {
				const request = store.clear();

				request.onsuccess = () => resolve();
				request.onerror = () =>
					reject(
						new Error(
							`Failed to clear store: ${request.error?.message}`,
						),
					);
			});
		} catch (error) {
			console.error("StorageService clear error:", error);
			throw error;
		}
	}

	async getStorageInfo(): Promise<{
		itemCount: number;
		storageSize: number;
	}> {
		try {
			const items = await this.getAllItems();
			const itemCount = items.length;

			// 概算のストレージサイズを計算
			const storageSize = items.reduce((total, item) => {
				return total + JSON.stringify(item).length;
			}, 0);

			return { itemCount, storageSize };
		} catch (error) {
			console.error("StorageService getStorageInfo error:", error);
			return { itemCount: 0, storageSize: 0 };
		}
	}

	// 接続を閉じる（アプリケーション終了時など）
	close(): void {
		if (this.db) {
			this.db.close();
			this.db = null;
		}
	}
}

export const storageService = StorageService.getInstance();
