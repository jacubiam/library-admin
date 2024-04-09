let createBookAdapter, editBookAdapater, editAdapter, deleteBookAdapter;
const importer = async () => {
    const { getAll, createBook, editBook, edit, deleteBook } = await import("./adminAdapter.js");
    createBookAdapter = createBook;
    editBookAdapater = editBook;
    editAdapter = edit;
    deleteBookAdapter = deleteBook;
    getAll();
}

importer();

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

