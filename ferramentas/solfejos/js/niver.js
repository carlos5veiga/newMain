const niver = ['Carlos', 'Val', 'Victor'];

const textoH2 = document.getElementById("bannerid");
const dataHoje = new Date();
const dia = dataHoje.getDate();
const mes = dataHoje.getMonth()+1;
textoH2.innerText = `Parabéns aos aniversariantes do dia ${dia}/${mes}`

const divNiver = document.getElementById("teste-niver");

niver.map((nome) => {
    const li = document.createElement("li")
    li.innerHTML = `<p class="banner__texto">${nome}</p>`
    divNiver.appendChild(li)
})



