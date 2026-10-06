import { promises as fs } from "fs";
import path from "path";

const arquivo = path.join(process.cwd(), "app", "db", "alunos.json");

async function garantirArquivo() {
    try {
        await fs.access(arquivo);
    } catch {
        await fs.mkdir(path.dirname(arquivo), { recursive: true });
        await fs.writeFile(arquivo, "[]", "utf8");
    }
}

export async function listarAlunos() {
    await garantirArquivo();
    try {
        const conteudo = await fs.readFile(arquivo, "utf8");
        const parsed = JSON.parse(conteudo.trim() || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error("Erro ao ler alunos.json:", err);
        await fs.writeFile(arquivo, "[]", "utf8");
        return [];
    }
}

export async function salvarAlunos(alunos) {
    await garantirArquivo();
    await fs.writeFile(arquivo, JSON.stringify(alunos, null, 2), "utf8");
}
