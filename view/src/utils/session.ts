import { getPrivateKeyFromLocalStorage, getPublicKeyFromLocalStorage } from "./rsa";

export function getSessionPublicKey() {
  const publicKey = getPublicKeyFromLocalStorage("session");
  if (!publicKey) {
    throw new Error("Public key not found in local storage");
  }
  return publicKey.exportKey("pkcs8-public-pem");
}

export function decryptSessionKey(encryptedSessionKey: string) {
  const bufferFromHex = Buffer.from(encryptedSessionKey, "hex");
  const privateKey = getPrivateKeyFromLocalStorage("session");
  if (!privateKey) {
    throw new Error("Private key not found in local storage");
  }
  privateKey.setOptions({ encryptionScheme: "pkcs1" });
  const decryptedSessionKey = privateKey.decrypt(bufferFromHex, "buffer");
  return decryptedSessionKey.toString("hex");
}
