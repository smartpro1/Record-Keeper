const orderedList = document.querySelector('.orderedList');
const successP = document.querySelector('.success');
// const success = document.querySelector(".success");
const warningP = document.querySelector('.warning');
const message = document.getElementById('textInput');
let isCreatedBefore = false;

function create(e){
    // prevent form's Default action
    e.preventDefault();
    if(isCreatedBefore) return;
   const li = document.createElement('li');
   li.innerHTML = `
     <span class="listItem">${message.value}</span><span class="btns"><button class="edit">Edit</button><button class="delete">Delete</button></span>
   `;
   orderedList.appendChild(li);
   
   // display notification
   displayNotification(successP);

   //Add to local storage
   addToLocalStorage(message.value);

   // clear textfield
   this.reset();

}

function displayNotification(element){
  element.classList.toggle("show");
  setTimeout(()=>{
    element.classList.toggle("show"); 
  }, 2500);
}

function addToLocalStorage(inputVal){
 let results = getRecordsFromLocalStorage();

 // add text to result
  results.push(inputVal);
// save new text into localStorage
   saveToLocalStorage(results);
}

function saveToLocalStorage(variable){
  localStorage.setItem("records", JSON.stringify(variable));
};

function getRecordsFromLocalStorage(){
    let messages;
    let allRecords =  localStorage.getItem("records");
   
   // Get the records, if null is returned then we create an empty array
   if(allRecords === null){
       messages = [];
   }
   else{
       messages = JSON.parse(allRecords);
   }
    
   return messages;
  
}

// Print messages from LocalStorage when the DOM loads
function localStorageOnLoad(){
  let results = getRecordsFromLocalStorage();
  results.forEach(item=>{
    const li = document.createElement('li');
    li.innerHTML = `
    <span class="listItem">${item}</span><span class="btns"><button class="edit">Edit</button><button class="delete">Delete</button></span>
    `;
    orderedList.appendChild(li);
  });
 
}

// This function is triggered when the edit button is clicked
function editItem(event){
   const results = getRecordsFromLocalStorage();
   let targetLi = event.target.parentElement.parentElement;
    targetLiContent = targetLi.firstElementChild.innerText;
    message.value = targetLiContent;
    isCreatedBefore = true;
    document.getElementById('form').addEventListener('submit', (event)=>{
        event.preventDefault();
        let textInput = message.value;

        for(let i = 0; i < results.length; i++){
            if(results[i] === targetLiContent){
                results[i] = textInput;
                break;
              }
        }

        console.log(`message.value = ${message.value}`);
        console.log(`textInput = ${textInput}`);


        // update UI
        targetLi.firstElementChild.innerText = textInput;

        // display notification
         displayNotification(successP);

         saveToLocalStorage(results);
         

        // clear textfield
        message.value = "";

        isCreatedBefore = false;

    });

}

// trigger this function when the delete button is clicked
function deleteItem(event){
 // get the item to be deleted
 let targetLi = event.target.parentElement.parentElement;
  targetLiContent = targetLi.firstElementChild.innerText;
  targetLi.remove();
  const results = getRecordsFromLocalStorage();
  for(let i = 0; i < results.length; i++){
       if(targetLiContent === results[i]){
        results.splice(results[i], 1);
        break;
       }
  }

  saveToLocalStorage(results);

  // display notification
  displayNotification(warningP);
  
}


// add click event to delete button
// const deleteBtns = document.querySelector('.delete');
// deleteBtns.forEach(btn => btn.addEventListener('click', deleteItem));


document.addEventListener("DOMContentLoaded", ()=>{
    localStorageOnLoad();
     let deleteBtns = document.querySelectorAll('.delete');
     deleteBtns = Array.from(deleteBtns);
    deleteBtns.forEach(btn => btn.addEventListener('click', deleteItem));

    let editBtns = document.querySelectorAll('.edit');
    editBtns = Array.from(editBtns);
    editBtns.forEach(btn => btn.addEventListener('click', editItem));

});
// add submit event listener to the form
document.getElementById('form').addEventListener('submit', create);