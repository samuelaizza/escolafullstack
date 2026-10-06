# Correções do projeto

- Removido `better-sqlite3`, evitando a compilação nativa com node-gyp/Visual Studio.
- A API `/api/alunos` agora salva os alunos em `app/db/alunos.json`.
- `GET` lista alunos.
- `POST` cadastra aluno.
- `PUT` edita aluno.
- `DELETE` exclui aluno.
- RM duplicado é bloqueado.
- A tela de cadastro usa a API.
- A tela de lista usa a API para carregar, editar e excluir.
- O aluno Rafael é criado automaticamente somente quando a base ainda está vazia.

## Como executar

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.
