// A variável 'db' é definida no index.html e deve estar globalmente acessível.

// Variável para armazenar a referência ao botão de cadastro
const botaoCadastro = document.querySelector('#formCadastro button[type="submit"]');

/**
 * Função principal para salvar os dados no Firestore.
 * @param {object} dados Os dados do formulário a serem salvos.
 */
function salvarCadastro(dados) {
    // Define o nome da coleção no Firestore e adiciona os dados
    db.collection("Animais").add(dados)
    .then((docRef) => {
        // SUCESSO!
        const numeroInscricao = docRef.id;
        
        gerarComprovante(numeroInscricao, dados);

        alert(`Cadastro realizado com sucesso! Numero da Inscricao: ${numeroInscricao}`);
        
        // FIM DA OPERAÇÃO: Reabilita o botão e limpa o formulário
        botaoCadastro.disabled = false;
        document.getElementById("formCadastro").reset();
    })
    .catch((error) => {
        // FALHA!
        console.error("ERRO COMPLETO AO TENTAR SALVAR:", error); 
        alert("Erro ao salvar cadastro. Por favor, verifique sua conexao, regras ou indice do Firebase: " + error.message); 
        
        // FIM DA OPERAÇÃO: Reabilita o botão
        botaoCadastro.disabled = false;
    });
}

/**
 * Verifica se já existe um cadastro com o mesmo Nome do Tutor E Nome do Animal.
 * Depende de um indice composto no Firebase (tutorNome, animalNome) para funcionar.
 * @param {object} dados Os dados do formulário a serem salvos.
 */
function verificarDuplicidade(dados) {
    
    // 1. Desabilita o botão (feito no submit, mas mantido para segurança)
    botaoCadastro.disabled = true; 

    // 2. Faz uma consulta composta na coleção 'Animais'
    db.collection("Animais")
      .where("tutorNome", "==", dados.tutorNome) // Filtra pelo Nome do Tutor
      .where("animalNome", "==", dados.animalNome) // Filtra pelo Nome do Animal
      .get()
      .then((querySnapshot) => {
          if (querySnapshot.empty) {
              // 3. Se a consulta retornar VAZIA, não há duplicidade, então salva.
              salvarCadastro(dados);
          } else {
              // 4. Se retornar algum documento, a inscrição é duplicada.
              alert("Erro: Este cadastro (Tutor e Animal) ja esta registrado!");
              document.getElementById("formCadastro").reset();
              
              // 5. Reabilita o botão
              botaoCadastro.disabled = false;
          }
      })
      .catch((error) => {
          // Captura erros de rede ou, mais importante, erro de ÍNDICE do Firebase
          console.error("Erro ao verificar duplicidade:", error);
          alert("Ocorreu um erro ao verificar a duplicidade. Verifique o console para criar o índice necessário.");
          
          // Reabilita o botão
          botaoCadastro.disabled = false;
      });
}

/**
 * Gera e inicia o download de um arquivo de texto (.txt) com os dados da inscrição.
 * O texto base foi limpo de acentos e 'C' para evitar problemas de codificacao.
 * @param {string} numeroInscricao O ID gerado pelo Firestore (o numero da inscricao).
 * @param {object} dados Os dados completos do formulario.
 */
function gerarComprovante(numeroInscricao, dados) {
    
    // Formata o comprovante com todos os dados - Texto SEM ACENTOS
    const comprovanteTexto = `
--- COMPROVANTE DE INSCRICAO PARA CASTRACAO ---

NUMERO DA INSCRICAO: ${numero
