"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./header.module.css";

export default function Header() {
    const [nomeUsuario, setNomeUsuario] = useState("Carregando perfil");

    useEffect(() => {
        let ativo = true;

        fetch("/api/auth/session", { cache: "no-store" })
            .then(async (resposta) => {
                const dados = await resposta.json();
                if (!resposta.ok) {
                    throw new Error(dados.erro || "Não foi possível carregar o perfil.");
                }
                if (ativo) setNomeUsuario(dados.nome);
            })
            .catch((error) => {
                console.error("Erro ao carregar perfil no cabeçalho:", error);
                if (ativo) setNomeUsuario("Perfil");
            });

        return () => {
            ativo = false;
        };
    }, []);

    const iniciais = nomeUsuario
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();

    return (
        <header className={styles.header}>
            <div className={styles.identidade}>
                <h1 className={styles.logo}>Sistema Escolar - SESI</h1>
                <span className={styles.subtitulo}>Portal acadêmico</span>
            </div>
            <nav className={styles.navegacao} aria-label="Navegação principal">
                <div className={styles.menu}>
                    <Link className={styles.inicio} href="/principal">
                        <span aria-hidden="true">⌂</span> Início
                    </Link>
                    <details className={styles.dropdown}>
                        <summary>
                            <span className={styles.menuIcone} aria-hidden="true">＋</span>
                            Cadastros
                            <span className={styles.seta} aria-hidden="true">⌄</span>
                        </summary>
                        <div className={styles.dropdownPainel}>
                            <span className={styles.dropdownTitulo}>Gerenciar cadastros</span>
                            <Link href="/cadalunos"><span>01</span> Alunos</Link>
                            <Link href="/caddisciplinas"><span>02</span> Disciplinas</Link>
                            <Link href="/cadprofessores"><span>03</span> Professores</Link>
                            <Link href="/cadnotas"><span>04</span> Notas</Link>
                        </div>
                    </details>
                    <details className={styles.dropdown}>
                        <summary>
                            <span className={styles.menuIcone} aria-hidden="true">▤</span>
                            Listas
                            <span className={styles.seta} aria-hidden="true">⌄</span>
                        </summary>
                        <div className={styles.dropdownPainel}>
                            <span className={styles.dropdownTitulo}>Consultar registros</span>
                            <Link href="/listalunos"><span>01</span> Alunos</Link>
                            <Link href="/listadisciplinas"><span>02</span> Disciplinas</Link>
                            <Link href="/listaprofessores"><span>03</span> Professores</Link>
                            <Link href="/listnotas"><span>04</span> Notas</Link>
                        </div>
                    </details>
                </div>
            </nav>
            <div className={styles.conta}>
                <div className={styles.perfil} title={nomeUsuario}>
                    <span className={styles.avatar} aria-hidden="true">{iniciais || "?"}</span>
                    <span className={styles.nomeUsuario}>{nomeUsuario}</span>
                </div>
                <form className={styles.formSair} action="/api/auth/logout" method="post">
                    <button className={styles.botaoSair} type="submit">
                        <span aria-hidden="true">↗</span> Sair
                    </button>
                </form>
            </div>
        </header>
    );
}