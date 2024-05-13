let validateAdmin;
let getAll, sortBookList, getAllReservations, sortBookReservations;
let search, sortBookResult;
let fillTableFunc;
let createBookAdapter, getBookAdapter, editBookAdapter, deleteBookAdapter, returnBookAdapter, getReservAdapter;
let searchSubmit, resCleaner, cleanResults, listToggler, searchForm;

const importer = async () => {
    const { validate } = await import("./adminValidator.js");
    const { getAllAdmin, getAllReserv, sortList, sortReserv } = await import("./list.js");
    const { searchBookAdmin, sortResult } = await import("./search.js");
    const { fillTable } = await import("./utils.js");
    const { createBook, getBook, editBook, deleteBook, returnBook, getReserv } = await import("./adapters.js");
    const { searchSubmitFunc, resCleanerFunc, cleanResultsFunc, listTogglerFunc, searchFormFunc, hamburgerListener } = await import("./commons.js");

    validateAdmin = validate;
    getAll = getAllAdmin, sortBookList = sortList, getAllReservations = getAllReserv, sortBookReservations = sortReserv;
    search = searchBookAdmin, sortBookResult = sortResult;
    fillTableFunc = fillTable;
    createBookAdapter = createBook, getBookAdapter = getBook, editBookAdapter = editBook, deleteBookAdapter = deleteBook, returnBookAdapter = returnBook, getReservAdapter = getReserv;
    searchSubmit = searchSubmitFunc, resCleaner = resCleanerFunc, cleanResults = cleanResultsFunc, listToggler = listTogglerFunc, searchForm = searchFormFunc;

    hamburgerListener();
    getAllAdmin();
    getAllReserv();
}

importer();

//Scroll handler (hashed urls)
const hash = window.location.hash.slice(1); // Remove the '#' character
if (hash) {
    const targetElement = document.getElementById(hash);
    if (targetElement) {
        setTimeout(() => {
            targetElement.scrollIntoView(true);
        }, 100);
    }
}

let idHolder;

const createBook = async (event) => {
    event.preventDefault();
    const response = document.getElementById("response");
    response.classList.replace("text-success-emphasis", "text-danger-emphasis");
    response.parentElement.classList.replace("d-none", "d-inline-block");

    const arr = arrayCleaner(event, "createForm");
    if (!arr) {
        return false;
    }

    const dataRes = await createBookAdapter(arr);
    if (!dataRes) {
        response.innerHTML = "Book not created, check your info again"

        return false;
    }
    resultPrint("create", dataRes.title, event);
}

const editBook = async (event) => {
    event.preventDefault();
    const response = document.getElementById("response");
    response.classList.replace("text-success-emphasis", "text-danger-emphasis");
    response.parentElement.classList.replace("d-none", "d-inline-block");

    const arr = arrayCleaner(event, "editForm");
    if (!arr) {
        return false;
    }

    const dataRes = await editBookAdapter(arr);
    if (!dataRes) {
        response.innerHTML = `
        This book is currently on loan, you can't edit it, 
        instead retrieve it first in the <a href="#reservation-table">Reservation List</a>
        `;

        return false;
    }
    resultPrint("edit", dataRes.title, event);
}

const deleteBook = async (event) => {
    const row = event.target.parentElement.parentElement.parentElement.parentElement;
    const rowId = row.id;
    const dataRes = await deleteBookAdapter(rowId);
    const response = document.getElementById("response");
    response.parentElement.classList.replace("d-none", "d-inline-block");
    response.classList.replace("text-success-emphasis", "text-danger-emphasis");

    if (dataRes) {
        getAll();
        const tableBody = row.parentElement;
        response.classList.replace("text-danger-emphasis", "text-success-emphasis");
        response.innerHTML = `(${rowId}) ${row.children[2].innerHTML} deleted!`

        if (tableBody.id === "table-body-res") {
            row.remove();
            if (tableBody.childElementCount === 0) {
                const tableRes = document.getElementById("response-table");
                tableRes.innerHTML = "";
            }
        }
    } else {
        response.innerHTML = `(${rowId}) ${row.children[2].innerHTML} not deleted (does not exist or is on loan)`;
        response.parentElement.scrollIntoView(true);
    }
}

const retrieveBook = async (event) => {
    event.preventDefault();
    const row = event.target.parentElement.parentElement;
    const rowId = row.id;
    const userName = row.children[2].innerHTML;
    const dataRes = await returnBookAdapter(rowId, userName, "admin");

    if (!dataRes) {
        //Do something if the return fail
        return false;
    }

    getAll();
    getAllReservations();
}

const arrayCleaner = (event, type) => {
    const validation = validateAdmin(event, type);
    if (!validation.state) {
        const response = document.getElementById("response");
        response.innerHTML = validation.message;

        return false;
    }

    const radios = document.getElementsByName("status");
    let selectedRadio;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedRadio = radios[i];
        }
    }

    let data = {};

    if (type === "editForm") {
        data.id = idHolder.trim();
    }

    data.title = event.target[0].value.trim();
    data.author = event.target[1].value.trim();
    data.pages = event.target[2].value.trim();
    data.genre = event.target[3].value.trim();
    data.year = event.target[4].value.trim();
    data.status = selectedRadio.value.trim();

    return data;
}

const resultPrint = (type, title, event) => {
    const response = document.getElementById("response");
    response.classList.replace("text-danger-emphasis", "text-success-emphasis");
    let text;
    if (type === "create") {
        text = `${title} Created!`;
    } else {
        text = `${title} (${idHolder}) Edited!`;
    }
    response.innerHTML = text;

    addForm(true);
    getAll();

    const tableRes = document.getElementById("table-body-res");
    if (tableRes) {
        search();
    }
}

const editForm = async (event) => {
    const response = document.getElementById("response");
    response.parentElement.classList.replace("d-inline-block", "d-none");
    response.classList.replace("text-success-emphasis", "text-danger-emphasis");

    const rowId = event.target.parentElement.parentElement.id;
    const data = await getBookAdapter(rowId);
    idHolder = data.id;

    let available = "", unavailable = "";

    if (data.status === "available") {
        available = "checked";
    } else {
        unavailable = "checked";
    }

    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = "<h1 class='text-center text-lg-start'>Edit Book</h1>";

    const editForm = document.createElement("form");
    editForm.id = "edit-book-form";
    editForm.className = "border border-secondary rounded-3 p-3";
    editForm.onsubmit = editBook;
    editForm.innerHTML += `
        <label class="form-label edit-label" for="title-edit">Title:</label>
        <input class="form-control d-inline w-auto mb-2" id="title-edit" type="text" name="title" placeholder="Title" onkeydown="resCleaner()" required value="${data.title}"><br/>
        <label class="form-label edit-label" for="author-edit">Author:</label>
        <input class="form-control d-inline w-auto mb-2" id="author-edit" type="text" name="author" placeholder="Autor" onkeydown="resCleaner()" required value="${data.author}"><br/>
        <label class="form-label edit-label" for="pages-edit">Pages:</label>
        <input class="form-control d-inline w-auto mb-2" id="pages-edit" type="number" name="pages" placeholder="Pages" min="1" step="1" pattern="\d*" onkeydown="resCleaner()" required value="${data.pages}"><br/>
        <label class="form-label edit-label" for="genre-edit">Genre:</label>
        <input class="form-control d-inline w-auto mb-2" id="genre-edit" type="text" name="genre" placeholder="Genre" onkeydown="resCleaner()" required value="${data.genre}"><br/>
        <label class="form-label edit-label" for="year-edit">Year:</label>
        <input class="form-control d-inline w-auto mb-3" id="year-edit" type="number" name="year" placeholder="Year" onkeydown="resCleaner()" required value="${data.year}"><br/>
        <label class="form-check-label" for="available">Available</label>
        <input class="form-check-input" type="radio" name="status" value="available" id="available" ${available}>
        <label class="form-check-label" for="unavailable">Unavailable</label>
        <input class="form-check-input" type="radio" name="status" value="unavailable" id="unavailable" ${unavailable}>
        <div class="mt-3">
            <button class="btn btn-success" type="submit">Edit book</button>
            <button class="btn btn-outline-info" type="button" onclick='addForm()'>Cancel</button>
        </div>
    `;
    mainForm.appendChild(editForm);

    const infoText = document.getElementById("info-text");
    infoText.innerHTML = `Edit a book modifying all its attributes (except the ID).<br /><br />Hint: if a book is currently checked out, 
    you can't edit it, instead retrieve it first in the <a href="#reservation-table">Reservation List</a>`;

    mainForm.scrollIntoView(true);
}

const addForm = (post = false) => {
    if (!post) {
        const response = document.getElementById("response");
        response.parentElement.classList.replace("d-inline-block", "d-none");
        response.classList.replace("text-success-emphasis", "text-danger-emphasis");
    }

    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = "<h1 class='text-center text-lg-start'>Add Book</h1>";

    const addForm = document.createElement("form");
    addForm.id = "create-book-form";
    addForm.className = "border border-secondary rounded-3 p-3";
    addForm.onsubmit = createBook;
    addForm.innerHTML += `    
        <input class="form-control w-auto mb-2" type="text" name="title" placeholder="Title" onkeydown="resCleaner()" required>
        <input class="form-control w-auto mb-2" type="text" name="author" placeholder="Autor" onkeydown="resCleaner()" required>
        <input class="form-control w-auto mb-2" type="number" name="pages" placeholder="Pages" min="1" step="1" pattern="\d*" onkeydown="resCleaner()" required>
        <input class="form-control w-auto mb-2" type="text" name="genre" placeholder="Genre" onkeydown="resCleaner()" required>
        <input class="form-control w-auto mb-2" type="number" name="year" placeholder="Year" onkeydown="resCleaner()" required>
        <label class="form-check-label" for="available">Available</label>
        <input class="form-check-input" type="radio" name="status" value="available" id="available" checked>
        <label class="form-check-label" for="unavailable">Unavailable</label>
        <input class="form-check-input" type="radio" name="status" value="unavailable" id="unavailable">
        <button class="btn btn-success d-block mt-2" type="submit">Add book</button>
    `;
    mainForm.appendChild(addForm);

    const infoText = document.getElementById("info-text");
    infoText.innerHTML = "Add a book filling all the fields, the ID is random generated";
}

//Unused function
const clearFields = (event) => {
    const target = event.target;
    for (let i = 0; i < target.length; i++) {
        if (!(target[i].type === "radio")) {
            target[i].value = "";
        }
    }
}

const sortListAdmin = () => {
    const values = sortBookList();
    fillTableFunc(values.array, values.target, "admin");
}

const sortResultAdmin = () => {
    const values = sortBookResult();
    fillTableFunc(values.array, values.target, "admin");
}

const sortListReserv = () => {
    const values = sortBookReservations();
    fillTableFunc(values.array, values.target, "reserv");
}