// A variável 'db' é definida no index.html e deve estar globalmente acessível.

/**
 * Função principal para salvar os dados no Firestore.
 * @param {object} dados Os dados do formulário a serem salvos.
 */
function salvarCadastro(dados) {
    // Define o nome da coleção no Firestore e adiciona os dados
    db.collection("Animais").add(dados)
    .then((docRef) => {
        // SUCESSO! O docRef contém o ID do novo documento (o "Numero de Inscricao")
        
        const numeroInscricao = docRef.id;
        
        // Chama a função para gerar e baixar o comprovante
        gerarComprovante(numeroInscricao, dados);

        // Alerta o usuario
        alert(`Cadastro realizado com sucesso! Numero da Inscricao: ${numeroInscricao}`);
        
        // Limpa os campos do formulario apos o envio e sucesso
        document.getElementById("formCadastro").reset();
    })
    .catch((error) => {
        // ESSENCIAL: Disparado se houver qualquer erro (regras, rede, config)
        console.error("ERRO COMPLETO AO TENTAR SALVAR:", error); 
        alert("Erro ao salvar cadastro. Por favor, verifique sua conexao ou regras do Firebase: " + error.message); 
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

    // Usa o BOM (Byte Order Mark) para tentar forcar a leitura UTF-8,
    // mas o texto base ja esta seguro sem caracteres especiais.
    const blob = new Blob(['\ufeff', comprovanteTexto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Cria um link invisivel e simula o clique para iniciar o download
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
    // ESSENCIAL: Impede o navegador de recarregar a pagina
    e.preventDefault();

    // Captura os valores de TODOS os campos do seu formulario
    // Os dados do usuario (Nome, Raca, etc.) ainda podem conter acentos,
    // o que e o esperado.
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

    // Chama a funcao que salva no Firebase 
    salvarCadastro(dados);

    // O reset foi movido para dentro de salvarCadastro para so limpar no sucesso.
});
