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

export function generateAndSaveKeysInLocalStorage(type: "session" | "user") {
  const { publicKey, privateKey } = generateKeyPair();
  localStorage.setItem(`publicKey_${type}`, publicKey);
  localStorage.setItem(`privateKey_${type}`, privateKey);
  return { publicKey, privateKey };
}

export function cleanLocalStorage(type: "session" | "user") {
  localStorage.removeItem(`publicKey_${type}`);
  localStorage.removeItem(`privateKey_${type}`);
}

export function logKeysFromLocalStorage() {
  console.log("Public key session:", localStorage.getItem("publicKey_session"));
  console.log("Private key session:", localStorage.getItem("privateKey_session"));
  console.log("Public key user:", localStorage.getItem("publicKey_user"));
  console.log("Private key user:", localStorage.getItem("privateKey_user"));
}

export function getPrivateKeyFromLocalStorage(type: "session" | "user") {
  const privateKeyData = localStorage.getItem(`privateKey_${type}`);
  if (!privateKeyData) {
    return undefined;
  }
  key.importKey(privateKeyData, "pkcs8-private-pem");
  return key;
}

export function getPublicKeyFromLocalStorage(type: "session" | "user") {
  const publicKeyData = localStorage.getItem(`publicKey_${type}`);
  if (!publicKeyData) {
    return undefined;
  }
  key.importKey(publicKeyData, "pkcs8-public-pem");
  return key;
}

export async function sendUserPublicKeyToServer(cpfSender: string) {
  const publicKey = getPublicKeyFromLocalStorage("user");
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

export function signData(data: string) {
  const privateKey = getPrivateKeyFromLocalStorage("user");
  if (!privateKey) {
    throw new Error("Private key not found in local storage");
  }
  const buffer = stringToBuffer(data);
  const sign = key.sign(buffer);
  return sign;
}

export function verifySign(data: string, sign: Buffer) {
  const publicKey = getPublicKeyFromLocalStorage("user");
  if (!publicKey) {
    throw new Error("Private key not found in local storage");
  }
  const dataBuffer = stringToBuffer(data);
  const isValid = key.verify(dataBuffer, sign);
  return isValid;
}
