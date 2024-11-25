export interface LoggedUser {
  name: string;
  cpf: string;
  email: string;
  balance: number;
}

export interface ReqUserSignup {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export interface ReqUserLogin {
  email: string;
  password: string;
}

export interface ReqUserSignup {
  name: string;
  email: string;
  cpf: string;
  password: string;
}
