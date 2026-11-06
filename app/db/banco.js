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
    `)

    console.log('Banco criado com sucesso!');

    export default db;
    