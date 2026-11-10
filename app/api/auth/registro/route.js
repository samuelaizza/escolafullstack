import { NextResponse } from "next/server";
import db from "../../../db/banco";
import { hashPassword } from "../../../lib/password";

export const runtime = "nodejs";

export async function POST(request) {
  let dados;
  const isJson = request.headers.get("content-type")?.includes("application/json");

  try {
    dados = isJson
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return isJson
      ? NextResponse.json({ erro: "Envie dados válidos." }, { status: 400 })
      : NextResponse.redirect(new URL("/registro", request.url), 303);
  }

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return isJson
      ? NextResponse.json({ erro: "Envie dados válidos." }, { status: 400 })
      : NextResponse.redirect(new URL("/registro", request.url), 303);
  }

  const usuario = typeof dados.usuario === "string" ? dados.usuario.trim() : "";
  const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
  const senha = typeof dados.senha === "string" ? dados.senha : "";

  if (!usuario || !nome || !senha) {
    return isJson
      ? NextResponse.json({ erro: "Preencha usuário, nome e senha." }, { status: 400 })
      : NextResponse.redirect(new URL("/registro", request.url), 303);
  }

  if (usuario.length > 50 || nome.length > 120 || senha.length > 128) {
    return isJson
      ? NextResponse.json({ erro: "Confira o tamanho dos campos informados." }, { status: 400 })
      : NextResponse.redirect(new URL("/registro", request.url), 303);
  }

  try {
    const senhaHash = await hashPassword(senha);

    db.prepare(
      "INSERT INTO usuarios (usuario, nome, senha_hash) VALUES (?, ?, ?)"
    ).run(usuario, nome, senhaHash);

    return isJson
      ? NextResponse.json({ mensagem: "Cadastro realizado com sucesso." }, { status: 201 })
      : NextResponse.redirect(new URL("/login?registrado=1", request.url), 303);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return isJson
        ? NextResponse.json({ erro: "Este usuário já está cadastrado." }, { status: 409 })
        : NextResponse.redirect(new URL("/registro", request.url), 303);
    }

    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json(
      { erro: "Não foi possível concluir o cadastro." },
      { status: 500 }
    );
  }
}
