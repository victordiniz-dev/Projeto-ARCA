# 🐾 Programa ARCA — Prefeitura da Serra/ES

> **Animais Resgatados, Cuidados e Acolhidos**
> Uma plataforma frontend de alta fidelidade e premium voltada à gestão de bem-estar animal, agendamento de castrações, denúncias de maus-tratos e socorros de emergência para o município da Serra/ES.

Este projeto representa o sistema completo do **Programa ARCA**, desenvolvido utilizando **HTML5**, **CSS3 (Vanilla)** e **JavaScript Modular Puro**, sem frameworks externos de renderização, garantindo velocidade instantânea de carregamento, compatibilidade universal e fidelidade visual exemplar.

---

## 🚀 Como Executar o Projeto

Como o sistema foi projetado para funcionar totalmente no lado do cliente (client-side), **não há necessidade de instalar dependências complexas ou rodar servidores de banco de dados**.

1. Faça o download ou clone o repositório.
2. Abra a pasta do projeto.
3. Dê um duplo-clique no arquivo **`index.html`** para abrir o site diretamente no seu navegador padrão.
4. Para acessar a área de login/cadastro, utilize qualquer e-mail e senha de exemplo (ou crie um novo usuário no formulário interativo de cadastro, que persistirá em seu navegador).

---

## 🎨 Sistema de Design & Identidade Visual

O design do Programa ARCA foi projetado para transmitir confiança, profissionalismo e carinho aos animais, utilizando as melhores práticas visuais modernas:

- **Paleta de Cores Harmônica**: Utilização de tons suaves de verde-pata (`#00D084`) e azul-cuidados (`#5B9FED`) com planos de fundo com aspecto de "vidro" (*glassmorphism*) e gradientes sutis para transições limpas.
- **Tipografia Premium**: Uso da fonte **Inter** (do Google Fonts), variando pesos de 300 a 800 para excelente legibilidade e hierarquia da informação.
- **Componentização Avançada**:
  - Botões com efeitos tridimensionais suaves ao passar o mouse (*hover*).
  - Badges dinâmicos de status (Pendente, Aprovado, Concluído, Cancelado).
  - Formulários com feedback de validação em tempo real e máscaras dinâmicas de CPF, Telefone e CEP.
  - Modais com efeito blur de fundo e suavização na entrada.

---

## 📄 Mapa de Páginas (11 Telas Inclusas)

### 🌐 Área Pública
1. **Home (`index.html`)**: Página institucional do Programa ARCA, contendo contadores numéricos interativos, timeline de funcionamento, carrossel de depoimentos e rodapé municipal completo.
2. **Adoção (`adocao.html`)**: Galeria de animais disponíveis para adoção na Serra, com painel lateral de filtros e modal detalhado para envio de solicitação.
3. **Resgate (`resgate.html`)**: Formulário intuitivo para solicitação de resgates de animais acidentados, com seletor de urgência interativo e upload com preview.
4. **Denúncia (`denuncia.html`)**: Canal de denúncias contra maus-tratos animais com opção de envio anônimo em conformidade estrita com a LGPD.
5. **Login (`login.html`)**: Portal de acesso rápido validando CPF ou e-mail de maneira dinâmica.
6. **Cadastro (`cadastro.html`)**: Formulário multi-etapas (*stepper*) para criação de novas contas, integrado à API pública **ViaCEP** para preenchimento de endereço automatizado.

### 🛡️ Painel do Tutor (Área Logada)
7. **Visão Geral (`dashboard.html`)**: Resumo de métricas rápidas do tutor (total de pets, agendamentos ativos, denúncias e solicitações) e listas de atalhos rápidos.
8. **Meus Pets (`meus-pets.html`)**: Grid gerenciável com cartões dos animais cadastrados do usuário, permitindo exclusão e acesso rápido ao agendamento.
9. **Cadastrar Pet (`cadastrar-pet.html`)**: Painel de upload interativo de foto (*drag & drop* com preview) e ficha médica detalhada para novos registros.
10. **Agendamento (`agendamento.html`)**: Agendamento de castração gratuita selecionando qual pet receberá o procedimento, data mínima validada e seleção inteligente de horários.
11. **Relatórios & Histórico (`relatorios.html`)**: Histórico consolidado de todas as atividades, integrando painel analítico com gráficos interativos do **Chart.js** (CDN) e exportação fictícia em PDF com loader animado.

---

## 💾 Persistência de Dados Local (LocalStorage Engine)

Para fornecer uma experiência realística e reativa sem a necessidade de um backend real, o projeto utiliza a engine do navegador (`LocalStorage`) de forma unificada. Todos os módulos JS se sincronizam utilizando as seguintes chaves padrão:

- `'arca_user'`: Dados do usuário atualmente logado no painel.
- `'arca_my_pets'`: Lista de pets cadastrados pelo tutor.
- `'arca_my_schedules'`: Histórico de agendamentos de castração realizados.
- `'arca_my_rescues'`: Histórico de solicitações de resgate efetuadas.
- `'arca_my_reports'`: Histórico de denúncias enviadas.

Se você registrar um novo pet em `cadastrar-pet.html`, ele aparecerá instantaneamente em `meus-pets.html`, no seletor de pets em `agendamento.html` e nos contadores de `dashboard.html`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**
- **CSS3 Puro** (Variáveis nativas, Flexbox, Grid Layout, Keyframes)
- **Vanilla JavaScript** (ES6+, modularizado por escopo)
- **ViaCEP API** (Integração de preenchimento inteligente de CEP)
- **Chart.js** (Renderização gráfica responsiva no Dashboard de Relatórios)
