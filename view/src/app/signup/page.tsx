"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@nextui-org/react";
import { ArrowLeft01Icon } from "hugeicons-react";

import { ReqUserSignup } from "@/types/user";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { signup } from "@/store/features/authSlice";

import { encryptAes } from "@/utils/aes";

export default function Signup() {
  const [name, setName] = useState("");
  const [isNameInputTouched, setIsNameInputTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailInputTouched, setIsEmailInputTouched] = useState(false);
  const [cpf, setCpf] = useState("");
  const [isCpfInputTouched, setIsCpfInputTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordInputTouched, setIsPasswordInputTouched] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasInputTouched, setIsConfirmPasInputTouched] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const { sessionId, sessionKey } = useAppSelector((state) => state.session);

  const { isAuthenticated, isAuthenticating, user } = useAppSelector(
    (state) => state.auth
  );

  function handleSignup() {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    if (!name || !email || !cpf || cpf.length !== 11 || !password || !confirmPassword) {
      return;
    }
    if (!sessionId || !sessionKey) return;
    const userInputs: ReqUserSignup = {
      name,
      email,
      cpf,
      password,
    };
    const cipherObj = encryptAes(JSON.stringify(userInputs), sessionKey);
    const signupReq = {
      data: cipherObj.cipher,
      iv: cipherObj.iv,
      sessionId,
    };
    dispatch(signup(signupReq));
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
          <p className="font-bold uppercase pl-4">criar nova conta</p>
        </div>
        <Input
          type="text"
          label="Nome"
          placeholder="Seu nome aqui"
          value={name}
          onValueChange={setName}
          errorMessage={!name && "Nome é obrigatório"}
          isInvalid={!name && isNameInputTouched}
          onFocus={() => setIsEmailInputTouched(false)}
          onBlur={() => setIsNameInputTouched(true)}
        />
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
          type="number"
          label="CPF"
          placeholder="123.456.789-01"
          value={cpf}
          onValueChange={(val) => val.length <= 11 && setCpf(val)}
          errorMessage={!cpf ? "CPF é obrigatório" : cpf.length !== 11 && "CPF inválido"}
          isInvalid={(!cpf || cpf.length !== 11) && isCpfInputTouched}
          onFocus={() => setIsCpfInputTouched(false)}
          onBlur={() => setIsCpfInputTouched(true)}
        />
        <Input
          type="password"
          label="Senha"
          placeholder="********"
          value={password}
          onValueChange={setPassword}
          errorMessage={
            !passwordsMatch
              ? "As senhas não coincidem"
              : !password && "Senha é obrigatória"
          }
          isInvalid={(!passwordsMatch || !password) && isPasswordInputTouched}
          onFocus={() => {
            setPasswordsMatch(true);
            setIsPasswordInputTouched(false);
          }}
          onBlur={() => setIsPasswordInputTouched(true)}
        />
        <Input
          type="password"
          label="Repita sua senha"
          placeholder="********"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          errorMessage={
            !passwordsMatch
              ? "As senhas não coincidem"
              : !confirmPassword && "Senha é obrigatória"
          }
          isInvalid={(!passwordsMatch || !confirmPassword) && isConfirmPasInputTouched}
          onFocus={() => {
            setPasswordsMatch(true);
            setIsConfirmPasInputTouched(false);
          }}
          onBlur={() => {
            setIsConfirmPasInputTouched(true);
          }}
        />
        <Button
          className="font-bold tracking-wider"
          color="primary"
          variant="solid"
          onClick={handleSignup}
          isLoading={isAuthenticating}
        >
          Criar conta
        </Button>
      </Card>
    </div>
  );
}
