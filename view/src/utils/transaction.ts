import { signData, verifySign } from "@/utils/rsa";
import { post } from "./api";

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
  date: string;
}

interface SignedTransaction {
  transaction: Transaction;
  sign: Buffer;
}

interface PayloadTransaction {
  transaction: string;
  sign: string;
}

function signTransaction(transaction: Transaction) {
  const sign = signData(JSON.stringify(transaction));
  const signedTransaction: SignedTransaction = { transaction, sign };
  return signedTransaction;
}

export function sendTransaction(transaction: Transaction) {
  const signedTranscation: SignedTransaction = signTransaction(transaction);
  const hexTransaction = Buffer.from(
    JSON.stringify(signedTranscation.transaction),
    "utf8"
  ).toString("hex");
  const hexSign = signedTranscation.sign.toString("hex");
  const transformedTransaction: PayloadTransaction = {
    transaction: hexTransaction,
    sign: hexSign,
  };
  const payload = JSON.stringify(transformedTransaction);
  const response = post("/transaction", payload);
  return response;
}
