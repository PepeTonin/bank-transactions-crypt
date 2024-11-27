"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import {
  generateAndSaveKeysInLocalStorage,
  getPrivateKeyFromLocalStorage,
  sendUserPublicKeyToServer,
} from "@/utils/rsa";
import { sendTransaction } from "@/utils/transaction";

import { useAppSelector } from "@/store/store";

export default function MakeTransaction() {
  const [recipient, setRecipient] = useState("");
  const [isRecipientInvalid, setIsRecipientInvalid] = useState(false);

  const [amount, setAmount] = useState("");
  const [isAmountInvalid, setIsAmountInvalid] = useState(false);

  const [isDoingTransaction, setIsDoingTransaction] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    if (!user) return;
    const privateKey = getPrivateKeyFromLocalStorage("user", user?.cpf);
    if (!privateKey) {
      generateAndSaveKeysInLocalStorage("user", user.cpf);
    }
    sendUserPublicKeyToServer(user?.cpf);
  }, [user]);

  function openConfirmModal() {
    if (!recipient || recipient.length !== 11) {
      setIsRecipientInvalid(true);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setIsAmountInvalid(true);
      return;
    }
    if (!user) return;
    onOpen();
  }

  async function handleTransfer() {
    onClose();
    if (!user) {
      toast.error("Problema ao executar a transação!");
      return;
    }
    setIsDoingTransaction(true);
    const transaction = {
      sender: user?.cpf,
      recipient,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };
    const response = await sendTransaction(transaction);
    setIsDoingTransaction(false);
    setRecipient("");
    setAmount("");
    if (response.message === "transaction executed") {
      toast.success("Transação executada com sucesso!");
    }
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
          onClick={openConfirmModal}
          isLoading={isDoingTransaction}
        >
          Enviar
        </Button>
      </Card>
      <Toaster />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar transação?
              </ModalHeader>
              <ModalBody>
                <p>
                  CPF do destinatário: <span className="font-bold">{recipient}</span>
                </p>
                <p>
                  Valor: <span className="font-bold">R$ {amount}</span>
                </p>
              </ModalBody>
              <ModalFooter className="">
                <Button color="primary" onPress={handleTransfer} className="flex-1">
                  Confirmar
                </Button>
                <Button color="danger" onPress={onClose} className="flex-1">
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
