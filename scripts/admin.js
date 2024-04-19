import { validate } from "./adminValidator.js";

let idHolder;

export const createBook = async (event) => {
    event.preventDefault();
    const arr = arrayCleaner(event, "createForm");
    if (!arr) {
        return false;
    }

    const dataRes = await createBookAdapter(arr);
    resultPrint("create", dataRes.title);
};

export const editBook = async (event) => {
    event.preventDefault();
    const arr = arrayCleaner(event, "editForm");
    if (!arr) {
        return false;
    }
    
    const dataRes = await editBookAdapater(arr);
    resultPrint("edit", dataRes.title);
};

export const deleteBook = async (event) => {
    event.preventDefault();
    const rowId = event.target.parentElement.parentElement.id;
    const dataRes = editBookAdapater(rowId);

    if (dataRes) {
        //
        getAll();
    } else {
        //
    }
};

const arrayCleaner = (event, type) => {
    const validation = validate(event, type);
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
        title: event.target[0].value.trim(),
        author: event.target[1].value.trim(),
        pages: event.target[2].value.trim(),
        genre: event.target[3].value.trim(),
        year: event.target[4].value.trim(),
        status: selectedRadio.value.trim(),
    };

    if (type == "editForm") {
        data.id = idHolder.trim();
    }

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
}

export const edit = async (event) => {
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
    editForm.onsubmit = editBookAdapater;
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
    addForm.onsubmit = createBookAdapter;
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