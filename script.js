// A variável 'db' é definida no index.html e deve estar globalmente acessível.

/**
 * Função principal para salvar os dados no Firestore.
 * @param {object} dados Os dados do formulário a serem salvos.
 */
function salvarCadastro(dados) {
    // Define o nome da coleção no Firestore e adiciona os dados
    db.collection("Animais").add(dados)
    .then((docRef) => {
        // SUCESSO! O docRef contém o ID do novo documento (o "Número de Inscrição")
        
        const numeroInscricao = docRef.id;
        
        // Chama a função para gerar e baixar o comprovante
        gerarComprovante(numeroInscricao, dados);

        // Alerta o usuário
        alert(`Cadastro realizado com sucesso! Número da Inscrição: ${numeroInscricao}`);
        
        // Limpa os campos do formulário após o envio e sucesso
        document.getElementById("formCadastro").reset();
    })
    .catch((error) => {
        // ESSENCIAL: Disparado se houver qualquer erro (regras, rede, config)
        console.error("ERRO COMPLETO AO TENTAR SALVAR:", error); 
        alert("Erro ao salvar cadastro. Por favor, verifique sua conexão ou regras do Firebase: " + error.message); 
    });
}

/**
 * Gera e inicia o download de um arquivo de texto (.txt) com os dados da inscrição.
 * Corrigido para usar UTF-8 e garantir o reconhecimento de caracteres especiais (Ç, acentos, etc.).
 * * @param {string} numeroInscricao O ID gerado pelo Firestore (o número da inscrição).
 * @param {object} dados Os dados completos do formulário.
 */
function gerarComprovante(numeroInscricao, dados) {
    
    // Formata o comprovante com todos os dados
    const comprovanteTexto = `
--- COMPROVANTE DE INSCRIÇÃO PARA CASTRAÇÃO ---

NÚMERO DA INSCRIÇÃO: ${numeroInscricao}
Data de Geração: ${new Date().toLocaleDateString('pt-BR')}

DADOS DO TUTOR:
Nome: ${dados.tutorNome}
Telefone: ${dados.tutorTelefone}

DADOS DO ANIMAL:
Nome: ${dados.animalNome}
Espécie: ${dados.animalEspecie}
Raça: ${dados.animalRaca || 'Não Informada'}
Idade: ${dados.animalIdade || 'Não Informada'}
Sexo: ${dados.animalSexo}
Peso (kg): ${dados.animalPeso || 'Não Informado'}

--------------------------------------------------
Guarde este comprovante. Ele contém o número único da sua inscrição.
`;

    // CORREÇÃO: Adiciona o parâmetro charset=utf-8 ao tipo MIME para resolver problemas de codificação
    const blob = new Blob([comprovanteTexto], { type: 'text/plain;charset=utf-8' });
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

    // Chama a função que salva no Firebase (não há mais verificação de duplicidade)
    salvarCadastro(dados);

    // O reset foi movido para dentro de salvarCadastro para só limpar no sucesso.
});
