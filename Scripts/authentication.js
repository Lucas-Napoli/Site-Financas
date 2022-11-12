const baseURL = "http://127.0.0.1:5500"


// Autenticação usuário

function loginFireBase(email, senha){
    firebase
    .auth()
    .signInWithEmailAndPassword(email,senha)
    .then(result => {
        alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
        window.location.href = `${baseURL}/Controle-Finanças.html`
    })
    .catch(error => {
        let mensagem = '';
        switch(error.code){
            case 'auth/invalid-email':
                mensagem = 'O E-mail informado é inválido!'
                break;
            case 'auth/email-already-exists':
                mensagem = 'O e-mail informado já está sendo utilizado!'
                break;
            default:
                mensagem = error.message    
        }
        alert(`Erro ao efetuar o login: ${mensagem}`)
    }) 
}

// Cadastrar novo Usuario
function NovoUsuario(email,senha){
    firebase.auth().createUserWithEmailAndPassword(email,senha)
    .then((result)=>{
        alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
        window.location.href = `${baseURL}/index.html`
    })
    .catch(error => {
        alert(`Não foi possivel cadastrar o usuário`)
        console.log(error.message);
    })
}