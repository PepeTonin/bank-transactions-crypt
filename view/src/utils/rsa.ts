import NodeRSA from "node-rsa";

import { post } from "./api";

const key = new NodeRSA();
key.setOptions({ signingScheme: "pss-sha256", environment: "browser" });

export function generateKeyPair() {
  key.generateKeyPair(3072, 65537);
  const publicKey = key.exportKey("pkcs8-public-pem");
  const privateKey = key.exportKey("pkcs8-private-pem");
  return { publicKey, privateKey };
}

export function generateAndSaveKeysInLocalStorage(
  type: "session" | "user",
  cpf?: string
) {
  const { publicKey, privateKey } = generateKeyPair();
  if (type === "user" && cpf) {
    localStorage.setItem(`publicKey_${type}_${cpf}`, publicKey);
    localStorage.setItem(`privateKey_${type}_${cpf}`, privateKey);
    console.log(`publicKey_${type}_${cpf}\n`, publicKey)
    console.log(`privateKey_${type}_${cpf}\n`, privateKey)
  }
  if (type === "session") {
    localStorage.setItem(`publicKey_${type}`, publicKey);
    localStorage.setItem(`privateKey_${type}`, privateKey);
    console.log(`publicKey_${type}\n`, publicKey)
    console.log(`privateKey_${type}\n`, privateKey)
  }
  return { publicKey, privateKey };
}

export function cleanSessionKeysFromLocalStorage() {
  localStorage.removeItem(`publicKey_session`);
  localStorage.removeItem(`privateKey_session`);
}

export function getPrivateKeyFromLocalStorage(type: "session" | "user", cpf?: string) {
  let privateKeyData;
  if (type === "user" && cpf) {
    privateKeyData = localStorage.getItem(`privateKey_${type}_${cpf}`);
  }
  if (type === "session") {
    privateKeyData = localStorage.getItem(`privateKey_${type}`);
  }
  if (!privateKeyData) {
    return undefined;
  }
  key.importKey(privateKeyData, "pkcs8-private-pem");
  return key;
}

export function getPublicKeyFromLocalStorage(type: "session" | "user", cpf?: string) {
  let publicKeyData;
  if (type === "user" && cpf) {
    publicKeyData = localStorage.getItem(`publicKey_${type}_${cpf}`);
  }
  if (type === "session") {
    publicKeyData = localStorage.getItem(`publicKey_${type}`);
  }
  if (!publicKeyData) {
    return undefined;
  }
  key.importKey(publicKeyData, "pkcs8-public-pem");
  return key;
}

export async function sendUserPublicKeyToServer(cpfSender: string) {
  const publicKey = getPublicKeyFromLocalStorage("user", cpfSender);
  if (!publicKey) {
    throw new Error("Public key not found in local storage");
  }
  const payload = {
    cpfSender,
    publicKey: publicKey.exportKey("pkcs8-public-pem"),
  };
  const response = await post("/publickey", JSON.stringify(payload));
  return response;
}

function stringToBuffer(data: string) {
  const buffer = Buffer.from(data, "utf8");
  return buffer;
}

export function signData(data: string, cpf: string) {
  const privateKey = getPrivateKeyFromLocalStorage("user", cpf);
  if (!privateKey) {
    throw new Error("Private key not found in local storage");
  }
  const buffer = stringToBuffer(data);
  const sign = key.sign(buffer);
  return sign;
}

/*
  export function verifySign(data: string, sign: Buffer, cpf: string) {
    const publicKey = getPublicKeyFromLocalStorage("user", cpf);
    if (!publicKey) {
      throw new Error("Private key not found in local storage");
    }
    const dataBuffer = stringToBuffer(data);
    const isValid = key.verify(dataBuffer, sign);
    return isValid;
  }
*/
