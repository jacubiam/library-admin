let validateMain;
let getAll, search, sortBookList, sortBookResult, fillTableFunc;
let loanAdapter, returnBookAdapter;
let searchSubmit, resCleaner, cleanResults, listToggler, searchForm;

const importer = async () => {
    const { validate } = await import("./scripts/mainValidator.js");
    const { getAllMain, sortList } = await import("./scripts/list.js");
    const { searchBookMain, sortResult } = await import("./scripts/search.js");
    const { fillTable } = await import("./scripts/utils.js");
    const { loanBook, returnBook } = await import("./scripts/adapters.js");
    const { searchSubmitFunc, resCleanerFunc, cleanResultsFunc, listTogglerFunc, searchFormFunc, hamburgerListener } = await import("./scripts/commons.js");

    validateMain = validate;
    getAll = getAllMain, sortBookList = sortList;
    search = searchBookMain, sortBookResult = sortResult;
    fillTableFunc = fillTable;
    loanAdapter = loanBook, returnBookAdapter = returnBook;
    searchSubmit = searchSubmitFunc, resCleaner = resCleanerFunc, cleanResults = cleanResultsFunc, listToggler = listTogglerFunc, searchForm = searchFormFunc;

    hamburgerListener();
    getAllMain();
}

importer();

const loanBook = async (event) => {
    event.preventDefault();
    const idBook = event.target[0].value.trim();
    const userName = event.target[2].value.trim();

    const validation = validateMain(idBook, userName);
    const response = document.getElementById("response");
    response.parentElement.classList.replace("d-none", "d-inline-block");
    if (!validation.state) {
        response.innerHTML = validation.message;

        return false;
    }

    const data = await loanAdapter(idBook, userName);
    if (!data) {
        response.innerHTML = "Book not Available for loan";

        return false;
    }

    response.classList.replace("text-danger-emphasis", "text-success-emphasis");
    response.innerHTML = `Book ${data.res}`;

    getAll();
    const tableRes = document.getElementById("table-body-res");
    if (tableRes) {
        search();
    }
}

const returnBook = async (event) => {
    event.preventDefault();
    const id = event.target[0].value;
    const userName = event.target[1].value;
    const validation = validateMain(id, userName);
    const response = document.getElementById("response");
    response.parentElement.classList.replace("d-none", "d-inline-block");
    if (!validation.state) {
        response.innerHTML = validation.message;

        return false;
    }

    const isReturned = await returnBookAdapter(id, userName, "main");

    if (!isReturned) {
        response.innerHTML = "Sorry, but you have an incorrect ID or username";

        return false;
    }

    response.classList.replace("text-danger-emphasis", "text-success-emphasis");
    response.innerHTML = `${id} returned`;

    getAll();
    const tableRes = document.getElementById("table-body-res");
    if (tableRes) {
        search();
    }
}

const sortListMain = () => {
    const values = sortBookList();
    fillTableFunc(values.array, values.target, "main");
}

const sortResultMain = () => {
    const values = sortBookResult();
    fillTableFunc(values.array, values.target, "main");
}

const loanForm = (event) => {
    const response = document.getElementById("response");
    response.parentElement.classList.replace("d-inline-block", "d-none");
    response.classList.replace("text-success-emphasis", "text-danger-emphasis");

    const infoText = document.getElementById("info-text");
    infoText.innerHTML = "Borrow a book with your name (or any name)";

    const parentRow = event.target.parentElement.parentElement;
    const rowId = parentRow.children[1].innerHTML;
    const title = parentRow.children[2].innerHTML;

    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = `
    <h1 class="text-center text-lg-start">Loan Form</h1>
    <form class="border border-secondary rounded-3 p-3" id="loan-form" method="post" onsubmit="loanBook(event)">
        <label class="form-label" for="book-id">Book:</label>
        <input class="form-control id-loan d-inline w-auto" id="book-id" type="text" name="id" placeholder="ID" required readonly disabled value="${rowId}">
        <input class="form-control d-inline w-auto title-loan" type="text" name="title" placeholder="title" required readonly disabled value="${title}">
        <div class="my-3">
            <label class="form-label" for="user_name">Your Name:</label>
            <input class="form-control d-inline w-auto" id="user-name" type="text" name="user_name" onkeydown="resCleaner()" required>
        </div>
        <button class="btn btn-success" type="submit">Borrow it!</button>
        <button class="btn btn-outline-info" type="button" onclick="searchForm(event)">Cancel</button>
    </form>
    `;

    mainForm.scrollIntoView(true);
}

const returnForm = () => {
    const response = document.getElementById("response");
    response.parentElement.classList.replace("d-inline-block", "d-none");
    response.classList.replace("text-success-emphasis", "text-danger-emphasis");

    const infoText = document.getElementById("info-text");
    infoText.innerHTML = "Return a book for its ID and borrower's name.<br /><br />Hint: See <a href='./pages/admin.html#reservation-table'>Reservation List</a>";

    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = `
    <h1 class="text-center text-lg-start">Return Form</h1>
    <form class="border border-secondary rounded-3 p-3" id="return-form" method="get" onsubmit="returnBook(event)">
        <label class="form-label main-label" for="book-id">Book ID:</label>
        <input class="form-control id-return d-inline w-auto" id="book-id" type="number" name="id" placeholder="ID" min="1" max="9999" onkeydown="resCleaner()" required>
        <div class="my-3">
            <label class="form-label main-label" for="user-name">Your Name:</label>
            <input class="form-control d-inline w-auto" id="user-name" type="text" name="user_name" placeholder="User Name" onkeydown="resCleaner()" required>
        </div>
        <button class="btn btn-success" type="submit">Return Book</button>
        <button class="btn btn-outline-info" type="button" onclick="searchForm(event)">Cancel</button>
    </form>
    `;
}