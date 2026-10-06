"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";

const rafael = {
    id: 1,
    nome: "Rafael Gordenço",
    idade: 18,
    email: "eusougordinho@gmail.com",
    turma: "3ºB",
    rm: "676767"
};

export default function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [mensagem, setMensagem] = useState("");

    // Modal de criação (+ Adicionar Aluno)
    const [modalNovoVisivel, setModalNovoVisivel] = useState(false);
    const [novoNome, setNovoNome] = useState("");
    const [novoIdade, setNovoIdade] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [novoTurma, setNovoTurma] = useState("");
    const [novoRm, setNovoRm] = useState("");
    const [mensagemModalNovo, setMensagemModalNovo] = useState("");
    const [carregandoNovo, setCarregandoNovo] = useState(false);

    // Modal de edição
    const [modalVisivel, setModalVisivel] = useState(false);
    const [editando, setEditando] = useState(null);
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [email, setEmail] = useState("");
    const [turma, setTurma] = useState("");
    const [rm, setRm] = useState("");
    const [mensagemModal, setMensagemModal] = useState("");
    const [carregandoEdicao, setCarregandoEdicao] = useState(false);

    useEffect(() => {
        carregarAlunos();
    }, []);

    async function carregarAlunos() {
        try {
            const resposta = await fetch("/api/alunos", { cache: "no-store" });
            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagem(dados.mensagem || "Erro ao carregar alunos.");
                return;
            }

            if (dados.length === 0) {
                const alunoInicial = {
                    nome: rafael.nome,
                    idade: rafael.idade,
                    email: rafael.email,
                    turma: rafael.turma,
                    rm: rafael.rm
                };

                const cadastro = await fetch("/api/alunos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(alunoInicial)
                });

                if (cadastro.ok) {
                    const resultado = await fetch("/api/alunos", { cache: "no-store" });
                    const lista = await resultado.json();
                    setAlunos(lista);
                    sincronizarLocalStorage(lista);
                    return;
                }
            }

            setAlunos(dados);
            sincronizarLocalStorage(dados);
        } catch (error) {
            console.error(error);
            setMensagem("Não foi possível carregar os alunos.");
        }
    }

    function sincronizarLocalStorage(lista) {
        try {
            localStorage.setItem("alunos", JSON.stringify(lista));
        } catch (err) {
            console.warn("Erro ao salvar no localStorage:", err);
        }
    }

    async function excluirAluno(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir este aluno?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch("/api/alunos", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagem(dados.mensagem || "Erro ao excluir aluno.");
                return;
            }

            setAlunos((lista) => {
                const atualizada = lista.filter((aluno) => aluno.id !== id);
                sincronizarLocalStorage(atualizada);
                return atualizada;
            });
            setMensagem("Aluno excluído com sucesso!");
        } catch (error) {
            console.error(error);
            setMensagem("Não foi possível excluir o aluno.");
        }
    }

    // ── Abrir/Fechar modal de NOVO aluno ──
    function abrirModalNovo() {
        setNovoNome("");
        setNovoIdade("");
        setNovoEmail("");
        setNovoTurma("");
        setNovoRm("");
        setMensagemModalNovo("");
        setModalNovoVisivel(true);
    }

    function fecharModalNovo() {
        setModalNovoVisivel(false);
        setNovoNome("");
        setNovoIdade("");
        setNovoEmail("");
        setNovoTurma("");
        setNovoRm("");
        setMensagemModalNovo("");
    }

    // ── Salvar NOVO aluno via API ──
    async function salvarNovoAluno(e) {
        e.preventDefault();
        setMensagemModalNovo("");

        const dadosAluno = {
            nome: novoNome.trim(),
            idade: novoIdade.trim(),
            email: novoEmail.trim(),
            turma: novoTurma.trim(),
            rm: novoRm.trim()
        };

        if (!dadosAluno.nome || !dadosAluno.idade || !dadosAluno.email || !dadosAluno.turma || !dadosAluno.rm) {
            setMensagemModalNovo("Preencha todos os campos.");
            return;
        }

        const rmExiste = alunos.some(
            (aluno) => String(aluno.rm).trim() === dadosAluno.rm
        );

        if (rmExiste) {
            setMensagemModalNovo("Esse RM já está cadastrado.");
            return;
        }

        setCarregandoNovo(true);

        try {
            const resposta = await fetch("/api/alunos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosAluno)
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagemModalNovo(dados.mensagem || "Erro ao cadastrar aluno.");
                setCarregandoNovo(false);
                return;
            }

            setAlunos((lista) => {
                const novaLista = [...lista, dados.aluno];
                novaLista.sort((a, b) =>
                    String(a.nome || "").localeCompare(String(b.nome || ""))
                );
                sincronizarLocalStorage(novaLista);
                return novaLista;
            });

            setMensagem(`Aluno "${dados.aluno.nome}" adicionado com sucesso!`);
            fecharModalNovo();
        } catch (error) {
            console.error(error);
            setMensagemModalNovo("Não foi possível conectar com a API.");
        } finally {
            setCarregandoNovo(false);
        }
    }

    // ── Abrir modal de edição ──
    function abrirEdicao(aluno) {
        setEditando(aluno);
        setNome(aluno.nome);
        setIdade(aluno.idade);
        setEmail(aluno.email);
        setTurma(aluno.turma);
        setRm(aluno.rm);
        setMensagemModal("");
        setModalVisivel(true);
    }

    // ── Fechar modal de edição ──
    function fecharModal() {
        setModalVisivel(false);
        setEditando(null);
        setNome("");
        setIdade("");
        setEmail("");
        setTurma("");
        setRm("");
        setMensagemModal("");
    }

    // ── Salvar edição via API ──
    async function salvarEdicao(e) {
        e.preventDefault();
        setMensagemModal("");

        const rmExiste = alunos.some(
            (aluno) => String(aluno.rm).trim() === String(rm).trim() && aluno.id !== editando.id
        );

        if (rmExiste) {
            setMensagemModal("Esse RM já está cadastrado para outro aluno.");
            return;
        }

        setCarregandoEdicao(true);

        try {
            const resposta = await fetch("/api/alunos", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editando.id,
                    nome: nome.trim(),
                    idade: String(idade).trim(),
                    email: email.trim(),
                    turma: turma.trim(),
                    rm: String(rm).trim()
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagemModal(dados.mensagem || "Erro ao editar aluno.");
                setCarregandoEdicao(false);
                return;
            }

            setAlunos((lista) => {
                const atualizada = lista.map((aluno) =>
                    aluno.id === editando.id ? dados.aluno : aluno
                );
                atualizada.sort((a, b) =>
                    String(a.nome || "").localeCompare(String(b.nome || ""))
                );
                sincronizarLocalStorage(atualizada);
                return atualizada;
            });

            setMensagem("Aluno atualizado com sucesso!");
            fecharModal();
        } catch (error) {
            console.error(error);
            setMensagemModal("Não foi possível editar o aluno.");
        } finally {
            setCarregandoEdicao(false);
        }
    }

    return (
        <>
            <Header />

            <main className="conteudo">

                <div className="lista-container">

                    <div className="lista-header-linha">
                        <h2>Lista de Alunos</h2>
                        <button
                            type="button"
                            className="btn-novo-aluno"
                            onClick={abrirModalNovo}
                        >
                            + Adicionar Aluno
                        </button>
                    </div>

                    {mensagem && (
                        <p className="mensagem">
                            {mensagem}
                        </p>
                    )}

                    {alunos.length === 0 ? (
                        <div className="sem-dados">
                            <p>Nenhum aluno cadastrado.</p>
                            <button
                                type="button"
                                className="btn-novo-aluno"
                                style={{ marginTop: "15px" }}
                                onClick={abrirModalNovo}
                            >
                                Cadastrar Primeiro Aluno
                            </button>
                        </div>
                    ) : (
                        <div className="tabela-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>RM</th>
                                        <th>Nome</th>
                                        <th>Idade</th>
                                        <th>E-mail</th>
                                        <th>Turma</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {alunos.map((aluno) => (
                                        <tr key={aluno.id}>

                                            <td>{aluno.id}</td>
                                            <td>{aluno.rm}</td>
                                            <td>{aluno.nome}</td>
                                            <td>{aluno.idade}</td>
                                            <td>{aluno.email}</td>
                                            <td>{aluno.turma}</td>

                                            <td className="acoes-tabela">
                                                <button
                                                    type="button"
                                                    className="btn-editar"
                                                    onClick={() => abrirEdicao(aluno)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn-excluir"
                                                    onClick={() => excluirAluno(aluno.id)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </main>

            {/* ── MODAL: ADICIONAR NOVO ALUNO ── */}
            {modalNovoVisivel && (
                <div className="popup-overlay" onClick={fecharModalNovo}>
                    <div
                        className="popup-box popup-edicao"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="popup-edicao-header">
                            <h3>Adicionar Novo Aluno</h3>
                            <button
                                className="popup-fechar"
                                type="button"
                                onClick={fecharModalNovo}
                                aria-label="Fechar modal"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={salvarNovoAluno} className="popup-form">

                            <label>Nome completo:</label>
                            <input
                                type="text"
                                placeholder="Ex: Maria Eduarda"
                                value={novoNome}
                                onChange={(e) => setNovoNome(e.target.value)}
                                required
                            />

                            <label>Idade:</label>
                            <input
                                type="number"
                                placeholder="Ex: 16"
                                min="1"
                                max="120"
                                value={novoIdade}
                                onChange={(e) => setNovoIdade(e.target.value)}
                                required
                            />

                            <label>E-mail:</label>
                            <input
                                type="email"
                                placeholder="Ex: maria@email.com"
                                value={novoEmail}
                                onChange={(e) => setNovoEmail(e.target.value)}
                                required
                            />

                            <label>Turma:</label>
                            <input
                                type="text"
                                placeholder="Ex: 3ºB"
                                value={novoTurma}
                                onChange={(e) => setNovoTurma(e.target.value)}
                                required
                            />

                            <label>RM:</label>
                            <input
                                type="text"
                                placeholder="Ex: 887766"
                                value={novoRm}
                                onChange={(e) => setNovoRm(e.target.value)}
                                required
                            />

                            {mensagemModalNovo && (
                                <p className="mensagem mensagem-erro">
                                    {mensagemModalNovo}
                                </p>
                            )}

                            <div className="popup-acoes">
                                <button
                                    type="submit"
                                    className="popup-btn popup-btn-lista"
                                    disabled={carregandoNovo}
                                >
                                    {carregandoNovo ? "Salvando..." : "Cadastrar Aluno"}
                                </button>

                                <button
                                    type="button"
                                    className="popup-btn popup-btn-novo"
                                    onClick={fecharModalNovo}
                                >
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL: EDITAR ALUNO ── */}
            {modalVisivel && (
                <div className="popup-overlay" onClick={fecharModal}>
                    <div
                        className="popup-box popup-edicao"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="popup-edicao-header">
                            <h3>Editar Aluno</h3>
                            <button
                                className="popup-fechar"
                                type="button"
                                onClick={fecharModal}
                                aria-label="Fechar modal"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={salvarEdicao} className="popup-form">

                            <label>Nome completo:</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />

                            <label>Idade:</label>
                            <input
                                type="number"
                                min="1"
                                max="120"
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                                required
                            />

                            <label>E-mail:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label>Turma:</label>
                            <input
                                type="text"
                                value={turma}
                                onChange={(e) => setTurma(e.target.value)}
                                required
                            />

                            <label>RM:</label>
                            <input
                                type="text"
                                value={rm}
                                onChange={(e) => setRm(e.target.value)}
                                required
                            />

                            {mensagemModal && (
                                <p className="mensagem mensagem-erro">
                                    {mensagemModal}
                                </p>
                            )}

                            <div className="popup-acoes">
                                <button
                                    type="submit"
                                    className="popup-btn popup-btn-lista"
                                    disabled={carregandoEdicao}
                                >
                                    {carregandoEdicao ? "Salvando..." : "Salvar Alterações"}
                                </button>

                                <button
                                    type="button"
                                    className="popup-btn popup-btn-novo"
                                    onClick={fecharModal}
                                >
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
