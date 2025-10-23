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
        
        // FIM DA OPERAÇÃO: Reabilita o botão
        botaoCadastro.disabled = false;
        document.getElementById("formCadastro").reset();
    })
    .catch((error) => {
        // FALHA!
        console.error("ERRO COMPLETO AO TENTAR SALVAR:", error); 
        alert("Erro ao salvar cadastro. Por favor, verifique sua conexao ou regras do Firebase: " + error.message); 
        
        // FIM DA OPERAÇÃO: Reabilita o botão
        botaoCadastro.disabled = false;
    });
}

/**
 * Verifica se já existe um cadastro com o mesmo Nome do Tutor E Nome do Animal.
 * @param {object} dados Os dados do formulário a serem salvos.
 */
function verificarDuplicidade(dados) {
    
    // 1. Desabilita o botão para prevenir múltiplos cliques
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
              alert("Erro: Este cadastro (Tutor e Animal) já está registrado!");
              document.getElementById("formCadastro").reset();
              
              // 5. Reabilita o botão, pois a operação foi concluída (com falha de duplicidade)
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

// ... [A função gerarComprovante permanece aqui, inalterada]
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

NUMERO DA INSCRICAO: ${numeroInscricao}
Data de Geracao: ${new Date().toLocaleDateString('pt-BR')}

DADOS DO TUTOR:
Nome: ${dados.tutorNome}
Telefone: ${dados.tutorTelefone}

DADOS DO ANIMAL:
Nome: ${dados.animalNome}
Especie: ${dados.animalEspecie}
Raca: ${dados.animalRaca || 'Nao Informada'}
Idade: ${dados.animalIdade || 'Nao Informada'}
Sexo: ${dados.animalSexo}
Peso (kg): ${dados.animalPeso || 'Nao Informado'}

--------------------------------------------------
Guarde este comprovante. Ele contem o numero unico da sua inscricao.
`;

    // Usa o BOM (Byte Order Mark) para tentar forcar a leitura UTF-8.
    const blob = new Blob(['\ufeff', comprovanteTexto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Cria um link invisível e simula o clique para iniciar o download
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprovante_Inscricao_${numeroInscricao}.txt`; // Nome do arquivo
    
    // Adiciona ao corpo, clica e remove (simula o download)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Libera a URL do objeto
    URL.revokeObjectURL(url);
}


// Ouve o evento de "submit" (envio) do formulário
document.getElementById("formCadastro").addEventListener("submit", function(e) {
    e.preventDefault();

    // Captura os valores de TODOS os campos do seu formulario
    const dados = {
        tutorNome: document.getElementById("tutorNome").value.trim(), // Limpa espaços extras
        tutorTelefone: document.getElementById("tutorTelefone").value.trim(), 
        animalNome: document.getElementById("animalNome").value.trim(), // Limpa espaços extras
        animalEspecie: document.getElementById("animalEspecie").value,
        animalRaca: document.getElementById("animalRaca").value,
        animalIdade: document.getElementById("animalIdade").value,
        animalSexo: document.getElementById("animalSexo").value,
        animalPeso: document.getElementById("animalPeso").value,
    };

    // A lógica de desabilitar/reabilitar e salvar está agora dentro de verificarDuplicidade
    verificarDuplicidade(dados);
});
