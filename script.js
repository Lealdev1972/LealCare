// =====================================================
// script.js - LealCare (Versão com Regras de Negócio)
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

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
});

// ====================== LOGIN ======================
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
            <h4>Acesso Interno</h4>
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

    msg.textContent = "Acesso liberado!";
    msg.style.color = "green";

    setTimeout(() => {
        fecharModal("loginInterno");
        abrirModal("clientes");
    }, 800);
};

// ====================== AGENDAMENTO - COM REGRAS ======================
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

    // === EVITAR DUPLICADOS ===
    const duplicado = clientes.some(c => 
        c.nome.toLowerCase() === nome.toLowerCase() &&
        c.pet.toLowerCase() === pet.toLowerCase() &&
        c.data === data
    );

    if (duplicado) {
        alert("Este agendamento já existe para este tutor e pet na mesma data.");
        return;
    }

    // === LIMITAR A 10 AGENDAMENTOS POR DIA ===
    const agendamentosNoDia = clientes.filter(c => c.data === data).length;

    if (agendamentosNoDia >= 10) {
        alert("Limite de 10 agendamentos por dia atingido para esta data.");
        return;
    }

    // Salvar
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

    alert("✅ Agendamento realizado com sucesso!");

    limparFormularioAgendamento();
    fecharModal("agendamento");
};

function limparFormularioAgendamento() {
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("pet").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("data").value = "";
    document.getElementById("horario").value = "";
}

// ====================== PAINEL INTERNO ======================
function listarClientes() {
    const lista = document.getElementById("listaClientes");
    if (!lista) return;

    const hoje = new Date().toISOString().split('T')[0]; // data atual no formato YYYY-MM-DD

    // Separar agendamentos do dia atual
    const hojeLista = clientes.filter(c => c.data === hoje);
    const outros = clientes.filter(c => c.data !== hoje);

    let html = `<h4 style="margin:15px 0 10px; color:#166534;">Agendamentos de Hoje (${hojeLista.length})</h4>`;

    if (hojeLista.length === 0) {
        html += `<p style="color:#666; padding:10px;">Nenhum agendamento para hoje.</p>`;
    } else {
        hojeLista.forEach(c => {
            html += `
                <li style="background:#f0fdf4; padding:12px; margin:8px 0; border-radius:8px;">
                    <strong>${c.nome}</strong> — ${c.pet} (${c.tipo})<br>
                    📧 ${c.email} | 📞 ${c.telefone}<br>
                    🕒 ${c.horario}
                </li>`;
        });
    }

    html += `<h4 style="margin:25px 0 10px; color:#166534;">Outros Agendamentos (${outros.length})</h4>`;

    if (outros.length === 0) {
        html += `<p style="color:#666;">Nenhum outro agendamento registrado.</p>`;
    } else {
        outros.forEach(c => {
            html += `
                <li style="padding:10px 0; border-bottom:1px solid #eee;">
                    <strong>${c.nome}</strong> — ${c.pet} (${c.tipo})<br>
                    📅 ${c.data} | 🕒 ${c.horario}
                </li>`;
        });
    }

    lista.innerHTML = html;
}

// ====================== INICIALIZAÇÃO ======================
window.addEventListener("load", () => {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.style.display = "none";
    });
});
