export default class LocalStorageService {
	static setItem(key: string, value: any): void {
		if (value === undefined || value === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	static getItem<T>(key: string): T | undefined;
	static getItem<T>(key: string, defaultValue: T): T;
	static getItem<T>(key: string, defaultValue?: T) {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			return defaultValue;
		}
	}

	static removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	static clear(): void {
		localStorage.clear();
	}
}
