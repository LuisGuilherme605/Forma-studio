# Forma Studio

Landing page de uma agência de design (fictícia) que fiz pra praticar front-end.
HTML, CSS e JavaScript puro, sem framework.

**Ver online:** https://luisguilherme605.github.io/Forma-studio/

## O que tem

- hero em duas colunas com animação de entrada
- faixa animada (marquee) com os serviços
- contadores que animam quando aparecem na tela
- portfólio com cards e estudos de caso que abrem num modal
- FAQ em acordeão
- modo claro/escuro que lembra a escolha (localStorage)
- formulário de contato funcional (via Formspree, com fallback por email)
- dá pra instalar como app no celular (PWA)
- responsivo, com uns cuidados de acessibilidade e SEO

> Pra ligar o envio do formulário: cria um form grátis no [formspree.io](https://formspree.io)
> e troca o `SUA_FORM_ID` no `data-endpoint` do `<form>` no `index.html`. Sem isso
> ele cai no fallback por email.

## Rodando localmente

```bash
git clone https://github.com/LuisGuilherme605/Forma-studio.git
cd Forma-studio
```

Abre o `index.html` no navegador, ou usa o Live Server no VS Code.
