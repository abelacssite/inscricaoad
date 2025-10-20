/**
 * Gera e inicia o download de um arquivo de texto (.txt) com os dados da inscrição.
 * @param {string} numeroInscricao O ID gerado pelo Firestore (o número da inscrição).
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

    // CORREÇÃO AQUI: Adiciona o parâmetro charset=utf-8 ao tipo MIME
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

// ... [o resto do seu script.js permanece inalterado]
