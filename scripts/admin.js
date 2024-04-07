let createBookAdapter, editBookAdapater, deleteBookAdapter;
const importer = async () => {
    const { getAll, createBook, editBook, deleteBook } = await import("./adminAdapter.js");
    createBookAdapter = createBook;
    editBookAdapater = editBook;
    deleteBookAdapter = deleteBook;
    getAll();
}

importer();

let idHolder;

const edit = async (event) => {
    const rowId = event.target.parentElement.parentElement.id;
    const res = await fetch(`../api/books.php?query=get_book&id=${rowId}`);
    const data = await res.json();
    idHolder = data.id;

    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = "";

    const editForm = document.createElement("form");
    editForm.id = "edit-book-form";
    editForm.onsubmit = editBookAdapater;
    editForm.innerHTML = `
        <h1>Edit Book</h1>
        <input type="text" name="title" placeholder="Title" value="${data.title}">
        <input type="text" name="authors" placeholder="Autor" value="${data.authors}">
        <input type="text" name="pages" placeholder="Pages" value="${data.pages}">
        <input type="text" name="genre" placeholder="Genre" value="${data.genre}">
        <input type="number" name="year" placeholder="Year" value="${data.year}">
        <label for="available">Available</label>
        <input style="display: inline;" type="radio" name="status" value="available" id="available" checked>
        <label for="available">Unavailable</label>
        <input style="display: inline;" type="radio" name="status" value="unavailable" id="unavailable">
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
        <input type="text" name="title" placeholder="Title" required>
        <input type="text" name="authors" placeholder="Autor" required>
        <input type="number" name="pages" placeholder="Pages" min="1" step="1" pattern="\d*" required>
        <input type="text" name="genre" placeholder="Genre" required>
        <input type="number" name="year" placeholder="Year" required>
        <label for="available">Available</label>
        <input style="display: inline;" type="radio" name="status" value="available" id="available" checked>
        <label for="unavailable">Unavailable</label>
        <input style="display: inline;" type="radio" name="status" value="unavailable" id="unavailable">
        <button style="display: block;" type="submit">Add book</button>
    `;
    mainForm.appendChild(addForm);
};

