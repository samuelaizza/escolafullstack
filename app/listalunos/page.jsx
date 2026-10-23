'use client';
import { useState, useEffect } from "react";
import Header from "../components/header";
import styles from './listalunos.module.css';
import { useRouter } from "next/navigation";

export default function ListAluno() {
    const [alunos, setAlunos] = useState([]);
    const router = useRouter();

    useEffect(() => {
        buscarAlunos();
    }, []); // executa quando a tela é carregada

    async function buscarAlunos() {
        try {
            const resposta = await fetch('/api/alunos', {
                method: "GET",
                cache: "no-store" // evita pegar dados antigos do cache
            });
            const dados = await resposta.json();

            if (Array.isArray(dados)) {
                setAlunos(dados);
            } else {
                console.error("Resposta inesperada da API:", dados);
                alert(dados.erro || "Erro ao buscar alunos");
                setAlunos([]);
            }
        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com o servidor");
        }
    }

    function editarAlunos(id) {
        router.push(`/editalunos/${id}`);
    }

    async function excluirAluno(id) {
        if (!confirm('Deseja realmente excluir este aluno?')) return;

        try {
            const resposta = await fetch("/api/alunos", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_aluno: id
                })
            });
            const dados = await resposta.json();
            alert(dados.mensagem || dados.erro);
            buscarAlunos();
        } catch (erro) {
            console.error(erro);
            alert("Erro ao excluir o aluno");
        }
    }

    return (
        <>
            <Header />

            <main className={styles.main}>

                <section className={styles.tituloArea}>
                    <h2>Lista de Alunos</h2>

                    <p>
                        Consulte todos os alunos cadastrados no sistema.
                    </p>
                </section>

                <section className={styles.tabelaContainer}>

                    <table className={styles.tabela}>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Idade</th>
                                <th>Série</th>
                                <th>RA</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {alunos.map((aluno) => (
                                <tr key={aluno.id_aluno}>
                                    <td>{aluno.id_aluno}</td>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.idade}</td>
                                    <td>{aluno.serie}</td>
                                    <td>{aluno.ra}</td>

                                    <td>
                                        <button
                                            className={styles.botaoEditar}
                                            onClick={() => editarAlunos(aluno.id_aluno)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className={styles.botaoExcluir}
                                            onClick={() => excluirAluno(aluno.id_aluno)}
                                        >
                                            Excluir
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </section>

            </main>
        </>
    );
}