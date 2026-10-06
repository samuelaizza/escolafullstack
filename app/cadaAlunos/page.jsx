"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";

export default function CadastroAlunos() {
    const router = useRouter();
    const nomeInputRef = useRef(null);

    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [email, setEmail] = useState("");
    const [turma, setTurma] = useState("");
    const [rm, setRm] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    // Controle do pop-up de sucesso
    const [popupVisivel, setPopupVisivel] = useState(false);
    const [alunoAdicionado, setAlunoAdicionado] = useState(null);

    async function cadastrarAluno(e) {
        e.preventDefault();
        setMensagemErro("");

        const dadosAluno = {
            nome: nome.trim(),
            idade: idade.trim(),
            email: email.trim(),
            turma: turma.trim(),
            rm: rm.trim()
        };

        if (!dadosAluno.nome || !dadosAluno.idade || !dadosAluno.email || !dadosAluno.turma || !dadosAluno.rm) {
            setMensagemErro("Preencha todos os campos.");
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch("/api/alunos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosAluno)
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagemErro(dados.mensagem || "Erro ao cadastrar aluno.");
                setCarregando(false);
                return;
            }

            // Guarda o aluno adicionado e exibe o pop-up
            setAlunoAdicionado(dados.aluno);
            setPopupVisivel(true);

            // Sincroniza com localStorage para compatibilidade com cadastro e lista de notas
            try {
                const salvos = JSON.parse(localStorage.getItem("alunos")) || [];
                const jaExiste = salvos.some((a) => String(a.rm) === String(dados.aluno.rm));
                if (!jaExiste) {
                    salvos.push(dados.aluno);
                    localStorage.setItem("alunos", JSON.stringify(salvos));
                }
            } catch (err) {
                console.warn("Aviso ao sincronizar localStorage:", err);
            }

            // Limpa o formulário
            setNome("");
            setIdade("");
            setEmail("");
            setTurma("");
            setRm("");
        } catch (error) {
            console.error(error);
            setMensagemErro("Não foi possível conectar com a API.");
        } finally {
            setCarregando(false);
        }
    }

    function fecharPopupEFicar() {
        setPopupVisivel(false);
        setAlunoAdicionado(null);
        setTimeout(() => {
            nomeInputRef.current?.focus();
        }, 100);
    }

    function fecharPopupEIrParaLista() {
        setPopupVisivel(false);
        setAlunoAdicionado(null);
        router.push("/listaAlunos");
    }

    return (
        <>
            <Header />

            <main className="conteudo">

                <div className="form-container">

                    <h2>Cadastro de Aluno</h2>

                    <form onSubmit={cadastrarAluno}>

                        <label>
                            Nome completo:
                        </label>

                        <input
                            ref={nomeInputRef}
                            type="text"
                            placeholder="Ex: João da Silva"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />


                        <label>
                            Idade:
                        </label>

                        <input
                            type="number"
                            placeholder="Ex: 17"
                            min="1"
                            max="120"
                            value={idade}
                            onChange={(e) => setIdade(e.target.value)}
                            required
                        />


                        <label>
                            E-mail:
                        </label>

                        <input
                            type="email"
                            placeholder="Ex: joao@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />


                        <label>
                            Turma:
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: 3ºA"
                            value={turma}
                            onChange={(e) => setTurma(e.target.value)}
                            required
                        />


                        <label>
                            RM:
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: 123456"
                            value={rm}
                            onChange={(e) => setRm(e.target.value)}
                            required
                        />


                        <button type="submit" disabled={carregando}>
                            {carregando ? "Cadastrando..." : "Cadastrar Aluno"}
                        </button>

                    </form>


                    {mensagemErro && (
                        <p className="mensagem mensagem-erro">
                            {mensagemErro}
                        </p>
                    )}

                </div>

            </main>

            {/* ── POP-UP DE SUCESSO ── */}
            {popupVisivel && (
                <div className="popup-overlay" onClick={fecharPopupEFicar}>
                    <div
                        className="popup-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="popup-fechar popup-fechar-absoluto"
                            onClick={fecharPopupEFicar}
                            aria-label="Fechar pop-up"
                        >
                            ✕
                        </button>

                        <div className="popup-icone">✓</div>

                        <h3 className="popup-titulo">Aluno Cadastrado!</h3>

                        {alunoAdicionado && (
                            <div className="popup-info">
                                <p><span>Nome:</span> {alunoAdicionado.nome}</p>
                                <p><span>Idade:</span> {alunoAdicionado.idade}</p>
                                <p><span>RM:</span> {alunoAdicionado.rm}</p>
                                <p><span>Turma:</span> {alunoAdicionado.turma}</p>
                                <p><span>E-mail:</span> {alunoAdicionado.email}</p>
                            </div>
                        )}

                        <p className="popup-subtexto">
                            O aluno foi adicionado com sucesso ao sistema.
                        </p>

                        <div className="popup-acoes">
                            <button
                                type="button"
                                className="popup-btn popup-btn-lista"
                                onClick={fecharPopupEIrParaLista}
                            >
                                Ver Lista de Alunos
                            </button>

                            <button
                                type="button"
                                className="popup-btn popup-btn-novo"
                                onClick={fecharPopupEFicar}
                            >
                                Cadastrar Outro
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}