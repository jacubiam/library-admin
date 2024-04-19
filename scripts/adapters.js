export const getAllBooks = async () => {
    const res = await fetch("./api/books.php?query=get_all");
    const data = await res.json();
    return data;
}

export const searchBook = async (filter, input) => {
    const res = await fetch(`./api/books.php?query=${filter}&search=${input}`);
    const data = await res.json();
    return data;
}

export const loanBook = async (id, user) => {
    const data = {
        id: id,
        user_name: user,
    }

    const res = await fetch("./api/reservations.php", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Book not Available for loan")
    }

    const resJS = await res.json();
    return resJS;
}

export const returnBook = async (id, userName) => {
    const res = await fetch(`./api/reservations.php?id=${id}&user_name=${userName}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
        },
    });

    if (!res.ok) {
        return false;
    }

    return true;
}

export const createBook = async (arr) => {
    const res = await fetch("../api/books.php", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(arr),
    });

    if (!res.ok) {
        throw new Error('Algo esta mal, crack');
    };

    const data = await res.json();
    return data;
}

export const getBook = async (id) => {
    const res = await fetch(`../api/books.php?query=get_book&id=${id}`);
    const data = await res.json();
    return data;
}

export const editBook = async (arr) => {
    const res = await fetch("../api/books.php", {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(arr),
    });

    if (!res.ok) {
        throw new Error('Algo esta mal, crack');
    };

    const data = await res.json();
    return data;
}

export const deleteBook = async (id) => {
    const res = await fetch(`../api/books.php?id=${rowId}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
    })

    if (!res.ok) {
        return false;
    }

    return true;
}