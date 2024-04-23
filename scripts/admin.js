let validateAdmin;
let getAll, sortBookList, getAllReservations, sortBookReservations;
let search, sortBookResult;
let fillTableFunc;
let createBookAdapter, getBookAdapter, editBookAdapter, deleteBookAdapter, returnBookAdapter;
let searchSubmit, searchInput, cleanResults, listToggler, searchForm;

const importer = async () => {
    const { validate } = await import("./adminValidator.js");
    const { getAllAdmin, getAllReserv, sortList, sortReserv } = await import("./list.js");
    const { searchBookAdmin, sortResult } = await import("./search.js");
    const { fillTable } = await import("./utils.js");
    const { createBook, getBook, editBook, deleteBook, returnBook } = await import("./adapters.js");
    const { searchSubmitFunc, searchInputFunc, cleanResultsFunc, listTogglerFunc, searchFormFunc } = await import("./commons.js");

    validateAdmin = validate;
    getAll = getAllAdmin, sortBookList = sortList, getAllReservations = getAllReserv, sortBookReservations = sortReserv;
    search = searchBookAdmin, sortBookResult = sortResult;
    fillTableFunc = fillTable;
    createBookAdapter = createBook, getBookAdapter = getBook, editBookAdapter = editBook, deleteBookAdapter = deleteBook, returnBookAdapter = returnBook;
    searchSubmit = searchSubmitFunc, searchInput = searchInputFunc, cleanResults = cleanResultsFunc, listToggler = listTogglerFunc, searchForm = searchFormFunc;

    getAllAdmin();
    getAllReserv();
}

importer();

let idHolder;

const createBook = async (event) => {
    event.preventDefault();
    const arr = arrayCleaner(event, "createForm");
    if (!arr) {
        return false;
    }

    const dataRes = await createBookAdapter(arr);
    resultPrint("create", dataRes.title);
};

const editBook = async (event) => {
    event.preventDefault();
    const arr = arrayCleaner(event, "editForm");
    if (!arr) {
        return false;
    }

    const dataRes = await editBookAdapter(arr);
    resultPrint("edit", dataRes.title);
};

const deleteBook = async (event) => {
    event.preventDefault();
    const row = event.target.parentElement.parentElement;
    const rowId = row.id;
    const dataRes = await deleteBookAdapter(rowId);

    if (dataRes) {
        getAll();
        const tableBody = row.parentElement; 
        if (tableBody.id === "table-body-res") {
            row.remove();
            if (tableBody.childElementCount === 0) {
                const tableRes = document.getElementById("response-table");
                tableRes.innerHTML = "";
            }
        }
    } else {
        //When Delete fails Do Something
    }
};

const retrieveBook = async(event) => {
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
        setTimeout(() => {
            response.innerHTML = "";
        }, 5000);

        return false;
    }

    const radios = document.getElementsByName("status");
    let selectedRadio;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedRadio = radios[i];
        };
    };

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

const resultPrint = (type, title) => {
    const response = document.getElementById("response");
    let text;
    if (type === "create") {
        text = `${title} Created!`;
    } else {
        text = `${title} (${idHolder}) Edited!`;
    }
    response.innerHTML = text;
    setTimeout(() => {
        response.innerHTML = "";
    }, 3000);

    defaultForm();
    getAll();
    
    const tableRes = document.getElementById("table-body-res")
    if (tableRes) {
        search();   
    }
}

const edit = async (event) => {
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
    mainForm.innerHTML = "";

    const editForm = document.createElement("form");
    editForm.id = "edit-book-form";
    editForm.onsubmit = editBook;
    editForm.innerHTML = `
        <h1>Edit Book</h1>
        <input class="d-block" type="text" name="title" placeholder="Title" required value="${data.title}">
        <input class="d-block" type="text" name="author" placeholder="Autor" required value="${data.author}">
        <input class="d-block" type="number" name="pages" placeholder="Pages" min="1" step="1" pattern="\d*" required value="${data.pages}">
        <input class="d-block" type="text" name="genre" placeholder="Genre" required value="${data.genre}">
        <input class="d-block" type="number" name="year" placeholder="Year" required value="${data.year}">
        <label for="available">Available</label>
        <input class="d-inline" type="radio" name="status" value="available" id="available" ${available}>
        <label for="unavailable">Unavailable</label>
        <input class="d-inline" type="radio" name="status" value="unavailable" id="unavailable" ${unavailable}>
        <div>
            <button type="submit">Edit book</button>
            <button type="button" onclick='defaultForm()'>Cancel</button>
        </div>
    `;
    mainForm.appendChild(editForm);
}

const defaultForm = () => {
    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = "";

    const addForm = document.createElement("form");
    addForm.id = "create-book-form";
    addForm.onsubmit = createBook;
    addForm.innerHTML = `
        <h1>Add Book</h1>
        <input class="d-block" type="text" name="title" placeholder="Title" required>
        <input class="d-block" type="text" name="author" placeholder="Autor" required>
        <input class="d-block" type="number" name="pages" placeholder="Pages" min="1" step="1" pattern="\d*" required>
        <input class="d-block" type="text" name="genre" placeholder="Genre" required>
        <input class="d-block" type="number" name="year" placeholder="Year" required>
        <label for="available">Available</label>
        <input class="d-inline" type="radio" name="status" value="available" id="available" checked>
        <label for="unavailable">Unavailable</label>
        <input class="d-inline" type="radio" name="status" value="unavailable" id="unavailable">
        <button class="d-block" type="submit">Add book</button>
    `;
    mainForm.appendChild(addForm);
};

const clearFields = (event) => {
    const target = event.target;
    for (let i = 0; i < target.length; i++) {
        if (!(target[i].type === "radio")) {
            target[i].value = "";
        };
    };
};

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