

let apiUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?'
let key = "";
let title = ""
let author = ""
window.addEventListener('load', () => {
   
    let getKeyBtn = document.querySelector('.getApiBtn'); 
    getKeyBtn.addEventListener('click', event => { //get key button function
        getKeyBtn.disabled = 'disabled'; //disabling key
        getKey(getKeyBtn).catch(err => {
         
            console.log("Error Reading data " + err);
            console.log(key)
            
            
          })
    })

    let addBookBtn = document.querySelector('.AddBookBtn'); 
    addBookBtn.addEventListener('click', event => { //add book key button function
        
         if(key == ""){  // check if the user did not get the key before trying to add a book and showind alert (for now)
            window.alert("GET A KEY")
        }
        addBookBtn.disabled = ''; //disabling key
        addBook(addBookBtn,0);// sending button for preventing spamming and 0 for counter. 
                              //Recursively calls it self if it fails and increments the counter
    })
    
    let viewBtn = document.querySelector('.viewBtn');
    viewBtn.addEventListener('click', event => { //view books key button function
        viewBtn.disabled = 'disabled'; //disabling key
        viewBooks(viewBtn,0); // sending button for preventing spamming and 0 for counter. 
                             //Recursively calls it self if it fails and increments the counter
    })
	//---------VG-------------------VG---------------------------------VG-----------------VG---------VG-------------------VG---------------------------------VG-----------------VG

}); 


async function getKey(button){
    let requestKey = await window.fetch(apiUrl + 'requestKey') //fetch to api with specific command (in this case get the key)
    let info = await requestKey.json()
    key = info.key //me set the key that we got from the api to our global variable 'key' in order to be accessable to other functions below 
    console.log(key)
    let keyDisplay= document.querySelector('.key').innerHTML = key;
    
}


async function addBook(button, counter){ 
    counter++ //incrementing the counter since we send 0
    title = document.querySelector('.titleArea').value //user input for author and title
    author = document.querySelector('.authorArea').value
    let req = await window.fetch(apiUrl + 'op=insert' +'&key='+ key + '&title=' + title + '&author=' + author) //same stuff as before
    let info = await req.json()

    if(info.status !== 'success' && counter < 5){  //if the respnse is error or in other words notSuccsess call it self again
        console.log('failed trying again' + counter) // with incremented counter and if the counter is above 5 (comment below)
        
        addBook(button,counter)
    }else if(info.status !== 'success' && counter < 5){ // do not call its self again and tell the user it failed
        
            window.alert("failed to add books 5/5 tries. Try again!")
    }else{ // if the book is added successfully at 5 times max tells the user it did succeeeeed
        
        window.alert('Book Added on try ' + counter +'/5 tries' )
       
        document.querySelector('.titleArea').value = '' //remove content of input after succsessful addition of a book same for author
        document.querySelector('.authorArea').value = ''
    }
    
    
       
}

async function viewBooks(button,counter){
    counter++
    let req = await window.fetch(apiUrl + 'op=select' +'&key='+ key)
    let info = await req.json();
    if(info.status !== 'success' && counter < 5){ // same thing as above in adding book and trying to call it self but with listing(getting the data)
        console.log('failed, trying again' + counter)
        
        viewBooks(button,counter)
    }else if(info.status !== 'success' && counter == 5){
        
            window.alert("failed to get book query, 5/5 tries. Try again!")
    }else{ // if the books are "retrived" successfully at 5 times max, we create divs in the existing list div element and loop around the 
    //array of data and displaying the books to the user (i have no idea why forEach did not work so went with the good'ol for loop)
        
        window.alert('success on try ' + counter +'/5 tries' )
        document.querySelector('.noBooks').innerHTML = ''
        let displayBooks = document.querySelector('.contentBox')
        for(let i = 0; i<info.data.length;i++){ 
            let book = document.createElement('div');
        	book.className = 'bookQuerry';
            book.innerText = info.data[i].title + " " + info.data[i].author ;
            document.querySelector('.contentBox').appendChild(book)  	
        }
       
    }
    
    button.disabled = ''; 
}

//---------VG-------------------VG---------------------------------VG-----------------VG---------VG-------------------VG---------------------------------VG-----------------VG


