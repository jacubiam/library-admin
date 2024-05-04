export const searchSubmitFunc = (event) => {
    event.preventDefault();
    search(event.target[0].value, event.target[1].value);
}

//This function is for later features
export const searchInputFunc = (event) => {
    const responseText = document.getElementById("response");
    responseText.innerHTML = "";
    /*if (event.key === "Enter") {
        const parent = event.target.parentElement;
        search(parent[0].value, event.target.value)
    } */
}

export const cleanResultsFunc = () => {
    const tableRes = document.getElementById("response-table");
    tableRes.innerHTML = "";
}

let listStatus = true;
export const listTogglerFunc = (event) => {
    const button = event.target;
    if (listStatus) {
        setTimeout(() => {
            button.innerHTML = "Show List";
        }, 300)
    } else {
        button.innerHTML = "Hide List";
    }
    listStatus = !listStatus;
}

export const searchFormFunc = () => {
    const infoText = document.getElementById("info-text");
    infoText.innerHTML = "Search for a book given the selected filter";

    const mainForm = document.getElementById("main-form");
    mainForm.innerHTML = `
    <h1 class="text-center text-lg-start">Book Searching</h1>
    <form class="border border-secondary rounded-3 p-3" id="search-form" method="post" onsubmit="searchSubmit(event)">
        <select class="form-select d-inline w-auto mb-2 mb-sm-0" aria-label="Filter Select">
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
            <option value="year">Year</option>
        </select>
        <input class="form-control d-inline w-auto" type="text" name="search" placeholder="Search" onkeydown="searchInput(event)" required>
    </form>
    `;
}

export const hamburgerListener = () => {
    const ham =  document.getElementById("hamburger-btn");
    ham.addEventListener("focusout", () => {
        ham.click();
    });
}