"use client";

import Link from "next/link";

export default function Header() {
    return (
        <>
            <header className="header">
                <div className="logo-container">
                    <img
                        src="/image/logosesi.png"
                        alt="SESI"
                        className="logo"
                    />
                </div>

                <h1>Sistema Escolar - SESI</h1>
            </header>

            <nav className="navbar">
                <Link href="/">INICIO</Link>

                <Link href="/cadaAlunos">
                    CADASTRO - ALUNOS
                </Link>

                <Link href="/listaAlunos">
                    LISTA - ALUNOS
                </Link>

                <Link href="/cadaNotas">
                    CADASTRO - NOTAS
                </Link>

                <Link href="/listaNotas">
                    LISTA - NOTAS
                </Link>
            </nav>
        </>
    );
}