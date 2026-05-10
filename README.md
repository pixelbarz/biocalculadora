<div align="center">

<br/>

```
⬡  BioCalculadora
```

### Plataforma de Análise de Qualidade do Bioetanol

**Diagnóstico técnico baseado nas normas ANP e ABNT — online, gratuito e acessível.**

<br/>

[![HTML](https://img.shields.io/badge/HTML-28%25-e34c26?style=flat-square&logo=html5&logoColor=white)](https://github.com/pixelbarz/biocalculadora)
[![CSS](https://img.shields.io/badge/CSS-43.6%25-563d7c?style=flat-square&logo=css3&logoColor=white)](https://github.com/pixelbarz/biocalculadora)
[![JavaScript](https://img.shields.io/badge/JavaScript-28.4%25-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://github.com/pixelbarz/biocalculadora)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?style=flat-square&logo=github)](https://pixelbarz.github.io/biocalculadora/)
[![License](https://img.shields.io/badge/licença-MIT-green?style=flat-square)](LICENSE)

<br/>

[**🌐 Acessar Demo ao Vivo**](https://pixelbarz.github.io/biocalculadora/) · [Reportar Bug](https://github.com/pixelbarz/biocalculadora/issues) · [Sugerir Feature](https://github.com/pixelbarz/biocalculadora/issues)

<br/>

</div>

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Parâmetros Analisados](#-parâmetros-analisados)
- [Tecnologias](#-tecnologias)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Normas de Referência](#-normas-de-referência)
- [Público-Alvo](#-público-alvo)
- [Autores](#-autores)

---

## 🌱 Sobre o Projeto

A **BioCalculadora** é uma plataforma web desenvolvida para democratizar o acesso a ferramentas de controle de qualidade no setor sucroenergético brasileiro. A partir de parâmetros laboratoriais inseridos pelo usuário, a aplicação realiza o diagnóstico completo da qualidade do bioetanol com base nas regulamentações vigentes da **ANP** (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis) e nas normas técnicas da **ABNT**.

Desenvolvida por estudantes do **Colégio La Salle – Lucas do Rio Verde/MT**, a ferramenta oferece análise técnica rigorosa com interface acessível, sendo totalmente gratuita e disponível 24 horas via navegador.

---

## ✨ Funcionalidades

- **Diagnóstico em tempo real** com pontuação e classificação da amostra
- **Suporte a dois tipos de etanol**: Anidro (≥ 99,3 °GL) e Hidratado (≥ 92,6 °GL)
- **7 parâmetros analisados** com limites baseados nas normas ANP/ABNT
- **Barra de qualidade visual** com feedback imediato por indicadores coloridos
- **Exportação de relatório** em PDF com os resultados da análise
- **Tabela de referência regulatória** com as normas NBR aplicáveis
- **Interface responsiva** — funciona em desktop, tablet e mobile
- **Menu mobile** com hambúrguer e navegação suave por âncoras
- **Banner de cookies** com opção de aceitar ou rejeitar
- **Design moderno** com tipografia Montserrat + Merriweather e paleta verde institucional

---

## 📊 Parâmetros Analisados

| Parâmetro | Etanol Anidro | Etanol Hidratado | Norma |
|---|---|---|---|
| Teor Alcoólico | ≥ 99,3 °GL | ≥ 92,6 °GL | NBR 5992 |
| Teor de Água (%v/v) | ≤ 0,7% | ≤ 7,4% | NBR 15531 |
| Acidez Total (mg/100mL) | ≤ 30 | ≤ 30 | NBR 9866 |
| Condutividade Elétrica (µS/cm) | ≤ 500 | ≤ 500 | NBR 10547 |
| pH | 6,0 – 8,0 | 6,0 – 8,0 | NBR 10891 |
| Densidade (g/mL a 20°C) | 0,789 – 0,792 | 0,800 – 0,811 | NBR 5992 |
| Temperatura de Medição (°C) | Referência: 20°C | Referência: 20°C | — |

---

## 🛠 Tecnologias

Este projeto foi construído exclusivamente com tecnologias web nativas — sem frameworks ou dependências externas:

- **HTML5** — estrutura semântica e acessível
- **CSS3** — layout responsivo com Flexbox/Grid, variáveis CSS e animações
- **JavaScript (ES6+)** — lógica de cálculo, manipulação do DOM e exportação de relatório
- **Google Fonts** — tipografia Montserrat e Merriweather
- **GitHub Pages** — deploy estático e gratuito

---

## 🚀 Como Usar

### Acessar online

Acesse diretamente pelo navegador, sem instalação:

```
https://pixelbarz.github.io/biocalculadora/
```

### Rodar localmente

```bash
# Clone o repositório
git clone https://github.com/pixelbarz/biocalculadora.git

# Entre na pasta
cd biocalculadora

# Abra o arquivo no navegador
# Linux / macOS
xdg-open index.html

# Ou abra manualmente no seu navegador de preferência
```

> Não requer servidor, compilação ou instalação de dependências. Basta abrir o `index.html`.

---

## 📁 Estrutura do Projeto

```
biocalculadora/
├── index.html       # Estrutura e conteúdo da aplicação
├── style.css        # Estilização completa (responsividade, animações, tema)
├── script.js        # Lógica de cálculo, validação e exportação
└── favicon.ico      # Ícone da aplicação
```

---

## 📜 Normas de Referência

- [**Resolução ANP nº 907/2022**](https://atosoficiais.com.br/anp/resolucao-n-907-2022-dispoe-sobre-as-especificacoes-do-etanol-combustivel-e-suas-regras-de-comercializacao-em-todo-o-territorio-nacional) — Especificações do etanol combustível
- [**ABNT**](https://abnt.org.br/) — Normas técnicas NBR 5992, 9866, 10547, 10891, 15531
- [**MAPA**](https://www.gov.br/agricultura/pt-br) — Ministério da Agricultura, Pecuária e Abastecimento

---

## 👥 Público-Alvo

| Setor | Aplicação |
|---|---|
| 🏭 **Usinas** | Controle de qualidade na produção |
| 🚛 **Distribuidoras** | Validação no recebimento de cargas |
| ⛽ **Postos de Combustível** | Verificação antes do abastecimento |
| 🔬 **Laboratórios** | Diagnóstico rápido e referenciado |

---

## 👨‍🎓 Autores

Desenvolvido por estudantes do curso técnico do **[Colégio La Salle – Lucas do Rio Verde, MT](https://lasalle.edu.br/lucas/)**.

---

<div align="center">

<br/>

**⬡ BioCalculadora** — Tecnologia a serviço do agronegócio brasileiro 🌿

</div>
