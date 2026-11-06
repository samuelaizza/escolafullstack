import { NextResponse } from "next/server";
import db from "../../../db/banco";
import { verifyPassword } from "../../../lib/password";

export const runtime = "nodejs";

export async function POST(request) {
  let dados;

  try {
    dados = await request.json();
  } catch {
    return NextResponse.json({ erro: "Envie dados válidos." }, { status: 400 });
  }

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return NextResponse.json({ erro: "Envie dados válidos." }, { status: 400 });
  }

  const usuario = typeof dados.usuario === "string" ? dados.usuario.trim() : "";
  const senha = typeof dados.senha === "string" ? dados.senha : "";

  if (!usuario || !senha) {
    return NextResponse.json(
      { erro: "Informe usuário e senha." },
      { status: 400 }
    );
  }

  try {
    const registro = db
      .prepare("SELECT senha_hash FROM usuarios WHERE usuario = ?")
      .get(usuario);

    if (!registro || !(await verifyPassword(senha, registro.senha_hash))) {
      return NextResponse.json(
        { erro: "Usuário ou senha incorretos." },
        { status: 401 }
      );
    }

    return NextResponse.json({ mensagem: "Login realizado com sucesso." });
  } catch (error) {
    console.error("Erro ao validar login:", error);
    return NextResponse.json(
      { erro: "Não foi possível entrar no sistema." },
      { status: 500 }
    );
  }
}
