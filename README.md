# 🌸 HIYUKI SUPREME V1 🌸

Uma base de bot para WhatsApp criada do zero, focada em ser leve, organizada e extremamente fácil de mexer. Se você é um dev iniciante, essa base foi feita pra você evoluir sem dor de cabeça.

---

## 🚀 Como Ligar a Hiyuki

A base oferece dois métodos de conexão principais. Escolha o que for melhor pra você:

1. **Via QR Code (Padrão):**
   ```bash
   sh start.sh
   ```
   *O bot vai gerar um código QR no terminal para você escanear com o WhatsApp.*

2. **Via Código de Emparelhamento (Pairing Code):**
   ```bash
   sh start.sh cod
   ```
   *Ideal para quem usa Termux ou VPS e não consegue escanear o QR Code.*

---

## ⚙️ Configuração (config.json)

Tudo que é essencial fica na pasta `database/config.json`. Lá você define:
- `NumeroDoDono`: Seu número (com código do país, ex: 5592...).
- `prefix`: O símbolo que o bot vai usar (ex: `!`, `#`).
- `NomeDoBot`: O nome que ela vai usar nas mensagens.

---

## 📂 Sistema de Plugins (A Magia da Base)

A Hiyuki usa um sistema de carregamento automático. Você não precisa registrar os comandos manualmente; basta criar o arquivo na pasta certa!

### 🛡️ Pastas Especiais:
Cada pasta dentro de `plugins/` tem um "superpoder":

- **`plugins/admin/`**: Qualquer comando aqui dentro **só pode ser usado por admins** do grupo. O bot verifica isso automaticamente.
- **`plugins/dono/`**: Comandos restritos apenas ao número que você colocou no `config.json`.
- **`plugins/premium/`**: Apenas para usuários que você adicionou na lista premium.
- **`plugins/cmds-aleatorios/`**: Comandos públicos para qualquer pessoa usar.

### 📝 Como criar um novo comando?
Basta criar um arquivo `.js` dentro de uma das pastas acima com essa estrutura:

```javascript
module.exports = {
    name: 'nome_do_comando',
    description: 'O que o comando faz',
    category: 'categoria',
    aliases: ['apelido1', 'apelido2'],
    async execute({ reply, q }) {
        // Sua lógica aqui
        reply('Olá, mundo!')
    }
}
```

---

## 📊 Menu Dinâmico e Gestão de Comandos

O menu da Hiyuki é inteligente. Ele lê os arquivos e se monta sozinho. Mas você tem controle total sobre ele:

- **Esconder um comando:** Se quiser tirar um comando do menu sem apagar o arquivo, use:
  - `!rmcmd [nome_do_comando]`
- **Trazer de volta:** Se mudou de ideia e quer que ele apareça no menu de novo, use:
  - `!rncmd [nome_do_comando]`

---

## ❄️ Funcionalidades Extras

- **Chokidar (Auto-Reload):** A base monitora seus arquivos. Se você editar um comando e salvar, o bot atualiza na hora sem precisar desligar e ligar de novo.
- **Bem-vindo:** Sistema automático de boas-vindas para novos membros em grupos (configurável em `plugins/admin/bemvindo.js`).
- **UserManager Inteligente:** Sistema que resolve problemas de IDs do WhatsApp (LID), garantindo que o bot sempre saiba quem é quem, mesmo com as atualizações de privacidade do Zap.

---

## 🛠️ Instalação de Módulos

Se você estiver começando do zero, use:
```bash
npm install --legacy-peer-deps
```
*Isso vai baixar todas as bibliotecas que eu deixei configuradas no `package.json`.*

---

### 🌸 Créditos
Criador: **MisheruModz**
*Mantenha os créditos, a base foi feita com carinho para a comunidade!*
