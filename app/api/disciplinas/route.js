import { NextResponse } from "next/server";
import db from "../../db/banco";

function validarDisciplina(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        return { erro: "Informe os dados da disciplina." };
    }

    const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
    const valorPontuacao = dados.pontuacao_minima;
    let pontuacao = Number.NaN;
    if (typeof valorPontuacao === "number") {
        pontuacao = valorPontuacao;
    } else if (typeof valorPontuacao === "string" && valorPontuacao.trim() !== "") {
        pontuacao = Number(valorPontuacao);
    }

    if (!nome || !Number.isFinite(pontuacao) || pontuacao < 0) {
        return { erro: "Informe o nome da disciplina e uma pontuação mínima válida." };
    }

    return { nome, pontuacao };
}

function responderErroBanco(erro, acao) {
    console.error(`Erro ao ${acao} disciplina:`, erro);

    if (erro.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return NextResponse.json({ erro: "Já existe uma disciplina com esse nome." }, { status: 409 });
    }

    if (erro.code === "SQLITE_CONSTRAINT_FOREIGNKEY" || erro.code === "SQLITE_CONSTRAINT_TRIGGER") {
        return NextResponse.json(
            { erro: "Não é possível excluir uma disciplina vinculada a um professor." },
            { status: 409 }
        );
    }

    return NextResponse.json({ erro: `Erro ao ${acao} disciplina.` }, { status: 500 });
}

export async function GET() {
    try {
        const disciplinas = db.prepare(
            "SELECT id_disciplina, nome, pontuacao_minima FROM disciplinas ORDER BY nome"
        ).all();
        return NextResponse.json(disciplinas);
    } catch (erro) {
        return responderErroBanco(erro, "buscar");
    }
}

export async function POST(request) {
    try {
        const validacao = validarDisciplina(await request.json());
        if (validacao.erro) {
            return NextResponse.json({ erro: validacao.erro }, { status: 400 });
        }

        db.prepare("INSERT INTO disciplinas (nome, pontuacao_minima) VALUES (?, ?)").run(
            validacao.nome,
            validacao.pontuacao
        );
        return NextResponse.json({ mensagem: "Disciplina cadastrada com sucesso!" }, { status: 201 });
    } catch (erro) {
        return responderErroBanco(erro, "cadastrar");
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();
        const id = Number(dados.id_disciplina);
        const validacao = validarDisciplina(dados);
        if (!Number.isInteger(id) || id < 1 || validacao.erro) {
            return NextResponse.json(
                { erro: validacao.erro || "Identificador da disciplina inválido." },
                { status: 400 }
            );
        }

        const resultado = db.prepare(
            "UPDATE disciplinas SET nome = ?, pontuacao_minima = ? WHERE id_disciplina = ?"
        ).run(validacao.nome, validacao.pontuacao, id);

        if (!resultado.changes) {
            return NextResponse.json({ erro: "Disciplina não encontrada." }, { status: 404 });
        }
        return NextResponse.json({ mensagem: "Disciplina atualizada com sucesso!" });
    } catch (erro) {
        return responderErroBanco(erro, "atualizar");
    }
}

export async function DELETE(request) {
    try {
        const { id_disciplina } = await request.json();
        const id = Number(id_disciplina);
        if (!Number.isInteger(id) || id < 1) {
            return NextResponse.json({ erro: "Identificador da disciplina inválido." }, { status: 400 });
        }

        const resultado = db.prepare("DELETE FROM disciplinas WHERE id_disciplina = ?").run(id);
        if (!resultado.changes) {
            return NextResponse.json({ erro: "Disciplina não encontrada." }, { status: 404 });
        }
        return NextResponse.json({ mensagem: "Disciplina excluída com sucesso!" });
    } catch (erro) {
        return responderErroBanco(erro, "excluir");
    }
}
