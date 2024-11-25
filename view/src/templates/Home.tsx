"use client";
import { Card } from "@nextui-org/react";

import { useAppSelector } from "@/store/store";

export default function HomeTab() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-lvh font-roboto">
      <Card className="p-4 gap-4 w-[400px]">
        <p className="font-semibold text-neutral-900 text-lg">
          Bem vindo,{" "}
          <span className="font-extrabold text-primary">{user?.name}</span>
        </p>
        <p>Seu saldo é de: R$ {user?.balance}</p>
      </Card>
    </div>
  );
}
