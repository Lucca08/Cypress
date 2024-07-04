Cenarios de Teste 

Testes E2E:

cenario - CT001: Submetendo uma imagem com entradas inválidas

Cenário: Submetendo uma imagem com entradas inválidas
Dado que estou na página de registro de imagem
Quando eu insiro "" no campo de título
Então eu insiro "" no campo de URL
Então eu clico no botão de enviar
Então eu devo ver a mensagem "Please type a title for the image" acima do campo de título
E eu devo ver a mensagem "Please type a valid URL" acima do campo de URL
E eu devo ver um ícone de exclamação nos campos de título e URL

cenario - CT002: Submetendo uma imagem com entradas válidas usando a tecla Enter

Cenário: Submetendo uma imagem com entradas válidas usando a tecla Enter
Dado que estou na página de registro de imagem
Quando eu insiro "Alien BR" no campo de título
Então eu devo ver um ícone de check no campo de título
Quando eu insiro "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg" no campo de URL
Então eu devo ver um ícone de check no campo de URL
Então eu posso pressionar Enter para submeter o formulário
E a lista de imagens registradas deve ser atualizada com o novo item
E o novo item deve ser armazenado no localStorage
Então os campos devem ser limpos

cenario - CT003: Submetendo uma imagem e atualizando a lista

Cenário: Submetendo uma imagem e atualizando a lista
Dado que estou na página de registro de imagem
Então eu insiro "BR Alien" no campo de título
Então eu insiro "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg" no campo de URL
Quando eu clico no botão de enviar
E a lista de imagens registradas deve ser atualizada com o novo item
E o novo item deve ser armazenado no localStorage
Então os campos devem ser limpos  

cenario - CT004: Atualizando a página após submeter uma imagem clicando no botão de enviar

Cenário: Atualizando a página após submeter uma imagem clicando no botão de enviar
Dado que estou na página de registro de imagem
Então eu submeto uma imagem clicando no botão de enviar
Quando eu atualizo a página
Então eu devo ver a imagem submetida na lista de imagens registradas
