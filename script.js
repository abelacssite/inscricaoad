// A função 'db' é definida no index.html e deve estar globalmente acessível.

/**
 * Função utilitária para limpar o telefone, removendo tudo que não for número.
 * Ex: "(11) 98765-4321" -> "11987654321"
 */
function limparTelefone(telefone) {
    // Remove todos os caracteres que não são dígitos (0-9)
    return telefone.replace(/\D/g, ''); 
}

function salvarCadastro(dados) {
    db.collection("Animais").add(dados)
    .then(() => {
        alert("Cadastro salvo com sucesso no Firebase!");
        document.getElementById("formCadastro").reset(); // Limpa aqui após o sucesso
    })
    .catch((error) => {
        console.error("ERRO COMPLETO AO TENTAR SALVAR:", error); 
        alert("Erro ao salvar cadastro: " + error.message); 
    });
}

function verificarDuplicidade(telefoneLimpo, dados) {
    // 1. Faz a busca usando o número de telefone LIMPO
    db.collection("Animais")
      .where("tutorTelefone", "==", telefoneLimpo) 
      .get()
      .then((querySnapshot) => {
          if (querySnapshot.empty) {
              // 2. Se não encontrou, salva.
              salvarCadastro(dados);
          } else {
              // 3. Duplicidade encontrada.
              alert("Erro: Já existe um cadastro registrado com este número de telefone!");
              document.getElementById("formCadastro").reset(); // Limpa o formulário
          }
      })
      .catch((error) => {
          console.error("Erro ao verificar duplicidade:", error);
          alert("Ocorreu um erro ao verificar a duplicidade. Tente novamente.");
      });
}


// Ouve o evento de "submit" (envio) do formulário
document.getElementById("formCadastro").addEventListener("submit", function(e) {
    e.preventDefault();

    // Captura o telefone e o limpa IMEDIATAMENTE
    const telefone = document.getElementById("tutorTelefone").value;
    const telefoneLimpo = limparTelefone(telefone);

    // Captura os demais valores, usando o telefone limpo no objeto de dados
    const dados = {
        tutorNome: document.getElementById("tutorNome").value,
        tutorTelefone: telefoneLimpo, // **SALVA o número LIMPO no Firebase**
        animalNome: document.getElementById("animalNome").value,
        animalEspecie: document.getElementById("animalEspecie").value,
        animalRaca: document.getElementById("animalRaca").value,
        animalIdade: document.getElementById("animalIdade").value,
        animalSexo: document.getElementById("animalSexo").value,
        animalPeso: document.getElementById("animalPeso").value,
    };
    
    // Antes de salvar, verifica se já existe o telefone limpo
    verificarDuplicidade(telefoneLimpo, dados);
});
