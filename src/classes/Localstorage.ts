import Observable from './Observable';

export class Localstorage {
	private readonly _observer: Observable<string | null>;

	constructor() {
		this._observer = new Observable();
		Object.seal(this);
	}

	clear(...keys: string[]): void {
		if (Array.isArray(keys) && keys.length > 0) {
			const itemKeys = Object.keys(localStorage);
			itemKeys.forEach((key) => {
				if (keys.includes(key)) localStorage.removeItem(key);
			});
		} else {
			localStorage.clear();
		}
	}

	get<T extends string | unknown>(name: string, defaultValue: T, validation?: (value: T) => boolean): T {
		try {
			const result: T | string | undefined = localStorage.getItem(name) ?? undefined;
			const isString = typeof result === 'string';

			if (!isString) return defaultValue;

			try {
				const jsonValue = JSON.parse(result) as T;
				if (validation) {
					if (validation(jsonValue)) return jsonValue;
				}
			} catch (e) {
				if (validation) {
					if (validation(result as T)) return result as T;
				}
			}
		} catch (e) {
			//
		}

		return defaultValue;
	}

	has(name: string): boolean {
		const result = localStorage.getItem(name);
		return typeof result === 'string';
	}

	remove(name: string): void {
		localStorage.removeItem(name);
		this._observer.notify(name, null);
	}

	set(name: string, value: string | number | unknown, notify = false): string {
		if (typeof value !== 'string') {
			if (typeof value === 'number') value = String(value);
			else value = JSON.stringify(value);
		}

		localStorage.setItem(name, value as string);
		if (notify) this._observer.notify(name, value as string);

		return value as string;
	}

	addEventListener(name: string, cb: (value: string | null) => void) {
		this._observer.subscribe(name, cb);
	}
}

const LocalstorageInstance = new Localstorage();

export default LocalstorageInstance;
