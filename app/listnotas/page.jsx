'use client';
import { useState, useEffect } from "react";
import Header from "../components/header";
import { useRouter } from "next/navigation";
import styles from "./listanotas.module.css";

export default function ListNotas() {
    const [notas, setNotas] = useState([]);
    const router = useRouter();

    useEffect(() => {
        buscarNotas()
    }, [])//toda vez que a tela for recarregada

    async function buscarNotas() {
        const resposta = await fetch('/api/notas');
        const dados = await resposta.json();
        setNotas(dados);
    }

    function editarNotas(id){
        router.push(`/editnotas/${id}`)
    }

    async function excluirNotas(event){
        event.preventDefault();
        if(!confirm('Deseja realmente excluir estas notas?'))return;
        const resposta = await fetch("/api/notas",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_notas: event.target.dataset.id
            })
        })
        const dados = await resposta.json();
        alert(dados.mensagem || dados.erro)
        buscarNotas();
    }

    return (
        <>
            <Header />

            <main className={styles.main}>

                <section className={styles.titulo}>
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
                                <th>RA</th>
                                <th>T1</th>
                                <th>T2</th>
                                <th>N1</th>
                                <th>N2</th>
                                <th>N3</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {notas.map((nota) => (
                                <tr key={nota.id_notas}>
                                    <td>{nota.id_notas}</td>
                                    <td>{nota.nome}</td>
                                    <td>{nota.ra}</td>
                                    <td>{nota.t1}</td>
                                    <td>{nota.t2}</td>
                                    <td>{nota.n1}</td>
                                    <td>{nota.n2}</td>
                                    <td>{nota.n3}</td>

                                    <td>
                                        <div className={styles.acoes}>
                                            <button
                                                className={styles.botaoEditar}
                                                onClick={() => editarNotas(nota.id_notas)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className={styles.botaoExcluir}
                                                onClick={(e) => excluirNotas(e)}
                                                data-id={nota.id_notas}
                                            >
                                                Excluir
                                            </button>
                                        </div>
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