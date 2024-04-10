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
            action = "<button type='button' onclick='borrow(event)'>Borrow</button>"
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