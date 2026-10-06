# Alterações realizadas

- Corrigido o comportamento da lista de alunos para que o aluno de exemplo Rafael seja criado somente na primeira utilização.
- O botão Excluir agora remove o aluno do estado e do localStorage e a exclusão permanece após atualizar a página.
- Adicionado botão Editar.
- A edição abre um formulário na própria página e permite alterar nome, idade, e-mail, turma e RM.
- Impedida a edição de usar um RM que já pertence a outro aluno.
- Adicionado botão Cancelar na edição.
- Corrigida a importação do banco na API `/api/alunos`.
- A API agora usa os métodos HTTP GET, POST, PUT e DELETE corretamente.

Observação: a interface atual da lista de alunos usa localStorage. A API SQLite foi corrigida separadamente, mas não substitui o localStorage automaticamente.
