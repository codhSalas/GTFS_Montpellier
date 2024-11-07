const selectedIds ={};
const dataSets = ['depart','arriver' /*, 'eviter'*/,'relais'];
let chemain;
const x = document.getElementById(dataSets[0]);
const y = document.getElementById(dataSets[1]);
const submitButton = document.getElementById('submit');
let zqsd = 0;


document.addEventListener('DOMContentLoaded',()=>{
  
  
  function checkInputs() {
    if (x.value.trim() !== "" && y.value.trim() !== "" && x.value.trim()!== y.value.trim()){
        submitButton.disabled = false;
    }else {
        submitButton.disabled = true;
    }
  }

    // On surveille les changements dans les deux inputs
  x.addEventListener('input', checkInputs);
  y.addEventListener('input', checkInputs);


  const form = document.getElementById("stationFrom");
  if(!form){
    console.error("form not found");
    return;
  }

  const datalist = document.getElementById('dataSet');

  for(const contData of dataSets){
    selectedIds[contData] = '0';
    
    const input = document.getElementById(contData);   
    if (!input) {
      console.error("Input element with id",contData," not found ");
    }   

    input.addEventListener('input' , function() {
      
      const value = this.value;
      const options = datalist.getElementsByTagName('option');
      
      for (const thisoption of options) {
      
        if (thisoption.innerText.trim() === value.trim()){
          selectedIds[contData] = thisoption.id;
          console.log(contData , "----",thisoption.id);
          break;
        }
      }
    });
  }
});

const sendToServer = async (ids)=>{
  const response =await fetch('/',{
    method : 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(ids)
  })
  chemain = await response.json();
  for (const ids of dataSets){
    const sub = document.getElementById(ids);
    sub.value ="";
    selectedIds[ids] = '0';
    
    console.log("reset des input",ids);

  }
  submitButton.disabled = true;
}


const sub = document.getElementById('submit');
sub.addEventListener('click', async (event) =>{
  event.preventDefault();
  
  await sendToServer(selectedIds);
  let listRoute ,finalChemain;
  try {
     [listRoute ,...finalChemain] = chemain.chemain;
  } catch (error) {
    alert('donne envoyer non fiable');
    return;
  }  

  const ul = document.querySelector('#listeChemain').querySelector('ul');
  ul.classList.remove('move');
  void ul.offsetWidth;
  ul.innerHTML='';
  let i = 0;
  const z = finalChemain[0][0];
      const li = document.querySelector('#oneItems')?.content.cloneNode(true);
      const liItem = li.querySelector('li');
      const elementNode = document.getElementById(z);
      liItem.querySelector('.bool1').classList.add('R' + listRoute[i]);
      liItem.querySelector('.bool2').classList.add('R' + listRoute[i]);
      liItem.querySelector('p').innerText = elementNode.text;
      ul.appendChild(li);

  for (const elements of finalChemain) {
    const comp = elements.length-1;
    for (let index = 1; index < comp; index++) {
      const li = document.querySelector('#oneItems')?.content.cloneNode(true);
      const liItem = li.querySelector('li');
      const elementNode = document.getElementById(elements[index]);
      
      liItem.querySelector('.bool1').classList.add('R' + listRoute[i]);
      liItem.querySelector('.bool2').classList.add('R' + listRoute[i]);

      liItem.querySelector('p').innerText = elementNode.text;
      ul.appendChild(li);
    }
    let li1 = document.querySelector('#oneItems')?.content.cloneNode(true);
    let li1Item = li1.querySelector('li');
    let elementNode = document.getElementById(elements[comp]);
    
    li1Item.querySelector('.bool1').classList.add('R' + listRoute[i]);
    i =(i<listRoute.length-1)? i+1 : i;
    li1Item.querySelector('.bool2').classList.add('R' + listRoute[i]);
    li1Item.querySelector('p').innerText = elementNode.text;
    ul.appendChild(li1);
  }
  ul.style.transform = `translateX(${0}em`;
  zqsd =0;
  document.querySelector('#listeChemain').classList.toggle('hide');
});
const next = document.querySelector('#next');
const boUl= document.querySelector('ul'); 
next.addEventListener('click',()=>{
const t = document.querySelectorAll('li').length;
  if(zqsd < document.querySelectorAll('li').length-1){
    zqsd++;
    boUl.style.transform = `translateX(${-zqsd*11}em`;
  }else{
    alert("arriver");
    boUl.style.transform = `translateX(${0}em`;
    zqsd=0;
    document.querySelector('#listeChemain').classList.toggle('hide');
  }
});