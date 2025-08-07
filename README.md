# gerenciamento-de-tarefas

# Projeto de Lista de Tarefas (To-Do List App)

Este é um projeto simples que demonstra a comunicação entre um aplicativo **React Native** (frontend) e uma API **PHP** (backend). O aplicativo permite gerenciar uma lista de tarefas, com funcionalidades de adicionar, visualizar, editar e remover itens.

## 🚀 Funcionalidades

- **Visualizar Tarefas**: Exibe todas as tarefas existentes.
- **Adicionar Tarefa**: Permite criar uma nova tarefa.
- **Editar Tarefa**: Altera o título de uma tarefa existente.
- **Marcar como Concluída**: Alterna o status `completed` de uma tarefa.
- **Deletar Tarefa**: Remove uma tarefa da lista.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- **React Native**
- **JavaScript**
- **Hooks:** `useState`, `useEffect`
- **Componentes:** `FlatList`, `TextInput`, `TouchableOpacity`

**Backend:**
- **PHP**
- **API RESTful**
- **JSON** (para simular a base de dados)

---

## ⚙️ Pré-requisitos

Para rodar este projeto, você precisará ter o seguinte instalado em sua máquina:

**Para o Frontend (React Native):**
- **Node.js e npm** (ou Yarn)
- **React Native CLI** ou **Expo CLI**
- **Android Studio** ou **Xcode** para rodar em emuladores.

**Para o Backend (PHP):**
- Um **servidor web** com suporte a PHP. Recomendamos ferramentas como:
  - **XAMPP** (Windows, macOS, Linux)
  - **MAMP** (macOS)
  - **WAMP** (Windows)
  - Ou o servidor embutido do PHP (`php -S localhost:8000`)

---

## 🔧 Configuração e Instalação

### Backend (API PHP)

1.  Crie uma pasta para o backend, por exemplo, `php-backend`.
2.  Copie os arquivos `api.php` e `tasks.json` para dentro desta pasta.
3.  Coloque a pasta `php-backend` no diretório raiz do seu servidor web (por exemplo, a pasta `htdocs` do XAMPP).
4.  Certifique-se de que o servidor Apache (ou similar) e o PHP estejam em execução.

A sua API estará acessível em um endereço como `http://localhost/php-backend/api.php`.

### Frontend (React Native)

1.  Navegue até a pasta do seu projeto React Native no terminal.
2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  **Ajuste a URL da API**: Abra o arquivo `App.js` e localize a constante `API_URL`. **Você deve alterá-la para o endereço IP da sua máquina** para que o emulador possa se conectar ao seu servidor local.
    - Se estiver usando um emulador Android, substitua `10.0.2.2` pelo IP da sua máquina na sua rede local. Ex: `http://192.168.1.5/php-backend/api.php`
    - Para emuladores iOS, `http://localhost:8080` geralmente funciona.

    ```javascript
    // Em App.js
    const API_URL = 'http://SEU_IP_AQUI/php-backend/api.php';
    ```

4.  Execute o aplicativo:
    - **Para Android:**
      ```bash
      npx react-native run-android
      ```
    - **Para iOS:**
      ```bash
      npx react-native run-ios
      ```

---

## 🌐 Como Funciona

- O **Frontend** (`App.js`) gerencia a interface do usuário e o estado da aplicação.
- Ele envia requisições HTTP (`GET`, `POST`, `PUT`, `DELETE`) para o **Backend** (`api.php`).
- O **Backend** recebe essas requisições, manipula o arquivo `tasks.json` (que atua como um banco de dados simples) e retorna uma resposta no formato JSON.
- O **Frontend** recebe a resposta, atualiza seu estado e renderiza a nova lista de tarefas na tela.
