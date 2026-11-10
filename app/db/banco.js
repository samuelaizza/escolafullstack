import Database from "better-sqlite3";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dbPath = resolve(dirname(fileURLToPath(import.meta.url)), "escola.db");
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');//ativando Chave estrangeira em função Sqlite

db.exec(`
    CREATE TABLE IF NOT EXISTS alunos (
        id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INTEGER NOT NULL,
        serie TEXT NOT NULL,
        ra TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS notas (
        id_notas INTEGER PRIMARY KEY AUTOINCREMENT,
        aluno_id INTEGER NOT NULL,
        t1 REAL NOT NULL,
        t2 REAL NOT NULL,
        n1 REAL NOT NULL,
        n2 REAL NOT NULL,
        n3 REAL NOT NULL,
        FOREIGN KEY (aluno_id)
        REFERENCES alunos(id_aluno)
        ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL COLLATE NOCASE UNIQUE,
        nome TEXT NOT NULL,
        senha_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessoes (
        token_hash TEXT PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        expira_em INTEGER NOT NULL,
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS disciplinas (
        id_disciplina INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL COLLATE NOCASE UNIQUE,
        pontuacao_minima REAL NOT NULL CHECK (pontuacao_minima >= 0)
    );
    CREATE TABLE IF NOT EXISTS professores (
        id_professor INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        matricula_nif TEXT NOT NULL UNIQUE,
        dias_aula TEXT NOT NULL,
        disciplina_id INTEGER NOT NULL,
        total_aulas_semana INTEGER NOT NULL CHECK (total_aulas_semana > 0),
        FOREIGN KEY (disciplina_id)
        REFERENCES disciplinas(id_disciplina)
        ON DELETE RESTRICT
    );
    `)

    console.log('Banco criado com sucesso!');

    export default db;
    