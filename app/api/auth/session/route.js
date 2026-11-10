import { NextResponse } from "next/server";
import { getSessionUser, SESSION_COOKIE } from "../../../lib/session";

export const runtime = "nodejs";

export async function GET(request) {
    try {
        const usuario = getSessionUser(request.cookies.get(SESSION_COOKIE)?.value);
        if (!usuario) {
            return NextResponse.json({ erro: "Sessão não encontrada." }, { status: 401 });
        }

        return NextResponse.json({ nome: usuario.nome });
    } catch (error) {
        console.error("Erro ao consultar sessão:", error);
        return NextResponse.json(
            { erro: "Não foi possível carregar o perfil." },
            { status: 500 }
        );
    }
}
