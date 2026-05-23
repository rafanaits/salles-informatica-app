# 🖥️ Salles Informática - App

Aplicativo mobile desenvolvido em **React Native** com **Expo** para gerenciamento de vendas e ordens de serviço da Salles Informática.

## 📱 Funcionalidades

- **Dashboard** — Resumo de OS abertas, em andamento, concluídas e total de vendas do mês
- **Ordens de Serviço** — Abertura, acompanhamento e alteração de status (Aberta → Em andamento → Concluída → Entregue)
- **Vendas** — Registro de vendas de peças e acessórios com controle financeiro
- **Clientes** — Cadastro e busca de clientes

## 🚀 Como rodar

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npx expo start
```

Escaneie o QR Code com o app **Expo Go** no celular.

## 🛠️ Tecnologias

- React Native
- Expo
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage (armazenamento local)
- JavaScript / JSX

## 📂 Estrutura

```
├── App.js                    # Navegação principal
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.js
│   │   ├── OSScreen.js
│   │   ├── NovaOSScreen.js
│   │   ├── DetalhesOSScreen.js
│   │   ├── ClientesScreen.js
│   │   ├── NovoClienteScreen.js
│   │   ├── VendasScreen.js
│   │   └── NovaVendaScreen.js
│   └── utils/
│       └── storage.js        # Funções de persistência
├── package.json
└── app.json
```

## 👨‍💻 Autor

**Rafaell Salles** — Trabalho de Extensão - Desenvolvimento Mobile com React Native

## 📄 Licença

Este projeto foi desenvolvido como atividade acadêmica de extensão.
