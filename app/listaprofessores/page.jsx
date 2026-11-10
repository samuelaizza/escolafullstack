'use client';

import { useCallback, useEffect, useState } from "react";
import Header from "../components/header";
import styles from "../components/cadastros.module.css";

const diasDaSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

async function carregarDadosProfessores() {
    const [respostaProfessores, respostaDisciplinas] = await Promise.all([
        fetch("/api/professores", { cache: "no-store" }),
        fetch("/api/disciplinas", { cache: "no-store" }),
    ]);
    const [dadosProfessores, dadosDisciplinas] = await Promise.all([
        respostaProfessores.json(),
        respostaDisciplinas.json(),
    ]);
    if (!respostaProfessores.ok || !respostaDisciplinas.ok ||
        !Array.isArray(dadosProfessores) || !Array.isArray(dadosDisciplinas)) {
        throw new Error(dadosProfessores.erro || dadosDisciplinas.erro || "Resposta inesperada da API.");
    }
    return { professores: dadosProfessores, disciplinas: dadosDisciplinas };
}

export default function ListaProfessores() {
    const [professores, setProfessores] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [editando, setEditando] = useState(null);

    const buscarDados = useCallback(async () => {
        try {
            const dados = await carregarDadosProfessores();
            setProfessores(dados.professores);
            setDisciplinas(dados.disciplinas);
            setErro("");
        } catch (error) {
            console.error("Erro ao buscar professores:", error);
            setErro(error.message || "Erro ao buscar professores.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        let ativo = true;
        carregarDadosProfessores()
            .then((dados) => {
                if (ativo) {
                    setProfessores(dados.professores);
                    setDisciplinas(dados.disciplinas);
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar professores:", error);
                if (ativo) setErro(error.message || "Erro ao buscar professores.");
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
            const resposta = await fetch("/api/professores", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...editando,
                    disciplina_id: Number(editando.disciplina_id),
                    total_aulas_semana: Number(editando.total_aulas_semana),
                }),
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                setErro(dados.erro || "Não foi possível atualizar o professor.");
                return;
            }
            setEditando(null);
            buscarDados();
        } catch (error) {
            console.error("Erro ao atualizar professor:", error);
            setErro("Erro ao conectar com o servidor.");
        }
    }

    function alternarDia(dia) {
        setEditando((atual) => ({
            ...atual,
            dias_aula: atual.dias_aula.includes(dia)
                ? atual.dias_aula.filter((item) => item !== dia)
                : [...atual.dias_aula, dia],
        }));
    }

    async function excluir(id) {
        if (!confirm("Deseja realmente excluir este professor?")) return;
        try {
            const resposta = await fetch("/api/professores", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_professor: id }),
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                setErro(dados.erro || "Não foi possível excluir o professor.");
                return;
            }
            buscarDados();
        } catch (error) {
            console.error("Erro ao excluir professor:", error);
            setErro("Erro ao conectar com o servidor.");
        }
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.container}>
                    <h2 className={styles.titulo}>Professores cadastrados</h2>
                    <p className={styles.descricao}>Consulte, edite ou remova professores.</p>
                    {erro && <p className={styles.mensagem} role="alert">{erro}</p>}
                    {editando && (
                        <div className={styles.painel}>
                            <form className={styles.form} onSubmit={salvar}>
                                <div className={styles.campo}>
                                    <label htmlFor="editar-nome">Nome do professor</label>
                                    <input id="editar-nome" value={editando.nome} onChange={(event) => setEditando({ ...editando, nome: event.target.value })} required />
                                </div>
                                <div className={styles.campo}>
                                    <label htmlFor="editar-nif">Matrícula (NIF)</label>
                                    <input id="editar-nif" value={editando.matricula_nif} onChange={(event) => setEditando({ ...editando, matricula_nif: event.target.value })} required />
                                </div>
                                <div className={styles.campo}>
                                    <label htmlFor="editar-disciplina">Disciplina responsável</label>
                                    <select id="editar-disciplina" value={editando.disciplina_id} onChange={(event) => setEditando({ ...editando, disciplina_id: event.target.value })} required>
                                        <option value="">Selecione uma disciplina</option>
                                        {disciplinas.map((disciplina) => (
                                            <option key={disciplina.id_disciplina} value={disciplina.id_disciplina}>{disciplina.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.campo}>
                                    <label htmlFor="editar-aulas">Total de aulas na semana</label>
                                    <input id="editar-aulas" type="number" min="1" step="1" value={editando.total_aulas_semana} onChange={(event) => setEditando({ ...editando, total_aulas_semana: event.target.value })} required />
                                </div>
                                <fieldset className={`${styles.dias} ${styles.painel}`}>
                                    <legend className={styles.diasTitulo}>Dias que ministra aula</legend>
                                    {diasDaSemana.map((dia) => (
                                        <label className={styles.dia} key={dia}>
                                            <input type="checkbox" checked={editando.dias_aula.includes(dia)} onChange={() => alternarDia(dia)} />
                                            {dia}
                                        </label>
                                    ))}
                                </fieldset>
                                <div className={styles.acoes}>
                                    <button className={styles.botao} type="submit">Salvar alterações</button>
                                    <button className={styles.botaoSecundario} type="button" onClick={() => setEditando(null)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className={styles.tabelaContainer}>
                        <table className={styles.tabela}>
                            <thead><tr><th>ID</th><th>Nome</th><th>Matrícula (NIF)</th><th>Dias de aula</th><th>Disciplina</th><th>Aulas/semana</th><th>Ações</th></tr></thead>
                            <tbody>
                                {!carregando && professores.map((professor) => (
                                    <tr key={professor.id_professor}>
                                        <td>{professor.id_professor}</td>
                                        <td>{professor.nome}</td>
                                        <td>{professor.matricula_nif}</td>
                                        <td>{professor.dias_aula.join(", ")}</td>
                                        <td>{professor.disciplina_nome}</td>
                                        <td>{professor.total_aulas_semana}</td>
                                        <td>
                                            <button className={styles.botaoSecundario} onClick={() => setEditando({ ...professor, dias_aula: [...professor.dias_aula] })}>Editar</button>{" "}
                                            <button className={styles.botaoExcluir} onClick={() => excluir(professor.id_professor)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                                {carregando && <tr><td className={styles.vazio} colSpan="7">Carregando professores...</td></tr>}
                                {!carregando && professores.length === 0 && <tr><td className={styles.vazio} colSpan="7">Nenhum professor cadastrado.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}
