import { InformationCircleIcon } from "hugeicons-react";

import { MappedTransaction } from "@/utils/transaction";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import StatusTransactionTag from "./StatusTransactionTag";

interface TransactionItemProps {
  item: MappedTransaction;
  userCpf: string;
}

export default function TransactionItem({ item, userCpf }: TransactionItemProps) {
  const mappedDatetime = item.date.split(" ");
  const date = mappedDatetime[0];
  const time = mappedDatetime[1];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function formatNumber(value: number): string {
    const formatted = value.toFixed(2);
    return formatted.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <>
      <div className="flex flex-row py-1 border-b-1 my-1 items-center">
        <p className="flex-1 text-center">{date}</p>
        {item.status === "validada" ? (
          item.senderCpf === userCpf ? (
            <p className="flex-1 text-center font-bold text-red-600">
              R$ {formatNumber(item.amount)}
            </p>
          ) : (
            <p className="flex-1 text-center font-bold text-green-600">
              R$ {formatNumber(item.amount)}
            </p>
          )
        ) : (
          <p className="flex-1 text-center font-bold text-neutral-500">
            R$ {formatNumber(item.amount)}
          </p>
        )}
        <div className="flex-1 flex items-center justify-center">
          <StatusTransactionTag item={item} />
        </div>
        <InformationCircleIcon
          className="w-10 flex flex-row cursor-pointer hover:opacity-80 transition-transform-opacity"
          onClick={onOpen}
        />
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Informações da transação
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <p className="font-bold">Pagador:</p>
                    <p>{item.senderName}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-bold">Beneficário:</p>
                    <p>{item.recipientName}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-bold">Valor:</p>
                    <p>R$ {formatNumber(item.amount)}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-bold">Data:</p>
                    <p>{date}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-bold">Hora:</p>
                    <p>{time}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <p className="font-bold">Status:</p>
                    <p>{item.status}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-row justify-end">
                <Button color="danger" variant="light" onPress={onClose} className="">
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
