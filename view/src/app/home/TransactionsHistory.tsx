"use client";

import { useEffect, useState } from "react";
import { Card, Spinner } from "@nextui-org/react";

import { getAllUserTransaction, MappedTransaction } from "@/utils/transaction";

import { useAppSelector } from "@/store/store";
import TransactionItem from "@/components/TransactionItem";

export default function TransactionsHistory() {
  const [transactions, setTransactions] = useState<MappedTransaction[]>();
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  async function fillTransactions() {
    if (!user) return;
    const response = await getAllUserTransaction(user?.cpf);
    setTransactions(response);
    setIsLoadingTransactions(false);
  }

  useEffect(() => {
    setIsLoadingTransactions(true);
    fillTransactions();
  }, [user]);

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-lvh font-roboto">
      <Card className="p-4 gap-4 w-[600px]">
        <p className="font-bold uppercase">seu histórico de transações</p>
        <div className="font-bold uppercase flex-1 flex flex-row pr-[8px]">
          <p className="flex-1 text-center">data</p>
          <p className="flex-1 text-center">valor</p>
          <p className="flex-1 text-center">status</p>
          <p className="w-10"></p>
        </div>
        {isLoadingTransactions ? (
          <Spinner color="default" />
        ) : !transactions || transactions?.length === 0 ? (
          <p>Não há transações</p>
        ) : (
          <div className="overflow-y-scroll scrollbar-custom">
            {user &&
              transactions.map((transaction) => (
                <TransactionItem
                  item={transaction}
                  key={transaction.transactionId}
                  userCpf={user?.cpf}
                />
              ))}
          </div>
        )}
      </Card>
    </div>
  );
}
