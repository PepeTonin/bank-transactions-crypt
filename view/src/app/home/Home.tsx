"use client";
import { useEffect, useState } from "react";
import { Card, Spinner } from "@nextui-org/react";

import { get } from "@/utils/api";

import { useAppSelector } from "@/store/store";

export default function HomeTab() {
  const [userBalance, setUserBalance] = useState<number>();
  const [isFetchingUserBalance, setIsFetchingUserBalance] = useState(true);

  const { user } = useAppSelector((state) => state.auth);

  function formatNumber(value: number): string {
    const formatted = value.toFixed(2);
    return formatted.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  async function updateUserBalance() {
    setIsFetchingUserBalance(true);
    try {
      const response = await get(`/balance/${user?.cpf}`);
      setUserBalance(response.balance);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingUserBalance(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    updateUserBalance();
  }, [user]);

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-lvh font-roboto">
      <Card className="p-4 gap-4 w-[400px]">
        <p className="font-semibold text-neutral-900 text-lg">
          Bem vindo,{" "}
          <span className="font-extrabold text-primary capitalize">{user?.name}</span>
        </p>
        {isFetchingUserBalance && <Spinner color="primary" />}
        {userBalance && !isFetchingUserBalance && (
          <p>
            Seu saldo é de:{" "}
            <span className="font-semibold text-primary">
              R$ {formatNumber(userBalance)}
            </span>
          </p>
        )}
      </Card>
    </div>
  );
}
