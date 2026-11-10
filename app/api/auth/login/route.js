import { NextResponse } from "next/server";
import db from "../../../db/banco";
import { verifyPassword } from "../../../lib/password";
import { createSession, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "../../../lib/session";

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
      : NextResponse.redirect(new URL("/login?erro=credenciais", request.url), 303);
  }

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return isJson
      ? NextResponse.json({ erro: "Envie dados válidos." }, { status: 400 })
      : NextResponse.redirect(new URL("/login?erro=credenciais", request.url), 303);
  }

  const usuario = typeof dados.usuario === "string" ? dados.usuario.trim() : "";
  const senha = typeof dados.senha === "string" ? dados.senha : "";

  if (!usuario || !senha) {
    return isJson
      ? NextResponse.json({ erro: "Informe usuário e senha." }, { status: 400 })
      : NextResponse.redirect(new URL("/login?erro=credenciais", request.url), 303);
  }

  try {
    const registro = db
      .prepare("SELECT id_usuario, senha_hash FROM usuarios WHERE usuario = ?")
      .get(usuario);

    if (!registro || !(await verifyPassword(senha, registro.senha_hash))) {
      return isJson
        ? NextResponse.json({ erro: "Usuário ou senha incorretos." }, { status: 401 })
        : NextResponse.redirect(new URL("/login?erro=credenciais", request.url), 303);
    }

    const token = createSession(registro.id_usuario);
    const response = isJson
      ? NextResponse.json({ mensagem: "Login realizado com sucesso." })
      : NextResponse.redirect(new URL("/principal", request.url), 303);

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Erro ao validar login:", error);
    return NextResponse.json(
      { erro: "Não foi possível entrar no sistema." },
      { status: 500 }
    );
  }
}
