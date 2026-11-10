'use client';

import { useCallback, useEffect, useState } from "react";
import Header from "../components/header";
import styles from "../components/cadastros.module.css";

async function carregarDisciplinas() {
    const resposta = await fetch("/api/disciplinas", { cache: "no-store" });
    const dados = await resposta.json();
    if (!resposta.ok || !Array.isArray(dados)) {
        throw new Error(dados.erro || "Resposta inesperada da API.");
    }
    return dados;
}

export default function ListaDisciplinas() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [editando, setEditando] = useState(null);

    const buscarDisciplinas = useCallback(async () => {
        try {
            setDisciplinas(await carregarDisciplinas());
            setErro("");
        } catch (error) {
            console.error("Erro ao buscar disciplinas:", error);
            setErro(error.message || "Erro ao buscar disciplinas.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        let ativo = true;
        carregarDisciplinas()
            .then((dados) => {
                if (ativo) setDisciplinas(dados);
            })
            .catch((error) => {
                console.error("Erro ao buscar disciplinas:", error);
                if (ativo) setErro(error.message || "Erro ao buscar disciplinas.");
            })
            .finally(() => {
                if (ativo) setCarregando(false);
            });
        return () => {
            ativo = false;
        };
    }, []);

    async function salvar(event) {
        event.preventDefault();
        setErro("");
        try {
            const resposta = await fetch("/api/disciplinas", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_disciplina: editando.id_disciplina,
                    nome: editando.nome,
                    pontuacao_minima: Number(editando.pontuacao_minima),
                }),
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                setErro(dados.erro || "Não foi possível atualizar a disciplina.");
                return;
            }
            setEditando(null);
            buscarDisciplinas();
        } catch (error) {
            console.error("Erro ao atualizar disciplina:", error);
            setErro("Erro ao conectar com o servidor.");
        }
    }

    async function excluir(id) {
        if (!confirm("Deseja realmente excluir esta disciplina?")) return;
        try {
            const resposta = await fetch("/api/disciplinas", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_disciplina: id }),
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                setErro(dados.erro || "Não foi possível excluir a disciplina.");
                return;
            }
            buscarDisciplinas();
        } catch (error) {
            console.error("Erro ao excluir disciplina:", error);
            setErro("Erro ao conectar com o servidor.");
        }
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.container}>
                    <h2 className={styles.titulo}>Disciplinas cadastradas</h2>
                    <p className={styles.descricao}>Consulte, edite ou remova disciplinas.</p>
                    {erro && <p className={styles.mensagem} role="alert">{erro}</p>}
                    {editando && (
                        <div className={styles.painel}>
                            <form className={styles.form} onSubmit={salvar}>
                                <div className={styles.campo}>
                                    <label htmlFor="editar-nome">Nome da disciplina</label>
                                    <input id="editar-nome" value={editando.nome} onChange={(event) => setEditando({ ...editando, nome: event.target.value })} required />
                                </div>
                                <div className={styles.campo}>
                                    <label htmlFor="editar-pontuacao">Pontuação mínima para passar</label>
                                    <input id="editar-pontuacao" type="number" min="0" step="any" value={editando.pontuacao_minima} onChange={(event) => setEditando({ ...editando, pontuacao_minima: event.target.value })} required />
                                </div>
                                <div className={styles.acoes}>
                                    <button className={styles.botao} type="submit">Salvar alterações</button>
                                    <button className={styles.botaoSecundario} type="button" onClick={() => setEditando(null)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className={styles.tabelaContainer}>
                        <table className={styles.tabela}>
                            <thead><tr><th>ID</th><th>Disciplina</th><th>Pontuação mínima</th><th>Ações</th></tr></thead>
                            <tbody>
                                {!carregando && disciplinas.map((disciplina) => (
                                    <tr key={disciplina.id_disciplina}>
                                        <td>{disciplina.id_disciplina}</td>
                                        <td>{disciplina.nome}</td>
                                        <td>{disciplina.pontuacao_minima}</td>
                                        <td>
                                            <button className={styles.botaoSecundario} onClick={() => setEditando({ ...disciplina })}>Editar</button>{" "}
                                            <button className={styles.botaoExcluir} onClick={() => excluir(disciplina.id_disciplina)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                                {carregando && <tr><td className={styles.vazio} colSpan="4">Carregando disciplinas...</td></tr>}
                                {!carregando && disciplinas.length === 0 && <tr><td className={styles.vazio} colSpan="4">Nenhuma disciplina cadastrada.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}
