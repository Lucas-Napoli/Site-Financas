function salvarCompra(event, collection) {
    event.preventDefault() 
    if (document.getElementById('produto').value === '') { alert('⚠ É obrigatório informar o nome!') }
    else if (document.getElementById('preco').value === '') { alert('⚠ É obrigatório informar o preço!') }
    else if (document.getElementById('dataCompra').value === '') { alert('⚠ É obrigatório informar a data de compra!') }
    else if (document.getElementById('id').value !== '') { alterarDados(event, collection) }
    else { incluirCompra(event, collection) }
}

function incluirCompra(event, collection) {
    event.preventDefault()
    const form = document.forms[0]
    const data = new FormData(form)
    const values = Object.fromEntries(data.entries())
    return firebase.database().ref(collection).push(values)
        .then(() => {
            alert('✔ Registro cadastrado com sucesso!')
            document.getElementById('formCadastro').reset() 
        })
        .catch(error => {
            console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
            alert(`❌ Falha ao incluir: ${error.message}`)
        })
}

function obtemDados(collection) {
    var tabela = document.getElementById('tabelaCompra')
    firebase.database().ref(collection).on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = 'table-info'
        cabecalho.insertCell().textContent = 'Produto'
        cabecalho.insertCell().textContent = 'Data da Compra'
        cabecalho.insertCell().textContent = 'Preço'
        cabecalho.insertCell().textContent = 'Situação'
        cabecalho.insertCell().textContent = 'Forma de Pagamento'
        cabecalho.insertCell().textContent = 'Opções'

        snapshot.forEach(item => {
            //Dados do Firebase
            let db = item.ref.path.pieces_[0] 
            let id = item.ref.path.pieces_[1] 
            let registro = JSON.parse(JSON.stringify(item.val()))
            let novalinha = tabela.insertRow()
            novalinha.insertCell().textContent = item.val().produto
            novalinha.insertCell().textContent = new Date(item.val().dataCompra).toLocaleDateString()
            novalinha.insertCell().textContent = "R$ " + item.val().preco
            novalinha.insertCell().textContent = item.val().situacao
            novalinha.insertCell().textContent = item.val().Pagamento
            novalinha.insertCell().innerHTML =
                `
            <button class ='btn btn-danger' title='Remove o registro corrente' onclick=remover('${db}','${id}')>🗑 Excluir </button>
            <button class ='btn btn-primary' title='Edita o registro corrente' onclick=carregaDadosAlteracao('${db}','${id}')>✏ Editar </button>
            `
        })
        let rodape = tabela.insertRow()
        rodape.className = 'table-success'
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().innerHTML = totalRegistros(collection)
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
    })
}

function totalRegistros(collection) {
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snapshot) => {
        if (snapshot.numChildren() === 0) {
            retorno = 'Ainda não há nenhum Produto cadastrado!'
        } else {
            retorno = `Total de Registros: ${snapshot.numChildren()}`
        }
    })
    return retorno
}

function remover(db, id) {
    if (window.confirm('Excluir Produto?')) {
        let dadoExclusao = firebase.database().ref().child(db + '/' + id)
        dadoExclusao.remove()
            .then(() => {
                alert('✅Produto removido com sucesso!')
            })
            .catch(error => {
                alert('❌Falha ao excluir: ' + error.message)
            })
    }
}

function carregaDadosAlteracao(db, id) {
    firebase.database().ref(db).on('value', (snapshot) => {
        snapshot.forEach(item => {
            if (item.ref.path.pieces_[1] === id) {
                document.getElementById('id').value = item.ref.path.pieces_[1]
                document.getElementById('produto').value = item.val().produto
                document.getElementById('preco').value = item.val().preco
                document.getElementById('dataCompra').value = item.val().dataCompra
                if (item.val().situacao === 'Pago') {
                    document.getElementById('Pago').checked = true
                } else {
                    document.getElementById('NaoPago').checked = true
                }
                
                switch(item.val().Pagamento != ''){
                    case 'Cartão de Crédito':
                        document.getElementById('Credito').checked = true
                        break;
                    case 'Cartão de Débito':
                        document.getElementById('Debito').checked = true
                        break;
                    default:
                        document.getElementById('Dinheiro').checked = true
                }
            }
        })
    })
}

function alterarDados(event, collection) {
    event.preventDefault()
  
    const form = document.forms[0];
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    console.log(values)
    return firebase.database().ref().child(collection + '/' + values.id).update({
        produto: values.produto,
        preco: values.preco,
        situacao: values.situacao,
        dataCompra: values.dataCompra,
        Pagamento: values.Pagamento
    })
        .then(() => {
            alert('✅ Registro alterado com sucesso!')
            document.getElementById('formCadastro').reset()
        })
        .catch(error => {
            console.log(error.code)
            console.log(error.message)
            alert('❌ Falha ao alterar: ' + error.message)
        })
}