'use client';
import { useState, useEffect } from "react";
import Header from "../components/header";
import styles from './listanotas.module.css';

export default function ListNotas() {
    const [notas, setNotas] = useState([]);

    useEffect(() => {
        buscarNotas()
    }, [])//toda vez que a tela for recarregada

    async function buscarNotas() {
        const resposta = await fetch('/api/notas');
        const dados = await resposta.json();

        setNotas(dados);
    }


    return (
        <>
            <Header />

            <main className={styles.main}>

                <section className={styles.tituloArea}>
                    <h2>Lista de Notas</h2>

                    <p>
                        Consulte todas as notas cadastradas no sistema.
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
                            {notas ? (notas.map((nota) => (
                                <tr key={nota.id_aluno}>
                                    <td>{nota.id_nota}</td>
                                    <td>{nota.t1}</td>
                                    <td>{nota.t2}</td>
                                    <td>{nota.nota1}</td>
                                    <td>{nota.nota2}</td>
                                    <td>{nota.nota3}</td>

                                    <td>
                                        <button className={styles.botaoEditar}>
                                            Editar
                                        </button>

                                        <button className={styles.botaoExcluir}>
                                            Excluir
                                        </button>
                                    </td>

                                </tr>
                            ))) : (
                                <tr>
                                    <td colSpan="6">Nenhuma nota encontrada.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </section>

            </main>
        </>
    );
}