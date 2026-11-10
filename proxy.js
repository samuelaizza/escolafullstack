import { NextResponse } from "next/server";

export function proxy(request) {
    if (request.cookies.has("escola_session")) {
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ erro: "Faça login para continuar." }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: [
        "/principal/:path*",
        "/cadalunos/:path*",
        "/listalunos/:path*",
        "/editalunos/:path*",
        "/cadnotas/:path*",
        "/listnotas/:path*",
        "/caddisciplinas/:path*",
        "/listadisciplinas/:path*",
        "/cadprofessores/:path*",
        "/listaprofessores/:path*",
        "/api/alunos/:path*",
        "/api/notas/:path*",
        "/api/disciplinas/:path*",
        "/api/professores/:path*",
    ],
};
