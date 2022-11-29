const baseURL = window.location.hostname.includes('127.0.0.1')
? 'http://127.0.0.1:5500'
: 'https://lucas-napoli.github.io/Site-Financas'


function loginFireBase(email, senha) {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, senha)
        .then(result => {
            alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
            window.location.href = `${baseURL}/Controle-Finanças.html`
        })
        .catch(error => {
            let mensagem = '';
            switch (error.code) {
                case 'auth/invalid-email':
                    mensagem = 'Formato de E-mail invalido!'
                    break;
                case 'auth/user-not-found':
                    mensagem = 'E-mail não cadastrado!'
                    break;
                case 'auth/wrong-password':
                    mensagem = 'Senha incorreta, digite novamente!'
                    break;
                default:
                    mensagem = 'tente novamente!'
            }
            alert(`Não foi possivel Logar com o usuário: ${mensagem}`)
            console.log(error.message);
            console.log(error.code);
        })
}


function NovoUsuario(email, senha) {
    firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then((result) => {
            alert(`Usuario, ${JSON.stringify(result.user.email)}, Cadastrado com sucesso!`)
            window.location.href = `${baseURL}/index.html`
        })
        .catch(error => {
            let mensagem = '';

            switch (error.code) {
                case 'auth/invalid-email':
                    mensagem = 'O E-mail informado é inválido!'
                    break;
                case 'auth/email-already-in-use':
                    mensagem = 'O e-mail informado já está sendo utilizado!'
                    break;
                case 'auth/weak-password':
                    mensagem = 'Senha Invalida, Por favor insira 6 digitos!'
                    break;
                default:
                    mensagem = 'tente novamente!'
            }
            alert(`Não foi possivel cadastrar o usuário: ${mensagem}`)
            console.log(error.message);
        })
}

function logout() {
    firebase
        .auth()
        .signOut()
        .then(function () {
            alert(`Desconectando de sua sessão!`)
            window.location.href = baseURL
        })
        .catch(function (error) {
            alert(`Não foi possível sair de sua sessão \n Erro: ${error.message}`)
        });
}


function verificaLogado() {
    firebase
        .auth()
        .onAuthStateChanged(user => {
            if (user) {
                console.log('Usuário logado!')
            } else {
                console.log('Usuário não logado!')
                window.location.href = baseURL
            }
      })
}

