const getAll = async () => {
    const res = await fetch("./api/books.php?query=get_all");
    const data = await res.json();


    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    data.forEach(value => {
        let action = "N/A";

        if (value.status === "available") {
            action = "<button type='button' onclick='borrow(event)'>Borrow</button>"
        }

        const tr = document.createElement("tr");
        tr.id = value.id;
        tr.innerHTML += `
            <td>${value.id}</td>
            <td>${value.title}</td>
            <td>${value.authors}</td>
            <td>${value.pages}</td>
            <td>${value.genre}</td>
            <td>${value.year}</td>
            <td>${value.status}</td>
            <td>
                ${action}
            </td>
        `
        tableBody.appendChild(tr)
    });
};

getAll();

const searchSubmit = (event) => {
    event.preventDefault();
    search(event.target[0].value, event.target[1].value);
}

const searchInput = (event) => {
    const responseText = document.getElementById("response");
    responseText.innerHTML = "";

    if (event.key === "Enter") {
        const parent = event.target.parentElement;
        search(parent[0].value, event.target.value)
    }
}

const cleanResults = () => {
    const tableRes = document.getElementById("response-table");
    tableRes.innerHTML = "";
}

const search = async (filter, input) => {
    const filterClean = filter.toLowerCase().trim();
    const inputClean = input.toLowerCase().trim();
    const res = await fetch(`./api/books.php?query=${filterClean}&search=${inputClean}`);
    const data = await res.json();

    if (!res.ok) {
        const responseText = document.getElementById("response");
        responseText.innerHTML = `We do not have a book with the <span>${input}</span> <span>${filter}</span>`;
        const tableRes = document.getElementById("response-table");
        tableRes.innerHTML = "";
        return false;
    }

    const tableRes = document.getElementById("response-table");
    tableRes.innerHTML = `
    <div>
        <h1 class="d-inline align-middle">Results</h1>
        <button class="align-text-top ms-3" type="button" onclick="cleanResults()">Clean</button>
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
        <tbody id="table-body">
        </tbody>
    </table>
    `;

    const tbody = document.getElementById("table-body");

    data.forEach(value => {
        let action = "N/A";

        if (value.status === "available") {
            action = "<button type='button' onclick='borrow(event)'>Borrow</button>"
        }

        const tr = document.createElement("tr");
        tr.id = value.id;
        tr.innerHTML += `
            <td>${value.id}</td>
            <td>${value.title}</td>
            <td>${value.authors}</td>
            <td>${value.pages}</td>
            <td>${value.genre}</td>
            <td>${value.year}</td>
            <td>${value.status}</td>
            <td>
                ${action}
            </td>
        `
        tbody.appendChild(tr)
    });
};