// A função 'db' foi definida no index.html e está disponível aqui.
// NÃO REMOVA OU COMENTE A FUNÇÃO db = firebase.firestore(); NO index.html!

function salvarCadastro(dados) {
    // Define o nome da coleção no Firestore
    db.collection("Animais").add(dados)
    .then(() => {
        // Se o código chegar aqui, significa que salvou com sucesso
        alert("Cadastro salvo com sucesso no Firebase!");
        // Se você quiser ver a lista, chame aqui:
        // atualizarLista(); 
    })
    .catch((error) => {
        // ESSENCIAL: Isso será disparado se houver qualquer erro (regras, rede, config)
        
        // Imprime o erro completo no console para diagnóstico avançado
        console.error("ERRO COMPLETO AO TENTAR SALVAR:", error); 
        
        // Alerta o usuário com a mensagem de erro que o Firebase retornou
        // Se a mensagem for "Permission Denied", o problema são as regras.
        alert("Erro ao salvar cadastro: " + error.message); 
    });
}

// Ouve o evento de "submit" (envio) do formulário
document.getElementById("formCadastro").addEventListener("submit", function(e) {
    // ESSENCIAL: Impede o navegador de recarregar a página
    e.preventDefault();

    // Captura os valores de TODOS os campos do seu formulário
    const dados = {
        tutorNome: document.getElementById("tutorNome").value,
        tutorTelefone: document.getElementById("tutorTelefone").value,
        animalNome: document.getElementById("animalNome").value,
        animalEspecie: document.getElementById("animalEspecie").value,
        animalRaca: document.getElementById("animalRaca").value,
        animalIdade: document.getElementById("animalIdade").value,
        animalSexo: document.getElementById("animalSexo").value,
        animalPeso: document.getElementById("animalPeso").value,
    };

    // Chama a função que salva no Firebase
    salvarCadastro(dados);

    // Limpa os campos do formulário após o envio
    this.reset();
});
