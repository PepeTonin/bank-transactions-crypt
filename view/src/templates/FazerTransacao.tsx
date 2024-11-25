"use client";

import { useEffect, useState } from "react";
import { Card, Input, Button } from "@nextui-org/react";

import {
  generateAndSaveKeysInLocalStorage,
  getPrivateKeyFromLocalStorage,
  sendUserPublicKeyToServer,
} from "@/utils/rsa";
import { sendTransaction } from "@/utils/transaction";

const CPF_SENDER = "12345678901";

export default function FazerTransacao() {
  const [recipient, setRecipient] = useState("");
  const [isRecipientInvalid, setIsRecipientInvalid] = useState(false);

  const [amount, setAmount] = useState("");
  const [isAmountInvalid, setIsAmountInvalid] = useState(false);

  useEffect(() => {
    const privateKey = getPrivateKeyFromLocalStorage("user");
    if (!privateKey) {
      generateAndSaveKeysInLocalStorage("user");
    }
    sendUserPublicKeyToServer(CPF_SENDER);
  }, []);

  async function handleTransfer() {
    if (!recipient || recipient.length !== 11) {
      setIsRecipientInvalid(true);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setIsAmountInvalid(true);
      return;
    }
    const transaction = {
      sender: CPF_SENDER,
      recipient,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };
    const response = await sendTransaction(transaction);
    console.log("response: ", response);
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-lvh font-roboto">
      <Card className="p-4 gap-4 w-[400px]">
        <p className="font-bold uppercase">Fazer transferência</p>
        <Input
          type="number"
          label="CPF do destinatário"
          placeholder="123.456.789-01"
          value={recipient}
          onValueChange={(val) => val.length <= 11 && setRecipient(val)}
          isInvalid={isRecipientInvalid}
          errorMessage={"CPF inválido"}
          onFocus={() => setIsRecipientInvalid(false)}
        />
        <Input
          type="number"
          label="Valor"
          placeholder="0,00"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">R$</span>
            </div>
          }
          value={amount}
          onValueChange={setAmount}
          isInvalid={isAmountInvalid}
          errorMessage={"Valor inválido"}
          onFocus={() => setIsAmountInvalid(false)}
        />
        <Button
          className="font-bold tracking-wider"
          color="primary"
          variant="solid"
          onClick={handleTransfer}
        >
          Enviar
        </Button>
      </Card>
    </div>
  );
}
