import CryptoJS from "crypto-js";

export function encryptAes(plaintext: string, sessionKey: string) {
  const key = CryptoJS.enc.Hex.parse(sessionKey);
  const iv = CryptoJS.lib.WordArray.random(16);
  var cipherText = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return { cipher: cipherText.ciphertext.toString(), iv: iv.toString() };
}

export function decryptAes(cipherText: string, keyStr: string, ivStr: string) {
  const key = CryptoJS.enc.Hex.parse(keyStr);
  const iv = CryptoJS.enc.Hex.parse(ivStr);
  const cipherBytes = CryptoJS.enc.Base64.parse(cipherText);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherBytes }, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
