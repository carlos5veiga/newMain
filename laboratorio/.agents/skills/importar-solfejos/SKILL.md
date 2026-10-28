---
name: importar-solfejos
description: Importar novos MXL ou atualizar solfejos alterados no laboratório MusicXML deste repositório, gerando XML de compatibilidade e atualizando o catálogo. Use ao receber novos lotes de partituras; não se aplica a mudanças de interface ou publicação remota.
---

# Importar solfejos

Trabalhe somente em `laboratorio`. Preserve o conteúdo e o nome dos MXL, incluindo maiúsculas e minúsculas. Não publique, faça commit ou altere a aplicação como parte da importação.

Execute o importador desta skill, usando Node apenas como ferramenta local:

```powershell
# A partir da raiz do repositório:
node laboratorio/.agents/skills/importar-solfejos/scripts/importar.cjs

# Ou, se o diretório atual for laboratorio:
node .agents/skills/importar-solfejos/scripts/importar.cjs
```

O script usa o JSZip já incluído em `laboratorio/vendor` e o parser XML do PowerShell/.NET no Windows. Não instala dependências nem acessa a rede. `--check` apresenta o resultado sem gravar; `--all` revalida toda a coleção. Na execução normal, só abre e valida os MXL novos ou alterados, ou cujas cópias XML foram removidas ou modificadas. A primeira execução constrói o estado incremental local.

Leia o relatório. Novos arquivos devem estar em `solfejos/NNN-NNN`, no bloco de dez correspondente, com nomes como `Solfejo21.mxl` ou `solfejo021.mxl`. O catálogo mantém IDs com três dígitos, independentemente do nome recebido. Preserve títulos e metadados existentes. Números ausentes, como 029, são informados, sem criar entradas fictícias.

Se houver MXL inválido, duplicidade, caminho divergente ou arquivo catalogado ausente, o script para antes de gravar. Informe o problema e não remova entradas ou renomeie originais para contorná-lo. Após corrigir o problema dentro do escopo autorizado, execute novamente.

Ao alterar o importador, rode `node laboratorio/.agents/skills/importar-solfejos/scripts/verificar.cjs` a partir da raiz. Para importação rotineira, a validação incremental do próprio script é suficiente; execute `node laboratorio/verificar.cjs` quando for solicitada uma revisão completa ou surgir incompatibilidade musical/renderização.

Informe quantos solfejos foram adicionados ou atualizados, total disponível, lacunas e a lista `publicar`. Apenas catálogo, MXL e cópias XML precisam ir ao site. A skill, seus scripts e `estado.json` são locais. Esta skill não monitora a pasta em segundo plano.

Para descoberta automática, abra o Codex na pasta `laboratorio`. Quando estiver na raiz do repositório, indique explicitamente este `SKILL.md` no pedido, pois a descoberta padrão não percorre subpastas do diretório atual.
