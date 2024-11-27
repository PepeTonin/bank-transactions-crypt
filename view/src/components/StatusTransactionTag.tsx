import { MappedTransaction } from "@/utils/transaction";

interface StatusTransactionTagProps {
  item: MappedTransaction;
}

export default function StatusTransactionTag({ item }: StatusTransactionTagProps) {

  const StatusTextObj = {
    validada: {
      text: "validada",
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    "saldo insuficiente": {
      text: "não executada",
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    "assinatura invalida": {
      text: "não executada",
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    "destinatario invalido": {
      text: "não executada",
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    "erro nao mapeado": {
      text: "não executada",
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
  };

  return (
    <div className={`rounded-full py-[2px] px-4 ${StatusTextObj[item.status].bgColor}`}>
      <p className={`text-center font-semibold ${StatusTextObj[item.status].textColor}`}>
        {StatusTextObj[item.status].text}
      </p>
    </div>
  );
}
