import { getAllBooks } from "./adapters.js";
import { sorter, fillTable } from "./utils.js";
let listCache = undefined;

export const getAllMain = async () => {
    const data = await getAllBooks("./api/books.php?query=get_all");
    listCache = data;

    const values = sortList(data);
    fillTable(values.array, values.target, "main");
}

export const getAllAdmin = async () => {
    const data = await getAllBooks("../api/books.php?query=get_all");
    listCache = data;

    const values = sortList(data);
    fillTable(values.array, values.target, "admin");
}

export const getAllReserv = async () => {

}

export const sortList = (arr = listCache) => {
    const data = {
        array: [],
        target: null,
    }

    const tableList = document.getElementById("table-body");
    tableList.innerHTML = ""
    const sort = document.getElementById("select-list").value;
    const checkbox = document.getElementById("order-list").checked;

    const list = sorter(arr, sort, checkbox)
    data.array = list;
    data.target = tableList;

    return data;
}



