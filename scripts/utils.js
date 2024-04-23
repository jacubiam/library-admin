export const sorter = (arr, sort, descend) => {
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
        case "user_name":
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

export const fillTable = async (arr, target, context) => {
    arr.forEach(value => {
        let action = "N/A";

        switch (context) {
            case "main":
                if (value.status === "available") {
                    action = "<button type='button' onclick='loan(event)'>Loan</button>";
                }
                break;
            case "admin":
                action = `
                    <button type='button' onclick='edit(event)'>Edit</button>
                    <button type='button' onclick='deleteBook(event)'>Delete</button>
                `;
                break;
            case "reserv":
                action = "<button type='button' onclick='retrieveBook(event)'>Retrieve</button>";
            default:
                break;
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