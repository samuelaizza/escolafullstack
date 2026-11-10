import { NextResponse } from "next/server";
import db from "../../db/banco";

const diasPermitidos = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

function validarProfessor(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        return { erro: "Informe os dados do professor." };
    }

    const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
    const matriculaNif = typeof dados.matricula_nif === "string" ? dados.matricula_nif.trim() : "";
    const dias = dados.dias_aula;
    const disciplinaId = Number(dados.disciplina_id);
    const totalAulas = Number(dados.total_aulas_semana);

    if (!nome || !matriculaNif) {
        return { erro: "Informe o nome do professor e a matrícula (NIF)." };
    }
    if (!Array.isArray(dias) || dias.length === 0 || dias.some((dia) => !diasPermitidos.includes(dia))) {
        return { erro: "Selecione ao menos um dia válido em que o professor ministra aula." };
    }
    if (!Number.isInteger(disciplinaId) || disciplinaId < 1) {
        return { erro: "Selecione uma disciplina válida." };
    }
    if (!Number.isInteger(totalAulas) || totalAulas < 1) {
        return { erro: "O total de aulas na semana deve ser um número inteiro maior que zero." };
    }

    return { nome, matriculaNif, dias: [...new Set(dias)], disciplinaId, totalAulas };
}

function responderErroBanco(erro, acao) {
    console.error(`Erro ao ${acao} professor:`, erro);

    if (erro.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return NextResponse.json({ erro: "Já existe um professor com essa matrícula (NIF)." }, { status: 409 });
    }
    if (erro.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        return NextResponse.json({ erro: "A disciplina selecionada não existe." }, { status: 400 });
    }

    return NextResponse.json({ erro: `Erro ao ${acao} professor.` }, { status: 500 });
}

export async function GET() {
    try {
        const professores = db.prepare(`
            SELECT professores.id_professor, professores.nome, professores.matricula_nif,
                   professores.dias_aula, professores.disciplina_id,
                   professores.total_aulas_semana, disciplinas.nome AS disciplina_nome
            FROM professores
            JOIN disciplinas ON disciplinas.id_disciplina = professores.disciplina_id
            ORDER BY professores.nome
        `).all().map((professor) => ({
            ...professor,
            dias_aula: JSON.parse(professor.dias_aula),
        }));

        return NextResponse.json(professores);
    } catch (erro) {
        return responderErroBanco(erro, "buscar");
    }
}

export async function POST(request) {
    try {
        const validacao = validarProfessor(await request.json());
        if (validacao.erro) {
            return NextResponse.json({ erro: validacao.erro }, { status: 400 });
        }

        db.prepare(`
            INSERT INTO professores (nome, matricula_nif, dias_aula, disciplina_id, total_aulas_semana)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            validacao.nome,
            validacao.matriculaNif,
            JSON.stringify(validacao.dias),
            validacao.disciplinaId,
            validacao.totalAulas
        );
        return NextResponse.json({ mensagem: "Professor cadastrado com sucesso!" }, { status: 201 });
    } catch (erro) {
        return responderErroBanco(erro, "cadastrar");
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();
        const id = Number(dados.id_professor);
        const validacao = validarProfessor(dados);
        if (!Number.isInteger(id) || id < 1 || validacao.erro) {
            return NextResponse.json(
                { erro: validacao.erro || "Identificador do professor inválido." },
                { status: 400 }
            );
        }

        const resultado = db.prepare(`
            UPDATE professores
            SET nome = ?, matricula_nif = ?, dias_aula = ?, disciplina_id = ?, total_aulas_semana = ?
            WHERE id_professor = ?
        `).run(
            validacao.nome,
            validacao.matriculaNif,
            JSON.stringify(validacao.dias),
            validacao.disciplinaId,
            validacao.totalAulas,
            id
        );

        if (!resultado.changes) {
            return NextResponse.json({ erro: "Professor não encontrado." }, { status: 404 });
        }
        return NextResponse.json({ mensagem: "Professor atualizado com sucesso!" });
    } catch (erro) {
        return responderErroBanco(erro, "atualizar");
    }
}

export async function DELETE(request) {
    try {
        const { id_professor } = await request.json();
        const id = Number(id_professor);
        if (!Number.isInteger(id) || id < 1) {
            return NextResponse.json({ erro: "Identificador do professor inválido." }, { status: 400 });
        }

        const resultado = db.prepare("DELETE FROM professores WHERE id_professor = ?").run(id);
        if (!resultado.changes) {
            return NextResponse.json({ erro: "Professor não encontrado." }, { status: 404 });
        }
        return NextResponse.json({ mensagem: "Professor excluído com sucesso!" });
    } catch (erro) {
        return responderErroBanco(erro, "excluir");
    }
}
