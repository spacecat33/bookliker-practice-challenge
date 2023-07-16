document.addEventListener("DOMContentLoaded", function() {
fetchBooks();
});

function fetchBooks() {
  fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(books => {
      for(let book of books) {
        renderBook(book);
      }
    });
}

function renderBook(book) {
  let list = document.querySelector('#list');

  let listItem = document.createElement('li');
  listItem.innerText = book.title;
  listItem.addEventListener('click', () => showBook(book));

  list.appendChild(listItem);
}

function showBook(book) {
  let showPanel = document.querySelector('#show-panel');
  showPanel.innerHTML = '';

  let title = document.createElement('h2');
  title.innerText = book.title;

  let img = document.createElement('img');
  img.src = book.img_url;

  let description = document.createElement('p');
  description.innerText = book.description;

  let likeButton = document.createElement('button');
  let currentUser = {"id":1, "username":"pouros"};

  if (book.users.find(user => user.id === currentUser.id)) {
    likeButton.innerText = 'Unlike Book';
  } else {
    likeButton.innerText = 'Like Book';
  }

  likeButton.addEventListener('click', () => {
    likeBook(book, currentUser, likeButton);
  });

  let users = document.createElement('ul');
  for(let user of book.users) {
    let userItem = document.createElement('li');
    userItem.innerText = user.username;
    users.appendChild(userItem);
  }

  showPanel.append(title, img, description, users, likeButton);
}

function likeBook(book, currentUser, likeButton) {
  let updatedUsers;

  if (book.users.find(user => user.id === currentUser.id)) {
    updatedUsers = book.users.filter(user => user.id !== currentUser.id);
    likeButton.innerText = 'Like Book';
  } else {
    updatedUsers = [...book.users, currentUser];
    likeButton.innerText = 'Unlike Book';
  }

  fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({users: updatedUsers})
  })
  .then(resp => resp.json())
  .then(updatedBook => {
    book.users = updatedBook.users;
    let usersList = document.querySelector('#show-panel ul');
    usersList.innerHTML = '';

    for(let user of book.users) {
      let userItem = document.createElement('li');
      userItem.innerText = user.username;
      usersList.appendChild(userItem);
    }
  });
}