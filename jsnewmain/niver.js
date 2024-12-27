const textoH2 = document.getElementById("banner-titulo-id");
const textoH2Mes = document.getElementById("banner-mes-id");
const dataHoje = new Date();
const dia = dataHoje.getDate().toString();
const mes = (dataHoje.getMonth() + 1).toString();
const divNiver = document.getElementById("niver-hoje");
const divNiverMes = document.getElementById("niver-mes");

loadJSON();
async function loadJSON() {
    const response = await fetch('./dados.json');
    const data = await response.json();
    niverHoje(data);
    niverMes(data);
}

function niverHoje(data) {
    const aniversariantes = []
    data.map((pessoa) => {
        const niver = pessoa.niver;
        const niverSplit = niver.split('/');

        if (dia.includes(niverSplit[0]) && mes.includes(niverSplit[1])) {
            const li = document.createElement("li");
            li.innerHTML = `<p class="banner__texto">${pessoa.nome}, ${pessoa.naipe} (${pessoa.coral})</p>`;
            divNiver.appendChild(li);
            aniversariantes.push(pessoa);
        }
    })
    if (aniversariantes.length>0) {
        textoH2.innerText = `Parabéns aos aniversariantes do dia ${dia}/${mes}`;
    } else {
        textoH2.innerText = `Hoje, dia ${dia}/${mes}, não tem aniversariantes.`;
    }
}

function niverMes(data) {
    const aniversariantes = []
    data.map((pessoa) => {
        const niver = pessoa.niver;
        const niverSplit = niver.split('/');

        if (mes.includes(niverSplit[1])) {
            aniversariantes.push(pessoa);
        }
    })
    if (aniversariantes.length>0) {
        textoH2Mes.innerText = `Aniversariantes deste mês`;
    }
    const listaOrdenada = aniversariantes.sort(compareFn);
    listaOrdenada.map((pessoa) => {
        const li = document.createElement("li");
        li.innerHTML = `<p class="banner__texto">${pessoa.nome}, ${pessoa.naipe} (${pessoa.coral}) - ${pessoa.niver}</p>`;
        divNiverMes.appendChild(li);
    })
}


function compareFn(a, b) {
    if (a.niver < b.niver) {
      return -1;
    } else if (a.niver > b.niver) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

