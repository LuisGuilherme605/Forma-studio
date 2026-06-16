#  Forma Studio — Landing Page

Landing page institucional para uma agência de design criativo, desenvolvida com **HTML, CSS e JavaScript puro** — sem frameworks, sem dependências externas.

 **[Ver site ao vivo](https://luisguilherme605.github.io/Forma-studio/)**

---

##  Preview

> <img width="1249" height="588" alt="{C565815E-E96C-4180-9605-008AECA5893B}" src="https://github.com/user-attachments/assets/c296a9e1-e40b-4dee-a426-33c8466ae900" />

---

##  Funcionalidades

- Hero com layout dividido em duas colunas e animações de entrada
- Marquee (faixa animada) com os serviços da agência — pausa ao passar o mouse
- Seção de estatísticas com **contadores animados** (count-up) ao rolar a página
- Grid de serviços com hover interativo e indicador animado
- Portfólio com cards, títulos sempre visíveis e elevação suave no hover
- Processo em 4 etapas com ícones SVG
- Seção de depoimentos de clientes
- **Seção FAQ** com acordeão acessível
- **Estudos de caso** — cards do portfólio abrem um modal acessível (foco preso, ESC, métricas e narrativa de cada projeto)
- **Modo escuro/claro** com toggle, persistência em `localStorage` e respeito à preferência do sistema
- **Formulário de contato funcional** — envio via `fetch` (compatível com Formspree), estados de envio/sucesso/erro, honeypot anti-spam e fallback por e-mail
- **PWA** — instalável no celular, com `manifest` e service worker (cache offline)
- **Menu mobile** (hambúrguer) com transição suave
- **Barra de progresso de leitura** no topo
- **Botão "voltar ao topo"**
- **Scrollspy** — destaca o link da seção visível na navegação
- Footer completo com links funcionais (âncoras, mailto, tel)
- Cursor customizado (apenas desktop, desativado em touch)
- Ano de copyright dinâmico
- Layout 100% responsivo para mobile
- **SEO completo** — OG image (1200×630), dados estruturados JSON-LD, `sitemap.xml`, `robots.txt`, favicons/ícones e página **404** personalizada
- Acessibilidade: skip link, foco visível, ARIA e suporte a `prefers-reduced-motion`

> ℹ️ **Ativar o envio do formulário:** crie um formulário gratuito em [formspree.io](https://formspree.io), copie o ID e substitua `SUA_FORM_ID` no atributo `data-endpoint` do `<form>` em `index.html`. Sem isso, o formulário usa automaticamente o fallback por e-mail.

---

##  Tecnologias utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

**Fontes:** Playfair Display + DM Sans via Google Fonts

---

##  Design

O projeto utiliza uma paleta sofisticada com tema creme e dourado, tipografia serifada para títulos e sans-serif para corpo do texto — criando um visual premium e editorial.

| Variável | Cor | Uso |
|----------|-----|-----|
| `--cream` | `#F5F0E8` | Background principal |
| `--dark` | `#1A1814` | Texto e seções escuras |
| `--accent` | `#C8A96E` | Dourado — destaques e CTAs |
| `--muted` | `#8C8578` | Textos secundários |

---

##  Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/LuisGuilherme605/Forma-studio.git

# Acesse a pasta
cd Forma-studio

# Abra no navegador
# Basta abrir o index.html — não precisa de servidor
```

Ou use a extensão **Live Server** no VS Code para recarregamento automático.

---

##  Estrutura do projeto

```
Forma-studio/
├── index.html    # Estrutura HTML com meta tags de SEO e acessibilidade
├── style.css     # Estilos CSS (layout, animações, responsivo)
├── script.js     # JavaScript (menu, scrollspy, contadores, FAQ, formulário, cursor)
├── .gitignore    # Arquivos ignorados pelo Git
└── README.md     # Documentação do projeto
```

---

##  O que aprendi

- Criação de layouts complexos com CSS Grid e Flexbox
- Animações CSS puras com `@keyframes` e `animation-delay`
- Scroll reveal com `IntersectionObserver` (JavaScript nativo)
- Cursor customizado com rastreamento de mouse
- Marquee infinita com CSS animation
- Design responsivo com media queries
- Variáveis CSS (`custom properties`) para consistência visual
- Boas práticas de SEO com meta tags Open Graph e Twitter Card
- Acessibilidade web com atributos ARIA

---

##  Outros projetos

| Projeto | Link |
|---------|------|
| Portfólio Pessoal | [Ver repositório](https://github.com/LuisGuilherme605/portfolio-luis-guilherme) |
| Vortex Arquitetura | [Ver repositório](https://github.com/LuisGuilherme605/vortex-arquitetura) |

---

<div align="center">
  Feito com 💙 por <a href="https://github.com/LuisGuilherme605">Luis Guilherme</a>
</div>
