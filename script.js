const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOK_SHELF";

function generatedId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// PERIKSA DUKUNGAN LOCAL STORAGE
function checkStorage() {
  if (typeof Storage === undefined) {
    alert("Browser Ini tidak mendukung local storage");
    return false;
  }
  return true;
}

// SIMPAN DATA KE LOCAL STORAGE
function saveBook() {
  if (checkStorage()) {
    const savedBook = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, savedBook);
  }
}

// AMBIL DATA DARI LOCAL STORAGE
function loadBook() {
  const loadedBook = localStorage.getItem(STORAGE_KEY);
  let loadedData = JSON.parse(loadedBook);

  if (loadedData !== null) {
    for (const book of loadedData) {
      books.unshift(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// BUAT DAFTAR BUKU DI RAK
function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const bookBio = document.createElement("p");
  bookBio.innerHTML = "<b>" + title + "</b>" + "<br>" + author + " - " + year;

  const textBook = document.createElement("div");
  textBook.append(bookBio);

  const bookData = document.createElement("div");
  bookData.classList.add("book-data");
  bookData.append(textBook);
  bookData.setAttribute("id", `todo-${id}`);

  const control = document.createElement("div");

  // JIKA STATUS BUKU SELESAI DIBACA
  if (isCompleted == true) {
    const undobtn = document.createElement("button");
    undobtn.innerHTML = "<i class='fas fa-undo-alt'></i>";
    undobtn.addEventListener("click", function () {
      if (confirm("Yakin Ulangi Baca Buku ?")) {
        undoBookFromCompleted(id);
      }
    });

    const deletebtn = document.createElement("button");
    deletebtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deletebtn.addEventListener("click", function () {
      if (confirm("Yakin Hapus Data Buku ini ?")) {
        removeBookFromCompleted(id);
      }
    });

    control.append(undobtn, deletebtn);
    bookData.append(control);

    // JIKA STATUS BUKU BELUM SELESAI DIBACA
  } else {
    const finishbtn = document.createElement("button");
    finishbtn.innerHTML = "<i class='fas fa-check-circle'></i>";
    finishbtn.addEventListener("click", function () {
      if (confirm("Yakin Selesai Baca Buku ?")) {
        addBookToCompleted(id);
      }
    });

    const deletebtn = document.createElement("button");
    deletebtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deletebtn.addEventListener("click", function () {
      if (confirm("Yakin Hapus Data Buku ini ?")) {
        removeBookFromCompleted(id);
      }
    });

    control.append(finishbtn, deletebtn);
    bookData.append(control);
  }

  return bookData;
}

// AMBIL DATA BUKU DARI FORM UNTUK DI SIMPAN
function addBook() {
  const bookName = document.getElementById("bookname").value;
  const bookWriter = document.getElementById("bookwriter").value;
  const bookYear = document.getElementById("bookyear").value;
  const bookStatus = document.getElementById("bookCheked").checked;
  const generatedID = generatedId();
  const bookObject = generateBookObject(generatedID, bookName, bookWriter, bookYear, bookStatus);

  books.unshift(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

// PINDAHKAN KE RAK SUDAH DIBACA
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

// HAPUS DATA BUKU DARI RAK
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

// KEMBALIKAN BUKU KE RAK BELUM SELESAI
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form-input");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (confirm("Yakin Tambahkan Data Buku ?")) {
      addBook();
      event.target.reset();
    } else {
      alert("Buku batal Ditambah");
    }
  });

  if (checkStorage()) {
    loadBook();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBook = document.getElementById("readBook");
  const completedBook = document.getElementById("finishBook");

  uncompletedBook.innerHTML = "";
  completedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      completedBook.append(bookElement);
    } else {
      uncompletedBook.append(bookElement);
    }
  }
});

document.getElementById("search-box").addEventListener("keyup", function () {
  const bookName = document.getElementById("search-box").value;
  const listBooks = document.querySelectorAll(".book-data");

  for (let i = 0; i < listBooks.length; i++) {
    if (!bookName || listBooks[i].textContent.toLowerCase().indexOf(bookName) > -1) {
      listBooks[i].classList.remove("hide");
    } else {
      listBooks[i].classList.add("hide");
    }
  }
});
