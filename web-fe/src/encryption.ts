import { web3 } from "@coral-xyz/anchor";
import { box, randomBytes, hash, secretbox } from 'tweetnacl';
import {
  decode as decodeUTF8,
  encode as encodeUTF8,
} from "@stablelib/utf8";
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from "@stablelib/base64";
import * as ed2curve from 'ed2curve';

const newNonce = () => randomBytes(box.nonceLength);

export const generateKey = () => encodeBase64(randomBytes(secretbox.keyLength));
export const generateKeyPair = () => box.keyPair();

export const encryptMessage = (message: string, receiver: string, key: string): string => {
/*
	const convertedKey = ed2curve.convertSecretKey(key);
	if (!convertedKey) {
		throw new Error('Failed to convert key pair');
	}

	const receiverPublicKey = ed2curve.convertPublicKey(receiver);
	if (!receiverPublicKey) {
		throw new Error('Failed to convert receiver public key');
	}
*/
	const receiverPublicKey = decodeBase64(receiver);
	const convertedKey = decodeBase64(key);

	const nonce = newNonce();
	const messageUint8 = encodeUTF8(message);
	const secretOrSharedKey = box.before(receiverPublicKey, convertedKey);
	const encrypted = box.after(messageUint8, nonce, secretOrSharedKey);

	const fullMessage = new Uint8Array(nonce.length + encrypted.length);
	fullMessage.set(nonce);
	fullMessage.set(encrypted, nonce.length);

	const base64FullMessage = encodeBase64(fullMessage);
	return base64FullMessage;
};

export const decryptMessage = (encryptedMessage: string, sender: string, key: string): string => {
/*
	const convertedKey = ed2curve.convertSecretKey(key);
	if (!convertedKey) {
		throw new Error('Failed to convert key pair');
	}

	const senderPublicKey = ed2curve.convertPublicKey(sender);
	if (!senderPublicKey) {
		throw new Error('Failed to convert sender public key');
	}
*/
	const senderPublicKey = decodeBase64(sender);
	const convertedKey = decodeBase64(key);

	const messageWithNonceAsUint8Array = decodeBase64(encryptedMessage);
	const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
	const message = messageWithNonceAsUint8Array.slice(
		box.nonceLength,
		messageWithNonceAsUint8Array.length
	);

	const secretOrSharedKey = box.before(senderPublicKey, convertedKey);
	const decrypted = box.open.after(message, nonce, secretOrSharedKey);

	if (!decrypted) {
		throw new Error('Could not decrypt message');
	}

	const base64DecryptedMessage = decodeUTF8(decrypted);
	return base64DecryptedMessage;
};


// Encrypt a UTF-8 string using a shared secret
export function encryptString(message: string, sharedSecret: string): string {
  // Convert shared secret to 32-byte key (hash if needed)
  const secretBytes = encodeUTF8(sharedSecret);
  const key = hash(secretBytes).slice(0, 32); // Use first 32 bytes of hash as key
  
  // Generate random nonce
  const nonce = newNonce();
  
  // Convert message to bytes
  const messageBytes = encodeUTF8(message);

  // Encrypt the message
  const ciphertext = secretbox(messageBytes, nonce, key);
  
  if (!ciphertext) {
    throw new Error('Encryption failed');
  }
  
  // Combine nonce and ciphertext, then encode as base64
  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);
  
  return encodeBase64(combined);
}

// Decrypt a base64-encoded encrypted string using a shared secret
export function decryptString(encryptedData: string, sharedSecret: string): string {
  try {
    // Convert shared secret to 32-byte key (same as encryption)
    const secretBytes = encodeUTF8(sharedSecret);
    const key = hash(secretBytes).slice(0, 32);
    
    // Decode from base64
    const combined = decodeBase64(encryptedData);
    
    // Extract nonce (first 24 bytes) and ciphertext (remaining bytes)
    const nonce = combined.slice(0, box.nonceLength);
	const ciphertext = combined.slice(
		box.nonceLength,
		combined.length
	);

    // Decrypt the message
    const decryptedBytes = secretbox.open(ciphertext, nonce, key);
    
    if (!decryptedBytes) {
      throw new Error('Decryption failed - invalid data or wrong secret');
    }
    
    // Convert back to UTF-8 string
    return decodeUTF8(decryptedBytes);
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/*
// Example usage:
const secret = "my-shared-secret-key";
const message = "Hello, this is a secret message! 🔐";

console.log("Original message:", message);

// Encrypt
const encrypted = encryptString(message, secret);
console.log("Encrypted (base64):", encrypted);

// Decrypt
const decrypted = decryptString(encrypted, secret);
console.log("Decrypted message:", decrypted);

// Verify they match
console.log("Messages match:", message === decrypted);
*/

export const generatePassword = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  
  return password;
}

// Example usage:
//console.log(generatePassword()); // e.g., "A3kL9p"

export const test = () => {
	let pwd = generatePassword();

	const pairA = generateKeyPair();
	const pairB = generateKeyPair();

	// Encrypt
	const encryptedKey = encryptString(encodeBase64(pairA.secretKey), pwd);
	const decryptedKey = decryptString(encryptedKey, pwd);


	const msg = "This is not a test message.";
	const encrypted = encryptMessage(msg, encodeBase64(pairB.publicKey), decryptedKey);
	const decrypted = decryptMessage(encrypted, encodeBase64(pairA.publicKey), encodeBase64(pairB.secretKey));

	console.log(msg, encrypted, decrypted);
};
