"use client";

import { useState, useEffect } from "react";
import Header from "../components/header";

const rafael = {
    id: 1,
    nome: "Rafael Gordenço",
    idade: 18,
    email: "eusougordinho@gmail.com",
    turma: "3ºB",
    rm: "676767"
};

export default function CadastroNotas() {

    const [alunos, setAlunos] = useState([rafael]);

    useEffect(() => {
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
                const salvos = JSON.parse(localStorage.getItem("alunos")) || [];
                if (salvos.length > 0) setAlunos(salvos);
            } catch {}
        }
        carregar();
    }, []);

    const [alunoId, setAlunoId] = useState("");
    const [materia, setMateria] = useState("");

    const [trabalho1, setTrabalho1] = useState("");
    const [trabalho2, setTrabalho2] = useState("");

    const [nota1, setNota1] = useState("");
    const [nota2, setNota2] = useState("");
    const [nota3, setNota3] = useState("");

    const [mensagem, setMensagem] = useState("");


    function cadastrarNota(e) {

        e.preventDefault();

        if (!alunoId) {
            setMensagem("Selecione um aluno.");
            return;
        }

        const notas =
            JSON.parse(localStorage.getItem("notas")) || [];

        const novaNota = {
            id: Date.now(),

            alunoId: Number(alunoId),

            materia: materia,

            trabalho1: Number(trabalho1),

            trabalho2: Number(trabalho2),

            nota1: Number(nota1),

            nota2: Number(nota2),

            nota3: Number(nota3)
        };

        notas.push(novaNota);

        localStorage.setItem(
            "notas",
            JSON.stringify(notas)
        );

        setMensagem(
            "Nota cadastrada com sucesso!"
        );

        setAlunoId("");
        setMateria("");

        setTrabalho1("");
        setTrabalho2("");

        setNota1("");
        setNota2("");
        setNota3("");
    }


    return (
        <>
            <Header />

            <main className="conteudo">

                <div className="form-container">

                    <h2>
                        Cadastro de Notas
                    </h2>

                    <form onSubmit={cadastrarNota}>

                        {/* ALUNO */}

                        <label>
                            Aluno:
                        </label>

                        <select
                            value={alunoId}
                            onChange={(e) =>
                                setAlunoId(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Selecione um aluno
                            </option>

                            {alunos.map((aluno) => (

                                <option
                                    key={aluno.id}
                                    value={aluno.id}
                                >
                                    {aluno.nome} - RM {aluno.rm}
                                </option>

                            ))}

                        </select>


                        {/* MATÉRIA */}

                        <label>
                            Matéria:
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: Matemática"
                            value={materia}
                            onChange={(e) =>
                                setMateria(e.target.value)
                            }
                            required
                        />


                        {/* TRABALHO 1 */}

                        <label>
                            Trabalho 1:
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={trabalho1}
                            onChange={(e) =>
                                setTrabalho1(e.target.value)
                            }
                            required
                        />


                        {/* TRABALHO 2 */}

                        <label>
                            Trabalho 2:
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={trabalho2}
                            onChange={(e) =>
                                setTrabalho2(e.target.value)
                            }
                            required
                        />


                        {/* NOTA 1 */}

                        <label>
                            Nota 1:
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={nota1}
                            onChange={(e) =>
                                setNota1(e.target.value)
                            }
                            required
                        />


                        {/* NOTA 2 */}

                        <label>
                            Nota 2:
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={nota2}
                            onChange={(e) =>
                                setNota2(e.target.value)
                            }
                            required
                        />


                        {/* NOTA 3 */}

                        <label>
                            Nota 3:
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={nota3}
                            onChange={(e) =>
                                setNota3(e.target.value)
                            }
                            required
                        />


                        <button type="submit">
                            Cadastrar Nota
                        </button>

                    </form>


                    {mensagem && (

                        <p className="mensagem">
                            {mensagem}
                        </p>

                    )}

                </div>

            </main>
        </>
    );
}