import { NextResponse } from "next/server";
import { listarAlunos, salvarAlunos } from "../../db/banco";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const alunos = await listarAlunos();
        alunos.sort((a, b) =>
            String(a.nome || "").localeCompare(String(b.nome || ""))
        );
        return NextResponse.json(alunos);
    } catch (error) {
        console.error("Erro ao listar alunos:", error);
        return NextResponse.json(
            { mensagem: "Erro ao listar alunos." },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const dados = await request.json();

        const nome = dados.nome ? String(dados.nome).trim() : "";
        const idade =
            dados.idade !== undefined && dados.idade !== null
                ? String(dados.idade).trim()
                : "";
        const email = dados.email ? String(dados.email).trim() : "";
        const turma = dados.turma ? String(dados.turma).trim() : "";
        const rm = dados.rm ? String(dados.rm).trim() : "";

        if (!nome || !idade || !email || !turma || !rm) {
            return NextResponse.json(
                { mensagem: "Preencha todos os campos." },
                { status: 400 }
            );
        }

        const alunos = await listarAlunos();

        if (alunos.some((aluno) => String(aluno.rm).trim() === rm)) {
            return NextResponse.json(
                { mensagem: "Esse RM já está cadastrado." },
                { status: 409 }
            );
        }

        const novoAluno = {
            id: Date.now(),
            nome,
            idade: Number(idade) || idade,
            email,
            turma,
            rm
        };

        alunos.push(novoAluno);
        await salvarAlunos(alunos);

        return NextResponse.json(
            { mensagem: "Aluno salvo com sucesso", aluno: novoAluno },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao salvar aluno:", error);
        return NextResponse.json(
            { mensagem: "Erro ao salvar aluno." },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();

        if (!dados.id) {
            return NextResponse.json(
                { mensagem: "ID do aluno não informado." },
                { status: 400 }
            );
        }

        const nome = dados.nome ? String(dados.nome).trim() : "";
        const idade =
            dados.idade !== undefined && dados.idade !== null
                ? String(dados.idade).trim()
                : "";
        const email = dados.email ? String(dados.email).trim() : "";
        const turma = dados.turma ? String(dados.turma).trim() : "";
        const rm = dados.rm ? String(dados.rm).trim() : "";

        if (!nome || !idade || !email || !turma || !rm) {
            return NextResponse.json(
                { mensagem: "Preencha todos os campos." },
                { status: 400 }
            );
        }

        const alunos = await listarAlunos();
        const indice = alunos.findIndex(
            (aluno) => String(aluno.id) === String(dados.id)
        );

        if (indice === -1) {
            return NextResponse.json(
                { mensagem: "Aluno não encontrado." },
                { status: 404 }
            );
        }

        const rmExiste = alunos.some(
            (aluno, index) =>
                index !== indice && String(aluno.rm).trim() === rm
        );

        if (rmExiste) {
            return NextResponse.json(
                { mensagem: "Esse RM já está cadastrado para outro aluno." },
                { status: 409 }
            );
        }

        alunos[indice] = {
            ...alunos[indice],
            nome,
            idade: Number(idade) || idade,
            email,
            turma,
            rm
        };

        await salvarAlunos(alunos);

        return NextResponse.json({
            mensagem: "Aluno atualizado com sucesso",
            aluno: alunos[indice]
        });
    } catch (error) {
        console.error("Erro ao editar aluno:", error);
        return NextResponse.json(
            { mensagem: "Erro ao editar aluno." },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const dados = await request.json();

        if (!dados.id) {
            return NextResponse.json(
                { mensagem: "ID do aluno não informado." },
                { status: 400 }
            );
        }

        const alunos = await listarAlunos();
        const novaLista = alunos.filter(
            (aluno) => String(aluno.id) !== String(dados.id)
        );

        if (novaLista.length === alunos.length) {
            return NextResponse.json(
                { mensagem: "Aluno não encontrado." },
                { status: 404 }
            );
        }

        await salvarAlunos(novaLista);

        return NextResponse.json({
            mensagem: "Aluno excluído com sucesso"
        });
    } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        return NextResponse.json(
            { mensagem: "Erro ao excluir aluno." },
            { status: 500 }
        );
    }
}
