import db from "../../db/banco";
import { NextResponse } from "next/server";

export async function GET(){
    const alunos = db.prepare('SELECT * FROM alunos ORDER BY nome').all()
    return NextResponse.json(alunos)
    
}

export async function POST(request){
    try {
        const dados =  await request.json();
        const sql = db.prepare(`INSERT INTO alunos (nome, idade, serie, ra) VALUES (?,?,?,?)`)
        sql.run(
            dados.nome,
            dados.idade,
            dados.serie,
            dados.ra
        )
        return NextResponse.json({
            mensagem: 'Aluno salvo com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao salvar usuário ', error)
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
            mensagem: "Aluno atualizado com sucesso!"
        });
    } catch (erro) {
        console.error('Erro ao editar o aluno ', erro);
        return NextResponse.json({ erro: "Erro ao editar o aluno." }, { status: 500 });
    };
}

export async function DELETE(request) {
    try {
        const dados = await request.json();
        console.log(await dados.id_aluno)
        const sql = db.prepare(`DELETE FROM alunos WHERE id_aluno = ?`);
        sql.run(dados.id_aluno);
        return NextResponse.json({
            mensagem: "Aluno excluído com sucesso!"
        });
    } catch (error) {
        console.error('Erro ao excluir o aluno ', error);
        return NextResponse.json({ erro: "Erro ao excluir o aluno." }, { status: 500 });
    };
}