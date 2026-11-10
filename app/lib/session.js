import { createHash, randomBytes } from "node:crypto";
import db from "../db/banco";

export const SESSION_COOKIE = "escola_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

export function createSession(usuarioId) {
    const token = randomBytes(32).toString("hex");
    const now = Math.floor(Date.now() / 1000);
    const expiraEm = now + SESSION_DURATION_SECONDS;

    db.prepare("DELETE FROM sessoes WHERE expira_em <= ?").run(now);
    db.prepare(
        "INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)"
    ).run(hashToken(token), usuarioId, expiraEm);

    return token;
}

export function deleteSession(token) {
    if (!token || !/^[a-f\d]{64}$/i.test(token)) return;
    db.prepare("DELETE FROM sessoes WHERE token_hash = ?").run(hashToken(token));
}

export function getSessionUser(token) {
    if (!token || !/^[a-f\d]{64}$/i.test(token)) return null;

    return db.prepare(`
        SELECT usuarios.id_usuario, usuarios.nome
        FROM sessoes
        JOIN usuarios ON usuarios.id_usuario = sessoes.usuario_id
        WHERE sessoes.token_hash = ? AND sessoes.expira_em > ?
    `).get(hashToken(token), Math.floor(Date.now() / 1000)) ?? null;
}
