import { NextResponse } from "next/server";
import db from "../../db/banco";

// Lista todas as notas com nome e RA do aluno
export async function GET() {
    try {
        const notas = db.prepare(`
            SELECT
                notas.id_notas,
                alunos.nome,
                alunos.ra,
                notas.t1,
                notas.t2,
                notas.n1,
                notas.n2,
                notas.n3
            FROM notas
            JOIN alunos ON alunos.id_aluno = notas.aluno_id
        `).all();

        return NextResponse.json(notas);
    } catch (erro) {
        console.error(erro);
        return NextResponse.json({ erro: "Erro ao buscar notas" }, { status: 500 });
    }
}

// Cadastra notas de um aluno
export async function POST(request) {
    try {
        const { aluno_id, t1, t2, n1, n2, n3 } = await request.json();

        if (!aluno_id) {
            return NextResponse.json({ erro: "Selecione um aluno" }, { status: 400 });
        }

        db.prepare(`
            INSERT INTO notas (aluno_id, t1, t2, n1, n2, n3)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(aluno_id, t1, t2, n1, n2, n3);

        return NextResponse.json(
            { mensagem: "Notas cadastradas com sucesso!" },
            { status: 201 }
        );
    } catch (erro) {
        console.error(erro);
        return NextResponse.json({ erro: "Erro ao cadastrar notas" }, { status: 500 });
    }
}

// Exclui notas pelo id_notas
export async function DELETE(request) {
    try {
        const { id_notas } = await request.json();

        db.prepare("DELETE FROM notas WHERE id_notas = ?").run(id_notas);

        return NextResponse.json({ mensagem: "Notas excluídas com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return NextResponse.json({ erro: "Erro ao excluir notas" }, { status: 500 });
    }
}