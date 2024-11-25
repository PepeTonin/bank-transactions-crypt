"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ArrowLeft01Icon } from "hugeicons-react";

import { Button, Card, Input } from "@nextui-org/react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  function handleSignup() {
    
    router.push("/home");
  }

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
          <p className="font-bold uppercase pl-4">criar nova conta</p>
        </div>
        <Input
          type="text"
          label="Nome"
          placeholder="Seu nome aqui"
          value={name}
          onValueChange={setName}
        />
        <Input
          type="text"
          label="E-mail"
          placeholder="email@exemplo.com"
          value={email}
          onValueChange={setEmail}
        />
        <Input
          type="number"
          label="CPF"
          placeholder="123.456.789-01"
          value={cpf}
          onValueChange={(val) => val.length <= 11 && setCpf(val)}
        />
        <Input
          type="password"
          label="Senha"
          placeholder="********"
          value={password}
          onValueChange={setPassword}
        />
        <Input
          type="password"
          label="Repita sua senha"
          placeholder="********"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
        />
        <Button
          className="font-bold tracking-wider"
          color="primary"
          variant="solid"
          onClick={handleSignup}
        >
          Criar conta
        </Button>
      </Card>
    </div>
  );
}
