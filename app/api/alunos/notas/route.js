import db from "../../db/banco";
import { NextResponse } from "next/server";

export async function GET(){
    const notas = db.prepare(`SELECT alunos.nome, alunos.ra, notas.t1, notas.t2, notas.n1, notas.n2, notas.n3  FROM notas
    INNER JOIN alunos
    ON notas.aluno_id = alunos.id_aluno
    ORDER BY alunos.nome`)
    return NextResponse.json(notas)
}

export async function POST(request){
    try {
        const dados =  await request.json();
        const sql = db.prepare(`INSERT INTO notas (aluno_id, t1, t2, n1, n2, n3) VALUES (?,?,?,?,?,?)`)
        sql.run(
            dados.aluno_id,
            dados.t1,
            dados.t2,
            dados.n1,
            dados.n2,
            dados.n3
        )
        return NextResponse.json({
            mensagem: 'Nota salva com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao salvar ', error)
    }
}


export async function PUT(request) {
    try {
        const dados = await request.json();
        const sql = db.prepare(`
            UPDATE alunos
            SET nome = ?, idade = ?, serie = ?, ra = ?
            WHERE id_aluno = ?
        `);
        sql.run(dados.nome, dados.idade, dados.serie, dados.ra, dados.id_aluno);
        return NextResponse.json({
            message: "Aluno atualizado com sucesso!"
        });
    } catch (error) {
        console.error('Erro ao editar o aluno ', error);
        return NextResponse.json({ message: "Erro ao editar o aluno." }, { status: 500 });
    };
}

export async function DELETE(request) {
    try {
        const dados = await request.json();
        const sql = db.prepare(`DELETE FROM alunos WHERE id_aluno = ?`);
        sql.run(dados.id_aluno);
        return NextResponse.json({
            message: "Aluno excluído com sucesso!"
        });
    } catch (error) {
        console.error('Erro ao excluir o aluno ', error);
        return NextResponse.json({ message: "Erro ao excluir o aluno." }, { status: 500 });
    };
}