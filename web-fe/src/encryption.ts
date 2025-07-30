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

export const encryptMessage = (message: string, recipient: any, sender: any): string => {

	const nonce = newNonce();
	const messageUint8 = encodeUTF8(message);
	const secretOrSharedKey = box.before(recipient, sender.secretKey);
	const encrypted = box.after(messageUint8, nonce, secretOrSharedKey);

	const fullMessage = new Uint8Array(nonce.length + encrypted.length);
	fullMessage.set(nonce);
	fullMessage.set(encrypted, nonce.length);

	const base64FullMessage = encodeBase64(fullMessage);
	return base64FullMessage;
};

export const decryptMessage = (encryptedMessage: string, sender: any, key: any): string => {

	const messageWithNonceAsUint8Array = decodeBase64(encryptedMessage);
	const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
	const message = messageWithNonceAsUint8Array.slice(
		box.nonceLength,
		messageWithNonceAsUint8Array.length
	);

	const secretOrSharedKey = box.before(sender, key.secretKey);
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

	const convertedKeyPairA = ed2curve.convertKeyPair(pairA);
	if (!convertedKeyPairA) {
		throw new Error('Failed to convert key pair');
	}
	const convertedKeyPairB = ed2curve.convertKeyPair(pairB);
	if (!convertedKeyPairB) {
		throw new Error('Failed to convert key pair');
	}

	const msg = "This is not a test message.";
	const encrypted = encryptMessage(msg, convertedKeyPairB.publicKey, convertedKeyPairA);
	const decrypted = decryptMessage(encrypted, convertedKeyPairA.publicKey, convertedKeyPairB);

	console.log(msg, encrypted, decrypted);
};
