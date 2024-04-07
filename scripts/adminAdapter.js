import { validate } from "./adminValidator.js";

export const getAll = async () => {
    const res = await fetch("../api/books.php?query=get_all");
    const data = await res.json();

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    data.forEach(value => {
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
                <button type='button' onclick='edit(event)'>Edit</button>
                <button type='button' onclick='deleteBookAdapter(event)'>Delete</button>
            </td>
        `
        tableBody.appendChild(tr)
    });
};

export const createBook = async (event) => {
    event.preventDefault();
    const validation = validate(event, "createForm");
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

    const data = {
        title: event.target[0].value,
        authors: event.target[1].value,
        pages: event.target[2].value,
        genre: event.target[3].value,
        year: event.target[4].value,
        status: selectedRadio.value,
    };

    const res = await fetch("../api/books.php", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Algo esta mal, crack');
    };

    const resJS = await res.json();

    const response = document.getElementById("response");
    response.innerHTML = `${resJS.title} Created!`;
    setTimeout(() => {
        response.innerHTML = "";
    }, 3000);

    clearFields(event);
    getAll();
};

export const editBook = async (event) => {
    event.preventDefault();
    const validation = validate(event, "editForm");
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

    const dataUpdated = {
        id: idHolder.trim(),
        title: event.target[0].value.trim(),
        authors: event.target[1].value.trim(),
        pages: event.target[2].value.trim(),
        genre: event.target[3].value.trim(),
        year: event.target[4].value.trim(),
        status: selectedRadio.value.trim(),
    };

    const res = await fetch("../api/books.php", {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(dataUpdated),
    });

    if (!res.ok) {
        throw new Error('Algo esta mal, crack');
    };

    const resJS = await res.json();

    const response = document.getElementById("response");
    response.innerHTML = `${resJS.title} (${idHolder}) Edited!`;
    setTimeout(() => {
        response.innerHTML = "";
    }, 3000);

    defaultForm();
    getAll();
};

export const deleteBook = async (event) => {
    event.preventDefault();
    const rowId = event.target.parentElement.parentElement.id;
    const res = await fetch(`../api/books.php?id=${rowId}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Algo esta mal, crack');
    };

    getAll();
};

const clearFields = (event) => {
    const target = event.target;
    for (let i = 0; i < target.length; i++) {
        if (!(target[i].type === "radio")) {
            target[i].value = "";
        };
    };
};