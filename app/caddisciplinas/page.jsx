'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "../components/cadastros.module.css";

export default function CadastroDisciplinas() {
    const [nome, setNome] = useState("");
    const [pontuacaoMinima, setPontuacaoMinima] = useState("");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);
    const router = useRouter();

    async function cadastrar(event) {
        event.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            const resposta = await fetch("/api/disciplinas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, pontuacao_minima: Number(pontuacaoMinima) }),
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                setErro(dados.erro || "Não foi possível cadastrar a disciplina.");
                return;
            }
            router.push("/listadisciplinas");
            router.refresh();
        } catch (error) {
            console.error("Erro ao cadastrar disciplina:", error);
            setErro("Erro ao conectar com o servidor.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.container}>
                    <h2 className={styles.titulo}>Cadastro de Disciplinas</h2>
                    <p className={styles.descricao}>Informe a disciplina e a pontuação mínima para aprovação.</p>
                    <div className={styles.painel}>
                        {erro && <p className={styles.mensagem} role="alert">{erro}</p>}
                        <form className={styles.form} onSubmit={cadastrar}>
                            <div className={styles.campo}>
                                <label htmlFor="nome">Nome da disciplina</label>
                                <input id="nome" value={nome} onChange={(event) => setNome(event.target.value)} required />
                            </div>
                            <div className={styles.campo}>
                                <label htmlFor="pontuacao">Pontuação mínima para passar</label>
                                <input
                                    id="pontuacao"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={pontuacaoMinima}
                                    onChange={(event) => setPontuacaoMinima(event.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.acoes}>
                                <button className={styles.botao} type="submit" disabled={salvando}>
                                    {salvando ? "Salvando..." : "Salvar disciplina"}
                                </button>
                                <Link className={styles.botaoSecundario} href="/listadisciplinas">Ver disciplinas</Link>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
