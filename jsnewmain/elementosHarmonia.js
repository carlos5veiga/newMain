import { dados } from './dadosHarmonia.js'

// Componentes compartilhados com a p?gina inicial.
import './elementosMain.js';

for (let index = 1; index < 2; index++) {
    
    let newDiv0 = document.createElement('div');
    let nomeId = 'conteiner' + index;
    newDiv0.setAttribute('id', nomeId);

    let containerPrincipal = document.getElementById('conteiner-principal');

    containerPrincipal.appendChild(newDiv0);

    for (let index = 0; index < dados.length; index++) {
        let newSection = document.createElement('section');
        newSection.setAttribute('class','carrossel');
        newSection.setAttribute('id','carrossel');
    
        newDiv0.appendChild(newSection);
    
        let newH2 = document.createElement('h2');
        newH2.setAttribute('class','carrossel__titulo');
        newH2.textContent = dados[index].tituloCabecalho;
        newSection.appendChild(newH2);
    
        let newDiv1 = document.createElement('div');
        newDiv1.setAttribute('class','card');
        newDiv1.setAttribute('id', 'div1');
        newSection.appendChild(newDiv1);
    
        let newDiv2 = document.createElement('div');
        newDiv2.setAttribute('class','card__imagem-texto');
        newDiv2.setAttribute('id', 'div2');
        newDiv1.appendChild(newDiv2);

        const linkVideo = 'https://youtu.be/' + dados[index].codigoVideo;
    
        let newA = document.createElement('a');
        newA.setAttribute('target','_blank');
        newA.setAttribute('href', linkVideo);
        newDiv2.appendChild(newA);

        const imagemVideo = 'https://img.youtube.com/vi/' + dados[index].codigoVideo + '/hqdefault.jpg';
    
        let newImg = document.createElement('img');
        newImg.setAttribute('src', imagemVideo);
        newImg.setAttribute('alt','Imagem do vídeo Solfejo 03 Software');
        newImg.setAttribute('class','descricao__imagem');
        newImg.setAttribute('height','160px');
        newA.appendChild(newImg);
    
        let newP = document.createElement('p');
        newP.setAttribute('class','texto-card__imagem-texto');
        newP.textContent = dados[index].resumoVideo;;
        newDiv2.appendChild(newP);
    
        let newDiv3 = document.createElement('div');
        newDiv3.setAttribute('class','card__botao-solo');
        newDiv1.appendChild(newDiv3);
    
        let newA2 = document.createElement('a');
        newA2.setAttribute('target','_blank');
        newA2.setAttribute('href', linkVideo);
        newA2.setAttribute('class','botao-conhecer');
        newA2.textContent = 'Assista';
        newDiv3.appendChild(newA2);
    
    }
    
}
