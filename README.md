# Custom Energia Solar — Site Institucional

Site estático em HTML5 + CSS3 + Vanilla JS para `customenergiasolar.com.br`.

## Estrutura de arquivos

```
custom-energia-solar/
├── index.html          → Página principal (one-page)
├── css/
│   └── style.css       → Todos os estilos (variáveis, seções, responsivo)
├── js/
│   └── script.js       → Simulador, carrossel, FAQ, formulários
├── assets/
│   └── img/
│       ├── LEIA-ME.txt → Instruções de quais imagens copiar aqui
│       ├── logo.png    → Logo principal (a adicionar)
│       ├── hero-bg.jpg → Foto do hero (a adicionar)
│       └── projeto-*.jpg → Fotos do portfólio (a adicionar)
├── vercel.json         → Configuração de deploy Vercel
├── .gitignore
└── README.md
```

---

## Como fazer o deploy

### 1. Adicionar as imagens

Siga as instruções em `assets/img/LEIA-ME.txt` para copiar:
- Logo (`logo.png`)
- Foto do hero (`hero-bg.jpg`)
- 6 fotos de projetos (`projeto-1.jpg` a `projeto-6.jpg`)
- Favicon (`favicon.png`)

### 2. Criar repositório no GitHub

```bash
# Na pasta do projeto:
git init
git add .
git commit -m "feat: site institucional Custom Energia Solar"

# No GitHub.com: crie um repositório público ou privado
# Ex: github.com/seu-usuario/custom-energia-solar

git remote add origin https://github.com/SEU_USUARIO/custom-energia-solar.git
git branch -M main
git push -u origin main
```

### 3. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New → Project"**
3. Importe o repositório `custom-energia-solar`
4. Vercel detecta automaticamente que é um site estático
5. Clique em **"Deploy"** — pronto!

A Vercel fornecerá uma URL temporária tipo `custom-energia-solar.vercel.app`.

### 4. Configurar domínio no Vercel

1. No painel do projeto na Vercel: **Settings → Domains**
2. Adicione `customenergiasolar.com.br` e `www.customenergiasolar.com.br`
3. A Vercel mostrará os registros DNS que você precisa configurar

### 5. Configurar DNS no HostGator

No painel do HostGator (cPanel → Gerenciador de DNS ou zona DNS):

| Tipo | Nome (Host) | Valor (Conteúdo)           | TTL  |
|------|-------------|----------------------------|------|
| A    | @           | 76.76.21.21                | 3600 |
| A    | www         | 76.76.21.21                | 3600 |

> **Atenção:** Os IPs da Vercel podem mudar. Sempre use os valores que a Vercel indicar em **Settings → Domains**.

**Alternativa com CNAME (recomendada para www):**

| Tipo  | Nome (Host) | Valor (Conteúdo)      | TTL  |
|-------|-------------|-----------------------|------|
| A     | @           | 76.76.21.21           | 3600 |
| CNAME | www         | cname.vercel-dns.com  | 3600 |

Após salvar, aguarde de 30 minutos a 48 horas para propagação do DNS.

### 6. HTTPS automático

A Vercel provisiona SSL/TLS (HTTPS) automaticamente via Let's Encrypt após o DNS propagar. Nenhuma ação necessária.

---

## Atualizações futuras

Toda vez que fizer `git push` no GitHub, a Vercel vai redeploy automaticamente em ~30 segundos.

```bash
# Editar um arquivo...
git add .
git commit -m "fix: atualiza texto da seção de soluções"
git push
```

---

## Seções que precisam de conteúdo real

- [ ] **Preços/Tabela** — aguardando dados do sócio (seção a ser adicionada depois)
- [ ] **Fotos reais** — copiar de `03-MATERIAIS-DE-MARKETING/FOTOS-REAIS-INSTALACOES/`
- [ ] **Depoimentos reais** — substituir os textos de exemplo por depoimentos reais de clientes
- [ ] **Redes sociais** — atualizar links do Instagram, Facebook e LinkedIn no footer
- [ ] **E-mail** — confirmar `contato@customenergiasolar.com.br` e configurar no cPanel

---

## Tecnologias utilizadas

- HTML5 semântico (landmarks, ARIA, schema.org)
- CSS3 com Custom Properties (variáveis CSS)
- JavaScript ES6+ (sem frameworks, sem dependências npm)
- [Montserrat](https://fonts.google.com/specimen/Montserrat) — Google Fonts
- [Lucide Icons](https://lucide.dev) — ícones via CDN
- IntersectionObserver API — animações on scroll
- WhatsApp API — `wa.me` para formulários

---

Desenvolvido com ❤️ para **Custom Energia Solar Ltda** · CNPJ 53.261.263/0001-60
