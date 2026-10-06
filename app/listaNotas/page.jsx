"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";

export default function ListaNotas() {

    const [notas, setNotas] = useState([]);
    const [alunos, setAlunos] = useState([]);


    useEffect(() => {
        const notasSalvas =
            JSON.parse(localStorage.getItem("notas")) || [];
        setNotas(notasSalvas);

        async function carregar() {
            try {
                const res = await fetch("/api/alunos", { cache: "no-store" });
                if (res.ok) {
                    const dados = await res.json();
                    if (dados && dados.length > 0) {
                        setAlunos(dados);
                        return;
                    }
                }
            } catch (err) {
                console.warn(err);
            }
            try {
                const alunosSalvos =
                    JSON.parse(localStorage.getItem("alunos")) || [];
                setAlunos(alunosSalvos);
            } catch {}
        }
        carregar();
    }, []);


    function excluirNota(id) {

        const confirmar = confirm(
            "Deseja realmente excluir esta nota?"
        );

        if (!confirmar) {
            return;
        }


        const novaLista = notas.filter(
            (nota) => nota.id !== id
        );


        setNotas(novaLista);


        localStorage.setItem(
            "notas",
            JSON.stringify(novaLista)
        );
    }


    function encontrarAluno(id) {

        return alunos.find(
            (aluno) => aluno.id === id
        );
    }


    return (
        <>
            <Header />

            <main className="conteudo">

                <div className="lista-container">

                    <h2>
                        Lista de Notas
                    </h2>


                    {notas.length === 0 ? (

                        <p className="sem-dados">
                            Nenhuma nota cadastrada.
                        </p>

                    ) : (

                        <div className="tabela-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Aluno
                                        </th>

                                        <th>
                                            RM
                                        </th>

                                        <th>
                                            Matéria
                                        </th>

                                        <th>
                                            Trabalho 1
                                        </th>

                                        <th>
                                            Trabalho 2
                                        </th>

                                        <th>
                                            Nota 1
                                        </th>

                                        <th>
                                            Nota 2
                                        </th>

                                        <th>
                                            Nota 3
                                        </th>

                                        <th>
                                            Média
                                        </th>

                                        <th>
                                            Situação
                                        </th>

                                        <th>
                                            Ações
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {notas.map((nota) => {

                                        const aluno =
                                            encontrarAluno(
                                                nota.alunoId
                                            );


                                        /*
                                         * Média considerando
                                         * Trabalho 1, Trabalho 2,
                                         * Nota 1, Nota 2 e Nota 3
                                         */

                                        const media =
                                            (
                                                nota.trabalho1 +
                                                nota.trabalho2 +
                                                nota.nota1 +
                                                nota.nota2 +
                                                nota.nota3
                                            ) / 5;


                                        const aprovado =
                                            media >= 6;


                                        return (

                                            <tr key={nota.id}>

                                                <td>
                                                    {aluno
                                                        ? aluno.nome
                                                        : "Aluno não encontrado"}
                                                </td>


                                                <td>
                                                    {aluno
                                                        ? aluno.rm
                                                        : "-"}
                                                </td>


                                                <td>
                                                    {nota.materia}
                                                </td>


                                                <td>
                                                    {nota.trabalho1.toFixed(1)}
                                                </td>


                                                <td>
                                                    {nota.trabalho2.toFixed(1)}
                                                </td>


                                                <td>
                                                    {nota.nota1.toFixed(1)}
                                                </td>


                                                <td>
                                                    {nota.nota2.toFixed(1)}
                                                </td>


                                                <td>
                                                    {nota.nota3.toFixed(1)}
                                                </td>


                                                <td>
                                                    {media.toFixed(1)}
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            aprovado
                                                                ? "aprovado"
                                                                : "reprovado"
                                                        }
                                                    >

                                                        {aprovado
                                                            ? "Aprovado"
                                                            : "Reprovado"}

                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        className="btn-excluir"
                                                        onClick={() =>
                                                            excluirNota(
                                                                nota.id
                                                            )
                                                        }
                                                    >
                                                        Excluir
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}