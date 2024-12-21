const niver = ['Carlos', 'Val', 'Victor'];

const textoH2 = document.getElementById("bannerid");
const dataHoje = new Date();
const dia = dataHoje.getDate();
const mes = dataHoje.getMonth() + 1;
textoH2.innerText = `Parabéns aos aniversariantes do dia ${dia}/${mes}`;

const divNiver = document.getElementById("teste-niver");

// niver.map((nome) => {
//     const li = document.createElement("li");
//     li.innerHTML = `<p class="banner__texto">${nome}</p>`;
//     divNiver.appendChild(li);
// })
loadJSON();
async function loadJSON() {
    const response = await fetch('./dados.json');
    // const csvText = await response.text();
    // const rows = csvText.split('\n').map(row => row.split(','));
    const data = await response.json();
    data.map((nome) => {
        const li = document.createElement("li");
        li.innerHTML = `<p class="banner__texto">${nome.nome}, ${nome.naipe} (${nome.coral})</p>`;
        divNiver.appendChild(li);
    })
}




// const file = await fetch('./arquivo.csv')

// const reader = new FileReader();
// reader.onload = (event) => {
//     const text = event.target.result;
//     const rows = text.split('\n').map(row => row.split(','));
//     document.getElementById('output').textContent = JSON.stringify(rows, null, 2);
// };
// reader.readAsText(file);



