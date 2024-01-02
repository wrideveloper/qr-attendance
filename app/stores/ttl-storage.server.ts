import TTLCache from "@isaacs/ttlcache";
import type { IStorage } from "~/interfaces/storage";
import type { Attendance } from "~/schema/attendance";

class TTLStorage implements IStorage<Attendance> {
	private readonly storage: TTLCache<string, Attendance>;
	constructor() {
		this.storage = new TTLCache<string, Attendance>();
	}

	get(key: string): Promise<Attendance | null> {
		return Promise.resolve(this.storage.get(key) ?? null);
	}
	set(key: string, value: Attendance, options?: { ttl?: number | undefined } | undefined): Promise<void> {
		this.storage.set(key, value, options);
		return Promise.resolve();
	}
	listKeys(prefix: string): Promise<string[]> {
		const result: string[] = [];
		for (const key of this.storage.keys()) {
			if (key.startsWith(prefix)) {
				result.push(key);
			}
		}
		return Promise.resolve(result);
	}
}

export const ttlStorage = new TTLStorage();
