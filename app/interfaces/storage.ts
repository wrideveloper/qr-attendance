export interface IStorage<TValue = string> {
	get(key: string): Promise<TValue | null>;
	set(key: string, value: TValue, options?: { ttl?: number }): Promise<void>;
	listKeys(prefix: string): Promise<string[]>;
}
