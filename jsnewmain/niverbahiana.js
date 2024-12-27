const textoH2 = document.getElementById("banner-titulo-id");
const textoH2Mes = document.getElementById("banner-mes-id");
const textoH2Lista = document.getElementById("banner-lista-id");
const dataHoje = new Date();
const dia = dataHoje.getDate().toString();
const mes = (dataHoje.getMonth() + 1).toString();
const divNiver = document.getElementById("niver-hoje");
const divNiverMes = document.getElementById("niver-mes");
const divNiverLista = document.getElementById("niver-lista");

loadJSON();
async function loadJSON() {
    const response = await fetch('./dados.json');
    const data = await response.json();
    niverHoje(data);
    niverMes(data);
    listaNiver(data);
}

function niverHoje(data) {
    const aniversariantes = []
    data.map((pessoa) => {
        const niver = pessoa.niver;
        const niverSplit = niver.split('/');

        if (dia.includes(niverSplit[0]) && mes.includes(niverSplit[1]) && pessoa.coral.includes("Bahiana")) {
            const li = document.createElement("li");
            li.innerHTML = `<p class="banner__texto">${pessoa.nome}, ${pessoa.naipe}</p>`;
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

        if (mes.includes(niverSplit[1]) && pessoa.coral.includes("Bahiana")) {
            aniversariantes.push(pessoa);
        }
    })
    if (aniversariantes.length>0) {
        textoH2Mes.innerText = `Aniversariantes deste mês`;
    }
    const listaOrdenada = aniversariantes.sort(compareFn);
    listaOrdenada.map((pessoa) => {
        const li = document.createElement("li");
        li.innerHTML = `<p class="banner__texto">${pessoa.nome}, ${pessoa.naipe} - ${pessoa.niver}</p>`;
        divNiverMes.appendChild(li);
    })
}

function compareFn(a, b) {
    if (a.niver < b.niver) {
      return -1;
    } else if (a.niver > b.niver) {
      return 1;
    }
    return 0;
  }

  function compare2Fn(a, b) {
    const niverASplit = a.niver.split('/');
    const niverBSplit = b.niver.split('/');
    const aConcat = niverASplit[1] + niverASplit[0];
    const bConcat = niverBSplit[1] + niverBSplit[0];
    if (aConcat < bConcat) {
      return -1;
    } else if (aConcat > bConcat) {
      return 1;
    }
    return 0;
  }

  function listaNiver(data) {
    const aniversariantes2 = []
    data.map((pessoa) => {
        const niver = pessoa.niver;

        if (pessoa.coral.includes("Bahiana")) {
            aniversariantes2.push(pessoa);
        }
    })
    if (aniversariantes2.length>0) {
        textoH2Lista.innerText = `Lista de aniversários Canta Bahiana`;
    }
    const listaOrdenada = aniversariantes2.sort(compare2Fn);
    listaOrdenada.map((pessoa) => {
        const li = document.createElement("li");
        li.innerHTML = `<p class="banner__texto">${pessoa.nome}, ${pessoa.naipe} - ${pessoa.niver}</p>`;
        divNiverLista.appendChild(li);
    })
}


