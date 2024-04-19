let validateMain;
let getAll, search, sortBookList, sortBookResult, fillTableMain;
let loanAdapter, returnBookAdapter;

const importer = async () => {
    const { validate } = await import("./scripts/mainValidator.js");
    const { getAllMain,  sortList } = await import("./scripts/list.js");
    const { searchBookMain, sortResult } = await import("./scripts/search.js");
    const { fillTable } = await import("./scripts/utils.js");
    const { loanBook, returnBook } = await import("./scripts/adapters.js");

    validateMain = validate; 
    getAll = getAllMain, sortBookList = sortList;
    search = searchBookMain, sortBookResult = sortResult; 
    fillTableMain = fillTable;
    loanAdapter = loanBook, returnBookAdapter = returnBook;
    getAllMain();
}

importer();

const loanBook = async (event) => {
    event.preventDefault();
    const idBook = event.target[0].value.trim();
    const userName = event.target[2].value.trim();

    const validation = validateMain(idBook, userName);
    const response = document.getElementById("response");
    if (!validation.state) {
        response.innerHTML = validation.message;
        setTimeout(() => {
            response.innerHTML = "";
        }, 5000);

        return false;
    }

    const data = await loanAdapter(idBook, userName);
    if (!data) {
        response.innerHTML = "Book not Available for loan";
        setTimeout(() => {
            response.innerHTML = "";
        }, 3000);

        return false;
    }

    response.innerHTML = `Book ${data.res}`;
    setTimeout(() => {
        response.innerHTML = "";
    }, 3000);

    getAll();
    search();
}

const returnBook = async (event) => {
    event.preventDefault();
    const id = event.target[0].value;
    const userName = event.target[1].value;
    const validation = validateMain(id, userName);
    const response = document.getElementById("response");
    if (!validation.state) {
        response.innerHTML = validation.message;
        setTimeout(() => {
            response.innerHTML = "";
        }, 5000);

        return false;
    }

    const isReturned = await returnBookAdapter(id, userName);

    if (!isReturned) {
        response.innerHTML = "Sorry, you have an incorrect ID or username";
        setTimeout(() => {
            response.innerHTML = "";
        }, 5000);
        return false;
    }

    response.innerHTML = `${id} returned`;
    setTimeout(() => {
        response.innerHTML = "";
    }, 3000);

    getAll();
    search();
}

const sortListMain = () => {
    const values =  sortBookList();
    fillTableMain(values.array, values.target, "main");
}

const sortResultMain = () => {
    const values = sortBookResult();
    fillTableMain(values.array, values.target, "main");
}

const loan = (event) => {
    const parentRow = event.target.parentElement.parentElement;
    const rowId = parentRow.children[0].innerHTML;
    const title = parentRow.children[1].innerHTML;

    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = `
    <h1>Loan Form</h1>
    <form id="loan-form" method="post" onsubmit="loanBook(event)">
        <span>Book:</span>
        <input class="id-loan" type="text" name="id" placeholder="ID" required readonly disabled value="${rowId}">
        <input class="title-loan" type="text" name="title" placeholder="title" required readonly disabled value="${title}">
        <div class="my-3">
            <label for="user_name">Your Name:</label>
            <input id="user-name" type="text" name="user_name" required>
        </div>
        <button type="submit">Loan Book</button>
        <button type="button" onclick="cancelLoan(event)">Cancel</button>
    </form>
    `;
}

const cancelLoan = () => {
    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = `
    <h1>Book Searching</h1>
    <form id="search-form" method="post" onsubmit="searchSubmit(event)">
        <select class="form-select d-inline w-auto" aria-label="Filter Select">
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
            <option value="year">Year</option>
        </select>
        <input type="text" name="search" placeholder="Search" onkeydown="searchInput(event)" required>
    </form>
    `;
}

const searchSubmit = (event) => {
    event.preventDefault();
    search(event.target[0].value, event.target[1].value);
}

const searchInput = (event) => {
    const responseText = document.getElementById("response");
    responseText.innerHTML = "";

    /*if (event.key === "Enter") {
        const parent = event.target.parentElement;
        search(parent[0].value, event.target.value)
    } */
}

const cleanResults = () => {
    const tableRes = document.getElementById("response-table");
    tableRes.innerHTML = "";
}

let listStatus = true;
const listToggler = (event) => {
    const button = event.target;
    if (listStatus) {
        setTimeout(() => {
            button.innerHTML = "Show Book List";
        }, 300)
    } else {
        button.innerHTML = "Hide Book List";
    }
    listStatus = !listStatus;
}

const returnForm = () => {
    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = `
    <h1>Return Form</h1>
    <form id="return-form" method="get" onsubmit="returnBook(event)">
        <label class="main-label" for="book-id">Book ID:</label>
        <input class="id-return" id="book-id" type="number" name="id" placeholder="ID" min="1" max="9999" required>
        <div class="my-3">
            <label class="main-label" for="user-name">Your Name:</label>
            <input id="user-name" type="text" name="user_name" placeholder="User Name" required>
        </div>
        <button type="submit">Return Book</button>
        <button type="button" onclick="cancelLoan(event)">Cancel</button>
    </form>
    `;
}