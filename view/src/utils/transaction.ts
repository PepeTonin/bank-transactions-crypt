import { format, parseISO } from "date-fns";

import { signData } from "@/utils/rsa";
import { get, post } from "./api";

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

type TransactionStatus =
  | "validada"
  | "saldo insuficiente"
  | "assinatura invalida"
  | "destinatario invalido"
  | "erro nao mapeado";

interface FetchedTransaction {
  id: number;
  cpf_sender: string;
  name_sender: string;
  cpf_recipient: string;
  name_recipient: string;
  amount: number;
  event_datetime: string;
  status: TransactionStatus;
}

export interface MappedTransaction {
  transactionId: number;
  senderCpf: string;
  senderName: string;
  recipientCpf: string;
  recipientName: string;
  amount: number;
  date: string;
  status: TransactionStatus;
}

function signTransaction(transaction: Transaction) {
  const sign = signData(JSON.stringify(transaction), transaction.sender);
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

export async function getAllUserTransaction(cpf: string) {
  const url = `/transactions/${cpf}`;
  const transactions: FetchedTransaction[] = await get(url);
  const mappedTransactions: MappedTransaction[] = transactions.map((transaction) => {
    return {
      transactionId: transaction.id,
      senderCpf: transaction.cpf_sender,
      senderName: transaction.name_sender,
      recipientCpf: transaction.cpf_recipient,
      recipientName: transaction.name_recipient,
      amount: transaction.amount,
      date: format(parseISO(transaction.event_datetime), "dd/MM/yyyy HH:mm:ss"),
      status: transaction.status,
    };
  });
  return mappedTransactions;
}
