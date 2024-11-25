"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@nextui-org/react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { initSession } from "@/store/features/sessionSlice";

import { cleanLocalStorage, generateAndSaveKeysInLocalStorage } from "@/utils/rsa";
import { getSessionPublicKey } from "@/utils/session";

export default function Root() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { sessionId } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (!sessionId) {
      cleanLocalStorage("session");
      generateAndSaveKeysInLocalStorage("session");
      const publicKey = getSessionPublicKey();
      const newSessionId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      dispatch(initSession({ sessionId: newSessionId, publicKey }));
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-lvh font-roboto">
      <Card className="p-4 gap-4 w-[400px]">
        <p className="font-bold uppercase">BEM VINDO AO SISTEMA BANCÁRIO</p>
        <Button
          className="font-bold tracking-wider"
          color="primary"
          variant="solid"
          onClick={() => router.push("/login")}
        >
          Fazer login
        </Button>
        <Button
          className="font-bold tracking-wider"
          color="primary"
          variant="solid"
          onClick={() => router.push("/signup")}
        >
          Criar nova conta
        </Button>
      </Card>
    </div>
  );
}
