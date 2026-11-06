"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./auth-form.module.css";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isRegistro = mode === "registro";
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const dados = {
      usuario: formData.get("usuario"),
      senha: formData.get("senha"),
    };

    if (isRegistro) {
      dados.nome = formData.get("nome");
    }

    try {
      const response = await fetch(
        isRegistro ? "/api/auth/registro" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        }
      );
      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.erro || "Não foi possível concluir a operação.");
      }

      router.push(isRegistro ? "/login" : "/principal");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar ao sistema. Tente novamente."
      );
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.card} aria-labelledby="auth-title">
        <p className={styles.brand}>Sistema Escolar · SESI Mirandópolis</p>
        <h1 id="auth-title">{isRegistro ? "Criar cadastro" : "Bem-vindo"}</h1>
        <p className={styles.description}>
          {isRegistro
            ? "Preencha seus dados para criar seu acesso."
            : "Entre com seus dados para acessar o sistema."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            maxLength={50}
            required
          />

          {isRegistro && (
            <>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                autoComplete="name"
                maxLength={120}
                required
              />
            </>
          )}

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete={isRegistro ? "new-password" : "current-password"}
            maxLength={128}
            required
          />

          {feedback && (
            <p className={styles.error} role="alert">
              {feedback}
            </p>
          )}

          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting
              ? "Aguarde..."
              : isRegistro
                ? "Salvar cadastro"
                : "Entrar no sistema"}
          </button>
        </form>

        <p className={styles.alternative}>
          {isRegistro ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
          <Link href={isRegistro ? "/login" : "/registro"}>
            {isRegistro ? "Ir para o login" : "Fazer registro"}
          </Link>
        </p>
      </section>
    </main>
  );
}
