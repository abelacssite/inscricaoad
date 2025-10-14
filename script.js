// A função 'db' é definida no index.html e deve estar globalmente acessível.

// Importa a função de consulta (Query) necessária para a verificação
// Se você não estiver usando módulos ES6 (import/export) e sim o script-compat,
// o método 'where' já estará disponível em 'firebase.firestore.FieldPath' (v8/compat).
// Vamos manter a sintaxe de compatibilidade que você estava usando.

function salvarCadastro(dados) {
    db.collection("Animais").add(dados)
    .then(() => {
        alert("Cadastro salvo com sucesso no Firebase!");
        // Opcional: atualizarLista(); 
    })
    .catch((error) => {
        console.error("ERRO COMPLETO AO TENTAR SALVAR:", error); 
        alert("Erro ao salvar cadastro: " + error.message); 
    });
}

/**
 * Verifica se já existe um cadastro com o mesmo número de telefone do tutor.
 * @param {string} telefone O número de telefone a ser verificado.
 * @param {object} dados Os dados completos do formulário.
 */
function verificarDuplicidade(telefone, dados) {
    // 1. Faz uma consulta na coleção 'Animais' para encontrar o telefone
    db.collection("Animais")
      .where("tutorTelefone", "==", telefone)
      .get()
      .then((querySnapshot) => {
          if (querySnapshot.empty) {
              // 2. Se a consulta retornar VAZIA, não há duplicidade.
              console.log("Nenhuma duplicidade encontrada. Prosseguindo com o salvamento.");
              salvarCadastro(dados);
          } else {
              // 3. Se retornar algum documento, a inscrição é duplicada.
              console.log("Duplicidade encontrada.");
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

    // Captura os valores
    const dados = {
        tutorNome: document.getElementById("tutorNome").value,
        tutorTelefone: document.getElementById("tutorTelefone").value, // Campo chave para verificação
        animalNome: document.getElementById("animalNome").value,
        animalEspecie: document.getElementById("animalEspecie").value,
        animalRaca: document.getElementById("animalRaca").value,
        animalIdade: document.getElementById("animalIdade").value,
        animalSexo: document.getElementById("animalSexo").value,
        animalPeso: document.getElementById("animalPeso").value,
    };
    
    // Antes de salvar, verifica se já existe o telefone
    verificarDuplicidade(dados.tutorTelefone, dados);

    // O reset foi movido para dentro de 'verificarDuplicidade'
    // para garantir que só limpe se a inscrição for salva ou se for um erro de duplicidade.

});
