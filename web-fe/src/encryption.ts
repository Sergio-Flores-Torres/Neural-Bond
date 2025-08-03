import { web3 } from "@coral-xyz/anchor";
import { box, randomBytes } from 'tweetnacl';
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

export const encryptMessage = (message: string, receiver: Uint8Array, key: Uint8Array): string => {

	const convertedKey = ed2curve.convertSecretKey(key);
	if (!convertedKey) {
		throw new Error('Failed to convert key pair');
	}

	const receiverPublicKey = ed2curve.convertPublicKey(receiver);
	if (!receiverPublicKey) {
		throw new Error('Failed to convert receiver public key');
	}

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

export const decryptMessage = (encryptedMessage: string, sender: Uint8Array, key: Uint8Array): string => {

	const convertedKey = ed2curve.convertSecretKey(key);
	if (!convertedKey) {
		throw new Error('Failed to convert key pair');
	}

	const senderPublicKey = ed2curve.convertPublicKey(sender);
	if (!senderPublicKey) {
		throw new Error('Failed to convert sender public key');
	}

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

export const test = () => {
	const pairA = web3.Keypair.generate();
	const pairB = web3.Keypair.generate();

	const msg = "This is not a test message.";
	const encrypted = encryptMessage(msg, pairB.publicKey.toBytes(), pairA.secretKey);
	const decrypted = decryptMessage(encrypted, pairA.publicKey.toBytes(), pairB.secretKey);

	console.log(msg, encrypted, decrypted);
};
