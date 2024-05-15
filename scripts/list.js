import { getAllData } from "./adapters.js";
import { sorter, filterNA, filterOL, fillTable } from "./utils.js";
let listCache = undefined;
let reservCache = undefined;

export const getAllMain = async () => {
    const data = await getAllData("./api/books.php?query=get_all");
    listCache = data;

    const values = sortList(data);
    const checkboxNA = document.getElementById("na-filter");
    if (checkboxNA) {
        if (checkboxNA.checked) {
            values.array = filterNA(values.array);
        }
    }
    fillTable(values.array, values.target, "main");
}

export const getAllAdmin = async () => {
    const data = await getAllData("../api/books.php?query=get_all");
    listCache = data;

    const values = sortList(data);
    const checkboxOL = document.getElementById("ol-filter");
    if (checkboxOL) {
        if (checkboxOL.checked) {
            values.array = filterOL(values.array);
        }
    }
    fillTable(values.array, values.target, "admin");
}

export const getAllReserv = async () => {
    const data = await getAllData("../api/reservations.php?query=get_all");

    if (data.length > 0) {
        reservCache = data;
        const values = sortReserv(data);
        fillTable(values.array, values.target, "reserv");
    }
}

export const sortList = (arr = listCache) => {
    const data = {
        array: [],
        target: null,
    }

    const tableList = document.getElementById("table-body");
    tableList.innerHTML = "";
    const sort = document.getElementById("select-list").value;
    const checkbox = document.getElementById("order-list").checked;

    const list = sorter(arr, sort, checkbox);
    data.array = list;
    data.target = tableList;

    return data;
}

export const sortReserv = (arr = reservCache) => {
    const data = {
        array: [],
        target: null,
    }

    const tableList = document.getElementById("table-body-reserv");
    tableList.innerHTML = "";
    const sort = document.getElementById("select-list-reserv").value;
    const checkbox = document.getElementById("order-list-reserv").checked;

    const list = sorter(arr, sort, checkbox);
    data.array = list;
    data.target = tableList;

    return data;
}


