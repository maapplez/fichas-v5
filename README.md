# Fichas V5 — fase 1

Site de fichas com login, ficha de personagem e painel do mestre em tempo real.
Stack: React + Vite no front, Supabase (login, banco e tempo real) no back.

## Colocar no ar
1. Crie um projeto grátis em supabase.com.
2. No SQL Editor, rode o arquivo `supabase/schema.sql` inteiro.
3. Em Project Settings > API, copie a URL e a chave `anon`. Copie `.env.example` para `.env` e preencha.
4. `npm install` e depois `npm run dev` para testar localmente.
5. Para publicar: suba a pasta no GitHub e conecte na Vercel ou Netlify (build: `npm run build`, pasta `dist`). Cadastre as duas variáveis do `.env` no painel deles.
6. Cada jogador cria a própria conta na tela de login. Se quiser, desligue a confirmação por e-mail em Authentication > Providers > Email.

## Virar mestre
Depois de criar a sua conta, rode no SQL Editor:

    update profiles set role='master' where id=(select id from auth.users where email='SEU-EMAIL');

## Como funciona a segurança
As regras ficam no banco (RLS): jogador só lê e edita as próprias fichas; mestre lê e edita todas.

## Estrutura
- `src/Sheet.jsx`: ficha (atributos, perícias, vitalidade, vontade, fome, humanidade). Salva sozinha.
- `src/Master.jsx`: painel do mestre com atualização em tempo real.
- `src/data.js`: listas de atributos, perícias e cores por clã. Edite aqui para mudar nomes ou incluir temas.
- `src/styles.css`: todo o visual.
- `supabase/schema.sql`: tabelas e regras de acesso.

## Limitações conhecidas da fase 1
Se mestre e jogador editarem a mesma ficha no mesmo instante, vale a última gravação.
Catálogo, importador, assistente de criação, rolador, notas, inventário e relacionamentos entram nas fases 2 e 3.

## Fase 2: catálogo
1. No SQL Editor, rode `supabase/fase2.sql`.
2. Menu Catálogo: todos veem e buscam; qualquer jogador cadastra itens próprios; o mestre edita e apaga qualquer item e importa em massa.
3. Na ficha, a seção Poderes e traços adiciona itens do catálogo.
4. Importar o seu texto de regras: `node scripts/importar-texto.mjs regras.txt catalogo.json` (roda no seu computador, converte poderes, clãs e predadores). Depois, no Catálogo, use Importar JSON.
   Para outros tipos, o JSON é uma lista de objetos: `{"kind":"Vantagem","name":"...","level":2,"description":"...","source":"..."}`. Tipos aceitos: Clã, Poder, Ritual, Predador, Vantagem, Defeito, Convicção.
