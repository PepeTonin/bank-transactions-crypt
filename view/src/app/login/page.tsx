"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@nextui-org/react";
import { ArrowLeft01Icon } from "hugeicons-react";

import { useAppSelector } from "@/store/store";
import { ReqUserLogin } from "@/types/user";
import { encryptAes } from "@/utils/aes";
import { useAppDispatch } from "@/store/store";
import { login } from "@/store/features/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  
  const dispatch = useAppDispatch();

  const { sessionId, sessionKey } = useAppSelector((state) => state.session);
  const { isAuthenticated, isAuthenticating, user } = useAppSelector(
    (state) => state.auth
  );

  function handleLogin() {
    if (!sessionId || !sessionKey) return;
    const userInputs: ReqUserLogin = {
      email,
      password,
    };
    const cipherObj = encryptAes(JSON.stringify(userInputs), sessionKey);
    const payload = {
      data: cipherObj.cipher,
      iv: cipherObj.iv,
      sessionId,
    };
    dispatch(login(payload));
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/home");
    }
  }, [isAuthenticated]);

  function handleBack() {
    router.back();
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-lvh font-roboto">
      <Card className="p-4 gap-4 w-[400px]">
        <div className="flex flex-row flex-1">
          <ArrowLeft01Icon
            onClick={handleBack}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          />
          <p className="font-bold uppercase pl-4">entrar com conta existente</p>
        </div>
        <Input
          type="text"
          label="E-mail"
          placeholder="email@exemplo.com"
          value={email}
          onValueChange={setEmail}
        />
        <Input
          type="password"
          label="Senha"
          placeholder="********"
          value={password}
          onValueChange={setPassword}
        />
        <Button
          className="font-bold tracking-wider"
          color="primary"
          variant="solid"
          onClick={handleLogin}
          disabled={isAuthenticating}
          isLoading={isAuthenticating}
        >
          Login
        </Button>
      </Card>
    </div>
  );
}
