let validateMain;
const importer = async () => {
    const { validate } = await import("./scripts/mainValidator.js");
    validateMain = validate;
}

let listCache = undefined;
let resultCache = undefined;
let lastFilter = undefined;
let lastInput = undefined;

const getAllAdapter = async () => {
    const res = await fetch("./api/books.php?query=get_all");
    const data = await res.json();
    return data;
}

const searchAdapter = async (filter, input) => {
    const res = await fetch(`./api/books.php?query=${filter}&search=${input}`);
    const data = await res.json();
    return data;
}

const loanAdapter = async (id, user) => {
    const data = {
        id: id,
        user_name: user,
    }

    const res = await fetch("./api/reservations.php", {
        method: "POST",
        headers: "Content-type: application/json",
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Book not Available for loan")
    }

    const resJS = await res.json();
    return resJS;
}

const getAll = async () => {
    const data = await getAllAdapter();
    listCache = data;

    sortList(data);
};

const search = async (filter, input) => {
    const filterClean = filter.toLowerCase().trim();
    const inputClean = input.toLowerCase().trim();
    const data = await searchAdapter(filterClean, inputClean)
    resultCache = data;
    lastFilter = filterClean;
    lastInput = inputClean;

    if (data.not_found) {
        const responseText = document.getElementById("response");
        responseText.innerHTML = `We do not have a book with the <span>${input}</span> <span>${filter}</span>`;
        const tableRes = document.getElementById("response-table");
        tableRes.innerHTML = "";
        return false;
    }

    const tableRes = document.getElementById("response-table");
    tableRes.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h1 class="d-inline align-middle">Results</h1>
            <button class="align-text-top ms-3" type="button" onclick="cleanResults()">Clean</button>
        </div>
        <div>
            <span>Sort:</span>
            <select class="form-select d-inline w-auto" id="select-list-res" aria-label="Select sort" onchange="sortResult()">
                <option value="id">ID</option>
                <option selected value="title">Title</option>
                <option value="author">Author</option>
                <option value="pages">Pages</option>
                <option value="genre">Genre</option>
                <option value="year">Year</option>
                <option value="status">Status</option>
            </select>
            <label for="order-list-res">Descending</label>
            <input type="checkbox" name="order" id="order-list-res" onchange="sortResult()">
        </div>
    </div>
    <table class="table table-sm table-bordered table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th># Pages</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="table-body-res">
        </tbody>
    </table>
    `;

    const tbody = document.getElementById("table-body-res");
    sortResult(data, tbody)
};

const loanBook = async (event) => {
    event.preventDefault();
    const idBook = event.target[0].value.trim();
    const userName = event.target[2].value.trim();

    const validation = validateMain(idBook, userName);
    if (!validation.state) {
        const response = document.getElementById("response");
        response.innerHTML = validation.message;
        setTimeout(() => {
            response.innerHTML = "";
        }, 5000);

        return false;
    }

    const data = await loanAdapter(idBook, userName);
    const response = document.getElementById("response");
    if (!data) {
        response.innerHTML = "Book not Available for loan";
        setTimeout(() => {
            response.innerHTML = "";
        }, 3000);

        return false;
    }

    response.innerHTML = `${data.title} lent!`;
    setTimeout(() => {
        response.innerHTML = "";
    }, 3000);
}

const sortList = (arr = listCache) => {
    const tableList = document.getElementById("table-body");
    tableList.innerHTML = ""
    const sort = document.getElementById("select-list").value;
    const checkbox = document.getElementById("order-list").checked;

    const list = sorter(arr, sort, checkbox)
    fillTable(list, tableList);
}

const sortResult = (arr = resultCache) => {
    const tableList = document.getElementById("table-body-res");
    tableList.innerHTML = ""
    const sort = document.getElementById("select-list-res").value;
    const checkbox = document.getElementById("order-list-res").checked;

    const list = sorter(arr, sort, checkbox)
    fillTable(list, tableList);
}

const sorter = (arr, sort, descend) => {
    switch (sort) {
        case "title":
            arr.sort((a, b) => {
                const sa = a.title.toLowerCase(), sb = b.title.toLowerCase();
                if (sa < sb) {
                    return -1
                }
                if (sa > sb) {
                    return 1
                }
                return 0
            });
            break;
        case "author":
            arr.sort((a, b) => {
                const sa = a.author.toLowerCase(), sb = b.author.toLowerCase();
                if (sa < sb) {
                    return -1
                }
                if (sa > sb) {
                    return 1
                }
                return 0
            });
            break;
        case "pages":
            arr.sort((a, b) => {
                return a.pages - b.pages;
            });
            break;
        case "genre":
            arr.sort((a, b) => {
                const sa = a.genre.toLowerCase(), sb = b.genre.toLowerCase();
                if (sa < sb) {
                    return -1
                }
                if (sa > sb) {
                    return 1
                }
                return 0
            });
            break;
        case "year":
            arr.sort((a, b) => {
                return a.year - b.year;
            });
            break;
        case "status":
            arr.sort((a, b) => {
                const sa = a.status.toLowerCase(), sb = b.status.toLowerCase();
                if (sa < sb) {
                    return -1
                }
                if (sa > sb) {
                    return 1
                }
                return 0
            });
            break;
        default:
            arr.sort((a, b) => {
                return a.id - b.id;
            });
            break;
    }

    if (descend) {
        arr.reverse();
    }

    return arr;
}

const fillTable = async (arr, target) => {
    arr.forEach(value => {
        let action = "N/A";

        if (value.status === "available") {
            action = "<button type='button' onclick='loan(event)'>Loan</button>"
        }

        const tr = document.createElement("tr");
        tr.id = value.id;
        tr.innerHTML += `
            <td>${value.id}</td>
            <td>${value.title}</td>
            <td>${value.author}</td>
            <td>${value.pages}</td>
            <td>${value.genre}</td>
            <td>${value.year}</td>
            <td>${value.status}</td>
            <td>
                ${action}
            </td>
            `
        target.appendChild(tr)
    });
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
            <label for="user_name">Your Name</label>
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
        <select class="form-select d-inline w-auto" aria-label="Default select example">
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
            <option value="year">Year</option>
        </select>
        <input type="text" name="search" placeholder="Search" onkeydown="searchInput(event)" required>
    </form>
    `;
}

getAll();

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