export async function createToken(key: string, formId: string) {
	const expiry = Date.now() + 10_000; // 10 seconds
	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM" },
		await crypto.subtle.importKey("raw", new TextEncoder().encode(key), "AES-GCM", false, ["encrypt"]),
		new TextEncoder().encode(`${expiry}`)
	);
	return `${formId}::${encrypted}`;
}

export async function verifyToken(key: string, uid: string) {
	const now = Date.now();
	const decrypted = await crypto.subtle.decrypt(
		{ name: "AES-GCM" },
		await crypto.subtle.importKey("raw", new TextEncoder().encode(key), "AES-GCM", false, ["decrypt"]),
		new TextEncoder().encode(uid)
	);
	const expiry = parseInt(new TextDecoder().decode(decrypted));
	return expiry > now;
}
