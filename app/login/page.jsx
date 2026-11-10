import AuthForm from "../components/auth-form";

export default async function LoginPage({ searchParams }) {
  const parametros = await searchParams;
  const feedback = parametros.erro === "credenciais"
    ? "Usuário ou senha incorretos."
    : parametros.registrado === "1"
      ? "Cadastro realizado com sucesso. Faça seu login."
      : "";

  return <AuthForm mode="login" initialFeedback={feedback} />;
}
