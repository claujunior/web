# Anilib — Frontend
 
Interface web do sistema de animes, construída com **React + Vite**. Permite navegar por animes recentes e populares, buscar títulos, assistir episódios diretamente no browser e gerenciar sua watchlist integrada ao **MyAnimeList (MAL)**.
 
> O backend que alimenta esta aplicação está em [claujunior/fastapi-users-auth](https://github.com/claujunior/fastapi-users-auth).
 
---
 
## Funcionalidades
 
- Listagem paginada de animes recentes e top animes
- Busca em tempo real com debounce (300ms)
- Página de detalhes com sinopse, gêneros, notas e títulos alternativos
- Player de episódios integrado com suporte a MP4
- Autenticação completa: cadastro, login e logout via JWT
- Integração com MyAnimeList: conectar conta OAuth, ver e editar watchlist, remover títulos
- Perfil do usuário com estatísticas da conta MAL
---
 
## Stack
 
| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Bundler | Vite 8 |
| Estilização | CSS puro com variáveis CSS |
| Autenticação | JWT (armazenado via localStorage) |
| HTTP | Fetch API nativa |
 
---
 
## Estrutura do projeto
 
```
src/
├── api/
│   ├── apiAnimes.js     # Endpoints de animes e streaming
│   ├── apiCadastro.js   # Cadastro de usuário
│   ├── apiHttp.js       # Fetch autenticado (injeta Bearer token)
│   ├── apiLogin.js      # Login e obtenção do token JWT
│   └── apiMal.js        # Integração com MyAnimeList
│
├── components/
│   ├── navbar.jsx       # Barra de navegação com busca em tempo real
│   ├── dashboard.jsx    # Página inicial com animes recentes e top
│   ├── anime.jsx        # Página de detalhes, player e watchlist
│   ├── login.jsx        # Formulário de login
│   ├── cadastro.jsx     # Formulário de cadastro
│   └── perfil.jsx       # Perfil do usuário e gerenciamento da watchlist
│
└── App.jsx              # Roteamento client-side via estado (useState)
```
 
---
 
## Roteamento
 
O app não usa React Router. O roteamento é feito via estado em `App.jsx` com um objeto `{ page, id }` — cada componente chama `setIdPage` para navegar entre as páginas.
 
```jsx
const [idPage, setIdPage] = useState({ page: "dashboard", id: 0 });
 
// Exemplo: navegar para a página de um anime
setIdPage({ page: "anime", id: 21 });
```
 
---
 
## Pré-requisitos
 
- Node.js 18+
- npm
- Backend rodando em `http://127.0.0.1:8000` — veja [claujunior/fastapi-users-auth](https://github.com/claujunior/fastapi-users-auth)
---
 
## Como rodar
 
```bash
# Clone o repositório (branch react)
git clone -b react https://github.com/claujunior/web.git
cd web
 
# Instale as dependências
npm install
 
# Inicie o servidor de desenvolvimento
npm run dev
```
 
A aplicação estará disponível em `http://localhost:5173`.
 
---
 
## Scripts disponíveis
 
| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `/dist` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa o ESLint |
 
---
 
## Integração com o backend
 
Todas as chamadas HTTP apontam para `http://127.0.0.1:8000`. Para mudar o endereço, edite a constante `API_URL` nos arquivos dentro de `src/api/`.
 
Rotas protegidas utilizam `apiHttp.js`, que injeta automaticamente o token JWT do `localStorage` no header `Authorization: Bearer`.
 
---
 
## Integração com MyAnimeList
 
A conexão com o MAL é feita via OAuth, iniciada pelo backend. Na página de perfil, o usuário clica em **Conectar MAL** e é redirecionado para autorizar o acesso. Após a conexão é possível:
 
- Visualizar a watchlist agrupada por status (assistindo, completo, em espera, abandonado, planejo assistir)
- Atualizar status, nota e episódios assistidos diretamente na página do anime
- Remover títulos da lista com confirmação via modal
