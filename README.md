<h1 align="center">Projeto PESQUEI (Frontend [React])</h2>


## Sobre o Pesquei

Esse projeto foi idealizado como parte do processo de desenvolvimento proposto pela disciplina Prática Profissional do curso de Análise e Desenvolvimento de Sistemas da UNINASSAU.

O Pesquei é uma aplicação web para pescadores que frequentam locais de pescaria variados e precisam manter um registro desses locais e assim saber quais são os pontos mais produtivos, além de registrar os peixes que foram capturados com fotos e informações detalhadas.


- Salva os pontos de pesca com coordenadas geográficas;
- Registra os peixes capturados nos pontos selecionados;
- Vincula fotos dos peixes pescados;
- Os locais de pesca registrados são privados e visíveis apenas para o usuário autenticado que os criou;
- Informações meteorológicas precisas do local selecionado pelo usuário (apenas Brasil);
- Galeria global de imagens dos últimos peixes registrados pelos usuários;
- Galeria pessoal de fotos dos peixes do usuário.

## Informações sobre a arquitetura

SPA desenvolvida utilizando a biblioteca React versão 18.1.

## Pré-requisitos

- Pesquei (API);
- NPM (Node Package Manager) versão 8;
- Chave de API do Google Maps.

## Instruções de uso

- Clone esse repositório;
- Crie um arquivo chamado .env e salve-o no diretório raiz da aplicação;
- Dentro do arquivo .env adicione sua chave da API do Google Maps:<br/>
  -- REACT_APP_GOOGLE_MAPS_API=sua_chave_aqui
- Através de um terminal de comandos, acesse o diretório raiz da aplicação;
- Digite o comando: npm install
- Após a conclusão da instalação de todos os módulos, você pode usar os seguintes comandos:<br/>
  -- npm start (inicia a aplicação em modo desenvolvimento);<br/>
  -- npm run build (Cria um pacote preparado para ser usado em produção, os arquivos serão salvos no diretório build).
