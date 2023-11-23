async function generateKey(key: string) {
	return crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(key),
		{
			name: "AES-GCM",
			length: 256,
		},
		true,
		["encrypt", "decrypt"]
	);
}

async function generateIv() {
	return crypto.getRandomValues(new Uint8Array(12));
}

function arrayBufferToHexString(buffer: ArrayBuffer) {
	return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexStringToArrayBuffer(hex: string) {
	const length = hex.length / 2;
	const arrayBuffer = new ArrayBuffer(length);
	const uint8Array = new Uint8Array(arrayBuffer);

	for (let i = 0; i < length; i++) {
		uint8Array[i] = parseInt(hex.substr(i * 2, 2), 16);
	}

	return arrayBuffer;
}

/**
 * Creates a token that can be used to verify if an attendance is valid
 * @param key 256 bytes long
 * @param formId form id
 * @returns encrypted token in a format of `formId::encryptedString::iv`
 */
export async function createToken(key: string, formId: string) {
	const expiry = Date.now() + 10_000; // 10 seconds
	const expiryBytes = new TextEncoder().encode(`${expiry}`);
	const encryptionKey = await generateKey(key);
	const iv = await generateIv();
	const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", length: 256, iv }, encryptionKey, expiryBytes);
	const encryptedString = arrayBufferToHexString(encrypted);
	const ivString = arrayBufferToHexString(iv);
	return `${formId}::${encryptedString}::${ivString}`;
}

/**
 * Verify if the token is still valid within the expiry time
 * @param key 256 bytes long
 * @param token the encrypted token in base64 format
 * @param iv the iv used to encrypt the token
 * @returns true if the token is valid, false otherwise
 */
export async function verifyToken(key: string, token: string, iv: string) {
	const ivBytes = hexStringToArrayBuffer(iv);
	const tokenBytes = hexStringToArrayBuffer(token);
	const decryptionKey = await generateKey(key);
	const decrypted = await crypto.subtle.decrypt(
		{ name: "AES-GCM", length: 256, iv: ivBytes },
		decryptionKey,
		tokenBytes
	);
	const expiry = parseInt(new TextDecoder().decode(decrypted));
	return expiry > Date.now();
}

export function extractToken(token: string) {
	const [formId, encryptedString, iv] = token.split("::");
	return { formId, encryptedString, iv };
}
