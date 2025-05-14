document.addEventListener("DOMContentLoaded", () => {
  carregarTarefas();

  // Pressionar Enter para adicionar tarefa
  document.getElementById("novaTarefa").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarTarefa();
    }
  });
});

function adicionarTarefa() {
  const input = document.getElementById("novaTarefa");
  const texto = input.value.trim();

  if (texto !== "") {
    criarTarefa(texto, false);
    salvarTarefas();
    input.value = "";
  }
}

function criarTarefa(texto, concluida) {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = concluida;

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      document.getElementById("tarefasConcluidas").appendChild(li);
    } else {
      document.getElementById("tarefasPendentes").appendChild(li);
    }
    salvarTarefas();
  });

  li.appendChild(checkbox);
  li.appendChild(document.createTextNode(" " + texto));

  if (concluida) {
    document.getElementById("tarefasConcluidas").appendChild(li);
  } else {
    document.getElementById("tarefasPendentes").appendChild(li);
  }
}

function salvarTarefas() {
  const tarefas = {
    pendentes: [],
    concluidas: [],
  };

  document.querySelectorAll("#tarefasPendentes li").forEach((li) => {
    tarefas.pendentes.push(li.innerText.trim());
  });

  document.querySelectorAll("#tarefasConcluidas li").forEach((li) => {
    tarefas.concluidas.push(li.innerText.trim());
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  const dados = localStorage.getItem("tarefas");
  if (dados) {
    const tarefas = JSON.parse(dados);
    tarefas.pendentes.forEach((texto) => criarTarefa(texto, false));
    tarefas.concluidas.forEach((texto) => criarTarefa(texto, true));
  }
}

function compartilharChecklist() {
  const pendentes = Array.from(document.querySelectorAll('#tarefasPendentes li')).map(li => {
    return formatarTextoWhatsApp(li.innerText);
  });

  const concluidas = Array.from(document.querySelectorAll('#tarefasConcluidas li')).map(li => {
    return formatarTextoWhatsApp(li.innerText);
  });

  let mensagem = '';

  if (pendentes.length > 0) {
    mensagem += '*PENDENTES:*\n' + pendentes.join('\n') + '\n\n';
  }

  if (concluidas.length > 0) {
    mensagem += '*CONCLUÍDAS:*\n' + concluidas.join('\n') + '\n\n';
  }

  const url = `https://wa.me/?text=${encodeURIComponent(mensagem.trim())}`;
  window.open(url, '_blank');
}

function formatarTextoWhatsApp(texto) {
  // Remove emojis se houver
  texto = texto.replace(/^✅|🔴/, '').trim();

  // Detecta @nome no final
  let nomeMarcado = '';
  const match = texto.match(/@[\wÀ-ÿ]+$/i);
  if (match) {
    nomeMarcado = ` ${match[0]}`;
    texto = texto.replace(match[0], '').trim();
  }

  return `• ${texto}${nomeMarcado}`;
}
