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
  const [isEmailInputTouched, setIsEmailInputTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordInputTouched, setIsPasswordInputTouched] = useState(false);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const { sessionId, sessionKey } = useAppSelector((state) => state.session);

  const { isAuthenticated, isAuthenticating, user } = useAppSelector(
    (state) => state.auth
  );

  function handleLogin() {
    if (!email || !password) {
      return;
    }
    if (!sessionId || !sessionKey) return;
    const userInputs: ReqUserLogin = {
      email,
      password,
    };
    const cipherObj = encryptAes(JSON.stringify(userInputs), sessionKey);
    const loginReq = {
      data: cipherObj.cipher,
      iv: cipherObj.iv,
      sessionId,
    };
    dispatch(login(loginReq));
  }

  function handleBack() {
    router.back();
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/home");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-1 flex-col justify-center items-center h-lvh font-roboto">
      <Card className="p-4 gap-2 w-[400px]">
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
          errorMessage={!email && "E-mail é obrigatório"}
          isInvalid={!email && isEmailInputTouched}
          onFocus={() => setIsEmailInputTouched(false)}
          onBlur={() => setIsEmailInputTouched(true)}
        />
        <Input
          type="password"
          label="Senha"
          placeholder="********"
          value={password}
          onValueChange={setPassword}
          errorMessage={!password && "Senha é obrigatória"}
          isInvalid={!password && isPasswordInputTouched}
          onFocus={() => {
            setIsPasswordInputTouched(false);
          }}
          onBlur={() => {
            setIsPasswordInputTouched(true);
          }}
        />
        <Button
          className="font-bold tracking-wider"
          color="primary"
          variant="solid"
          onClick={handleLogin}
          isLoading={isAuthenticating}
        >
          Login
        </Button>
      </Card>
    </div>
  );
}
