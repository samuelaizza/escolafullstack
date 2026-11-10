'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "../components/cadastros.module.css";

const diasDaSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

export default function CadastroProfessores() {
    const [nome, setNome] = useState("");
    const [matriculaNif, setMatriculaNif] = useState("");
    const [diasAula, setDiasAula] = useState([]);
    const [disciplinaId, setDisciplinaId] = useState("");
    const [totalAulas, setTotalAulas] = useState("");
    const [disciplinas, setDisciplinas] = useState([]);
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function buscarDisciplinas() {
            try {
                const resposta = await fetch("/api/disciplinas", { cache: "no-store" });
                const dados = await resposta.json();
                if (!resposta.ok || !Array.isArray(dados)) {
                    throw new Error(dados.erro || "Não foi possível carregar as disciplinas.");
                }
                setDisciplinas(dados);
            } catch (error) {
                console.error("Erro ao buscar disciplinas:", error);
                setErro(error.message || "Erro ao carregar as disciplinas.");
            }
        }
        buscarDisciplinas();
    }, []);

    function alternarDia(dia) {
        setDiasAula((diasAtuais) => (
            diasAtuais.includes(dia)
                ? diasAtuais.filter((item) => item !== dia)
                : [...diasAtuais, dia]
        ));
    }

    async function cadastrar(event) {
        event.preventDefault();
        setErro("");
        setSalvando(true);
        try {
            const resposta = await fetch("/api/professores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    matricula_nif: matriculaNif,
                    dias_aula: diasAula,
                    disciplina_id: Number(disciplinaId),
                    total_aulas_semana: Number(totalAulas),
                }),
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                setErro(dados.erro || "Não foi possível cadastrar o professor.");
                return;
            }
            router.push("/listaprofessores");
            router.refresh();
        } catch (error) {
            console.error("Erro ao cadastrar professor:", error);
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
                    <h2 className={styles.titulo}>Cadastro de Professores</h2>
                    <p className={styles.descricao}>Preencha os dados profissionais e a carga horária semanal.</p>
                    <div className={styles.painel}>
                        {erro && <p className={styles.mensagem} role="alert">{erro}</p>}
                        {disciplinas.length === 0 && (
                            <p className={styles.mensagem}>
                                Cadastre uma disciplina antes de cadastrar um professor.{" "}
                                <Link href="/caddisciplinas">Cadastrar disciplina</Link>
                            </p>
                        )}
                        <form className={styles.form} onSubmit={cadastrar}>
                            <div className={styles.campo}>
                                <label htmlFor="nome">Nome do professor</label>
                                <input id="nome" value={nome} onChange={(event) => setNome(event.target.value)} required />
                            </div>
                            <div className={styles.campo}>
                                <label htmlFor="nif">Matrícula (NIF)</label>
                                <input id="nif" value={matriculaNif} onChange={(event) => setMatriculaNif(event.target.value)} required />
                            </div>
                            <div className={styles.campo}>
                                <label htmlFor="disciplina">Disciplina responsável</label>
                                <select id="disciplina" value={disciplinaId} onChange={(event) => setDisciplinaId(event.target.value)} required>
                                    <option value="">Selecione uma disciplina</option>
                                    {disciplinas.map((disciplina) => (
                                        <option key={disciplina.id_disciplina} value={disciplina.id_disciplina}>{disciplina.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.campo}>
                                <label htmlFor="aulas">Total de aulas na semana</label>
                                <input id="aulas" type="number" min="1" step="1" value={totalAulas} onChange={(event) => setTotalAulas(event.target.value)} required />
                            </div>
                            <fieldset className={`${styles.dias} ${styles.painel}`}>
                                <legend className={styles.diasTitulo}>Dias que ministra aula</legend>
                                {diasDaSemana.map((dia) => (
                                    <label className={styles.dia} key={dia}>
                                        <input type="checkbox" checked={diasAula.includes(dia)} onChange={() => alternarDia(dia)} />
                                        {dia}
                                    </label>
                                ))}
                            </fieldset>
                            <div className={styles.acoes}>
                                <button className={styles.botao} type="submit" disabled={salvando || disciplinas.length === 0}>
                                    {salvando ? "Salvando..." : "Salvar professor"}
                                </button>
                                <Link className={styles.botaoSecundario} href="/listaprofessores">Ver professores</Link>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
