const niver = ['Carlos', 'Val', 'Victor'];

const textoH2 = document.getElementById("bannerid");
const dataHoje = new Date();
const dia = dataHoje.getDate().toString();
const mes = (dataHoje.getMonth() + 1).toString();
textoH2.innerText = `Parabéns aos aniversariantes do dia ${dia}/${mes}`;

const divNiver = document.getElementById("teste-niver");

loadJSON();
async function loadJSON() {
    const response = await fetch('./dados.json');
    const data = await response.json();
    data.map((pessoa) => {
        const niver = pessoa.niver;
        const niverSplit = niver.split('/');

        if (dia.includes(niverSplit[0]) && mes.includes(niverSplit[1])) {
            const li = document.createElement("li");
            li.innerHTML = `<p class="banner__texto">${pessoa.nome}, ${pessoa.naipe} (${pessoa.coral})</p>`;
            divNiver.appendChild(li);
        }
    })
}



