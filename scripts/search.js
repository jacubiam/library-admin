import { searchBook } from "./adapters.js";
import { sorter, filterNA, fillTable } from "./utils.js";

let resultCache = undefined;
let lastFilter = undefined;
let lastInput = undefined;

export const searchBookMain = async (filter = lastFilter, input = lastInput) => {
    if (!filter || !input) {
        return false;
    }

    const data = await searchPerform(filter, input, "main");
    if (!data) {
        return false;
    }

    tableResult("main");

    const values = sortResult(data);
    const checkboxNA = document.getElementById("na-filter-res");
    if (checkboxNA) {
        if (checkboxNA.checked) {
            values.array = filterNA(values.array);
        }
    }
    fillTable(values.array, values.target, "main");
}

export const searchBookAdmin = async (filter = lastFilter, input = lastInput) => {
    if (!filter || !input) {
        return false;
    }

    const data = await searchPerform(filter, input, "admin");
    if (!data) {
        return false;
    }

    tableResult("admin");

    const values = sortResult(data);
    fillTable(values.array, values.target, "admin");
}

const searchPerform = async (filter, input, context) => {
    const filterClean = filter.toLowerCase().trim();
    const inputClean = input.toLowerCase().trim();
    const data = await searchBook(filterClean, inputClean, context);
    resultCache = data;
    lastFilter = filterClean;
    lastInput = inputClean;

    if (!data) {
        const response = document.getElementById("response");
        response.parentElement.classList.replace("d-none", "d-inline-block");
        response.classList.replace("text-success-emphasis", "text-danger-emphasis");
        response.innerHTML = `No book was found with the <span class='fw-bold'>${filter} ${input}</span>`;
        const tableRes = document.getElementById("response-table");
        tableRes.innerHTML = "";
        return false;
    }

    return data;
}

const tableResult = (context) => {
    let sorter;
    if (context === "main") {
        sorter = "sortResultMain()";
    } else {
        sorter = "sortResultAdmin()";
    }

    const tableRes = document.getElementById("response-table");
    tableRes.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h1 class="d-inline align-middle">Results</h1>
            <button class="btn btn-outline-light align-text-top ms-3" type="button" onclick="cleanResults()">Clear</button>
        </div>
        <div>
            <div class="d-inline-block align-middle">
                <span>Sort:</span>
                <select class="form-select d-inline w-auto" id="select-list-res" aria-label="Select sort" onchange=${sorter}>
                    <option value="id">ID</option>
                    <option selected value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="pages">Pages</option>
                    <option value="genre">Genre</option>
                    <option value="year">Year</option>
                    <option value="status">Status</option>
                </select>
            </div>
            <div class="d-inline-block align-middle border border-1 rounded-1 p-1">
                <label class="form-check-label" for="order-list-res">Descending</label>
                <input class="form-check-input align-text-top" type="checkbox" name="order" id="order-list-res" onchange=${sorter}>
                ${context === "main" ?
            `   <br /><label class="form-check-label border-top" for="na-filter-res">Only Available</label>
                    <input class="form-check-input align-text-top" type="checkbox" name="na-filter" id="na-filter-res" onchange=${sorter} checked>`
            : ""}
            </div>
        </div>
    </div>
    <table class="table table-sm table-bordered table-hover">
        <thead>
            <tr>
                <th>#</th>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th># Pages</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Status</th>
                <th class="width-actions">Actions</th>
            </tr>
        </thead>
        <tbody id="table-body-res">
        </tbody>
    </table>
    `;
}

export const sortResult = (arr = resultCache) => {
    const data = {
        array: [],
        target: null,
    }

    const tableList = document.getElementById("table-body-res");
    tableList.innerHTML = "";
    const sort = document.getElementById("select-list-res").value;
    const checkbox = document.getElementById("order-list-res").checked;

    const list = sorter(arr, sort, checkbox);
    data.array = list;
    data.target = tableList;

    return data;
}