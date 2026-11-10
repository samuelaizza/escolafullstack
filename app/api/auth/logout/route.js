import { NextResponse } from "next/server";
import { deleteSession, SESSION_COOKIE } from "../../../lib/session";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        deleteSession(request.cookies.get(SESSION_COOKIE)?.value);

        const isJson = request.headers.get("content-type")?.includes("application/json");
        const response = isJson
            ? NextResponse.json({ mensagem: "Sessão encerrada." })
            : NextResponse.redirect(new URL("/login", request.url), 303);

        response.cookies.set(SESSION_COOKIE, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error("Erro ao encerrar sessão:", error);
        return NextResponse.json(
            { erro: "Não foi possível encerrar a sessão." },
            { status: 500 }
        );
    }
}
