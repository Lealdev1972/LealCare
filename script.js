// =====================================================
// script.js - LealCare (Versão Final Corrigida)
// =====================================================

let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

// ====================== MODAIS ======================
window.abrirModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "flex";
        
        if (id === "loginInterno") {
            montarLoginArea();
        }
    }
};

window.fecharModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
};

// Fechar modal clicando fora
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
});

// ====================== LOGIN - ACESSO INTERNO ======================
function montarLoginArea() {
    const area = document.getElementById("loginArea");
    if (!area) return;

    if (funcionarios.length === 0) {
        area.innerHTML = `
            <h4>Primeiro Acesso - Administrador</h4>
            <div class="campo"><label>Usuário</label><input type="text" id="novoUser" placeholder="Usuário administrador"></div>
            <div class="campo"><label>Senha</label><input type="password" id="novaSenha" placeholder="Senha"></div>
            <button class="btn-full" onclick="cadastrarFuncionario()">Cadastrar Administrador</button>
            <p id="msgLogin"></p>
        `;
    } else {
        area.innerHTML = `
            <h4>Identificação de Funcionário</h4>
            <div class="campo"><label>Usuário</label><input type="text" id="loginUser" placeholder="Seu usuário"></div>
            <div class="campo"><label>Senha</label><input type="password" id="loginSenha" placeholder="Sua senha"></div>
            <button class="btn-full" onclick="entrarFuncionario()">Entrar</button>
            <p id="msgLogin"></p>
        `;
    }
}

window.cadastrarFuncionario = function() {
    const usuario = document.getElementById("novoUser").value.trim();
    const senha = document.getElementById("novaSenha").value.trim();
    const msg = document.getElementById("msgLogin");

    if (!usuario || !senha) {
        msg.textContent = "Preencha usuário e senha.";
        msg.style.color = "red";
        return;
    }

    funcionarios.push({ usuario, senha });
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

    msg.textContent = "Administrador cadastrado com sucesso!";
    msg.style.color = "green";

    setTimeout(() => montarLoginArea(), 1500);
};

window.entrarFuncionario = function() {
    const usuario = document.getElementById("loginUser").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();
    const msg = document.getElementById("msgLogin");

    const valido = funcionarios.find(f => f.usuario === usuario && f.senha === senha);

    if (!valido) {
        msg.textContent = "Usuário ou senha incorretos.";
        msg.style.color = "red";
        return;
    }

    msg.textContent = "Acesso liberado! Carregando painel...";
    msg.style.color = "green";

    setTimeout(() => {
        fecharModal("loginInterno");
        abrirModal("clientes");
        listarClientes();
    }, 800);
};

// ====================== AGENDAMENTO - CORRIGIDO ======================
window.salvarAgendamento = function() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const pet = document.getElementById("pet").value.trim();
    const tipo = document.getElementById("tipo").value || "Não informado";
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;

    if (!nome || !email || !telefone || !pet || !data || !horario) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Salva os dados
    clientes.push({
        nome,
        email,
        telefone,
        pet,
        tipo,
        data,
        horario
    });

    localStorage.setItem("clientes", JSON.stringify(clientes));

    // Mensagem de sucesso
    alert("✅ Agendamento realizado com sucesso!");

    // Limpa o formulário automaticamente
    limparFormularioAgendamento();

    // Fecha o modal
    fecharModal("agendamento");
};

// Função para limpar o formulário
function limparFormularioAgendamento() {
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("pet").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("data").value = "";
    document.getElementById("horario").value = "";
    document.getElementById("msg").innerHTML = "";
}

// ====================== LISTA DE AGENDAMENTOS ======================
function listarClientes() {
    const lista = document.getElementById("listaClientes");
    if (!lista) return;

    if (clientes.length === 0) {
        lista.innerHTML = "<li style='padding:15px; color:#666;'>Nenhum agendamento registrado ainda.</li>";
        return;
    }

    let html = "";
    clientes.forEach(c => {
        html += `
            <li style="padding:12px 0; border-bottom:1px solid #eee;">
                <strong>${c.nome}</strong> — ${c.pet} (${c.tipo})<br>
                📧 ${c.email} | 📞 ${c.telefone}<br>
                📅 ${c.data} às ${c.horario}
            </li>
        `;
    });
    lista.innerHTML = html;
}

// ====================== INICIALIZAÇÃO ======================
window.addEventListener("load", () => {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.style.display = "none";
    });
});