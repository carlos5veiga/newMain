# Vídeo do dia

A página principal usa um catálogo local de vídeos que já estavam cadastrados nas séries do site. O número de vídeos do canal apresentado na página foi informado pelo autor; o catálogo inicial de destaques é uma seleção desse acervo.

- O destaque muda à meia-noite no fuso de São Paulo.
- Todos os visitantes veem a mesma escolha no mesmo dia.
- Recarregar a página mantém o destaque; a rotação só repete depois de percorrer o catálogo.
- Uma página aberta atualiza o destaque em até um minuto, desde que ninguém tenha iniciado a reprodução. Um vídeo em andamento permanece na tela.
- A imagem inicial carrega o player apenas quando o visitante escolhe assistir. Há sempre um link direto para o YouTube.
- Em uma prévia aberta como arquivo local, o clique abre o YouTube, pois o player exige identificação HTTP do site.
- Sem JavaScript, a página mantém uma videoaula inicial e seus links.

## Carregamento

As imagens de entrega da página principal ficam em `img/principal/`. Elas foram redimensionadas e comprimidas para a apresentação na página; os arquivos originais continuam disponíveis para outras seções. A capa do vídeo usa inicialmente uma ilustração SVG embutida no HTML e solicita apenas a imagem do vídeo selecionado, depois que o documento termina de carregar. Uma falha nessa imagem conserva a ilustração e os links para assistir.

O catálogo mantém os mesmos 340 vídeos e a mesma ordem, usando registros compactos e uma tabela de séries compartilhada. Não há consulta à API nem download de players antes de clicar.

Para recriar as imagens no Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/otimizar-imagens-principal.ps1
```

Ao publicar esta otimização, atualize `index.html`, `jsnewmain/principal.js`, `jsnewmain/videos-destaque.js` e envie a pasta inteira `img/principal/`. O HTML inclui uma nova versão nos endereços dos scripts para evitar que o navegador reutilize as cópias anteriores.

## Atualizar a seleção

Edite os arquivos de dados das séries em `jsnewmain` e execute, na raiz do projeto:

```powershell
node scripts/gerar-videos-destaque.cjs
```

O gerador valida os códigos, remove duplicações e intercala as séries. Envie também o arquivo regenerado `jsnewmain/videos-destaque.js` ao publicar.

Para incluir o acervo completo e vídeos novos automaticamente, uma próxima integração pode usar a YouTube Data API: consultar o canal, localizar sua playlist de uploads e percorrer todas as páginas de itens. Esta versão usa os dados locais e não consulta a API nem armazena credenciais. Alterar a composição do catálogo pode alterar a escolha correspondente a uma data.

Referências oficiais: [lista de vídeos de um canal](https://developers.google.com/youtube/v3/guides/implementation/videos) e [player incorporado](https://developers.google.com/youtube/iframe_api_reference).
