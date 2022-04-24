
const card_con = document.getElementById('card_con');
const errormsg = document.getElementById('errormsg');
const successmsg = document.getElementById('successmsg');

var books;

// functions

function create_card() {
    for (info of books) {
        const card = document.createElement('div');
        card.classList.add('card');
        const img = document.createElement('img');
        img.src=`${info.img}`;
        const card_text = document.createElement('div');
        card_text.classList.add('card_text');
        const title = document.createElement('h2');
        title.innerText =`${info.title}`;
        const author = document.createElement('div');
        author.innerText =`Author: ${info.author}`;
        const page = document.createElement('div');
        page.innerText =`No. of Pages: ${info.pages}`;
        const status = document.createElement('div');
        status.innerText =`Read Or Not: ${info.read}`;
        //
        if (info.date > 1650639907906) {
            card.classList.add('removable');
            card.dataset.id = `${info._id}`
            const remove = document.createElement('i');
            remove.classList.add("fa-solid");
            remove.classList.add("fa-xmark");
            card.append(remove);
        }

        card_text.append(title, author, page, status);
        card.append(img, card_text);
        card_con.append(card);
    }
    // adding event listener for remove button
    const rebtn = document.getElementsByClassName('fa-solid');
    for (elt of rebtn) {
        elt.addEventListener("click", removebook)
    }
}

// api to get books info
const getdata = async function () {
    const options = {
        method :"GET"
    }
    const response = await fetch('/books', options);
    const data = await response.json();
    books = data;

    // generating card
    create_card();
}


getdata();

// post functionality

const btn =document.getElementById('btn');
btn.addEventListener('click', senddata);

async function senddata() {
    const inputs = document.querySelectorAll('input');
    const select = document.getElementById('select');
    const title = inputs[0].value;
    const author = inputs[1].value;
    const page = inputs[2].value;
    const status = select.value;
    const date = Date.now();
    const new_book = {
        title: title,
        author: author || "n/a",
        pages: page || "n/a",
        read: status,
        date: date
    }
    // form validation
    if (status == "Choose any") {
        errormsg.innerText= "insufficient info";
        return
    }
    if (title.length < 2) {
        errormsg.innerText= "insufficient info";
        return
    }
    
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_book)
    }
    window.location.reload();
    const response = await fetch('/new_book', options);
    const data = await response.json();
    
}

// remove functionalty


async function removebook (e) {
    const id = e.target.parentElement.getAttribute('data-id');
    const coll =  document.querySelectorAll(".removable");
    for (elt of coll) {
        if (elt.getAttribute('data-id') == id) {
            elt.remove();
        }
    }

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    }
    const response = await fetch('/hat', options);
    const data = await response.json();

}
