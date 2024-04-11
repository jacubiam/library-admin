export const validate = (id, userName) => {
    let validation = {
        state: true,
        field: "none",
        message: "none",
    }

    if (id === "") {
        validation.state = false;
        validation.field = "id";
        validation.message = "ID is not correct, use positive integers only and avoid long spaces";
        return validation;
    }

    if (userName === "") {
        validation.state = false;
        validation.field = "user_name";
        validation.message = "Name cannot be empty";
        return validation;
    }
    
    //Numeric integer only test
    if (!(/^\d+$/.test(id)) || id <= 0) {
        validation.state = false;
        validation.field = "id";
        validation.message = "ID is not correct, use positive integers only and avoid long spaces";
        return validation;
    };

    //Alphabetical only test
    if (!(/^([a-zA-Z]'?\.?\s?)+$/.test(userName))) {
        validation.state = false;
        validation.field = "user_name";
        validation.message = "User Name is not correct, use alphabetical chars only and avoid long spaces";
        return validation;
    };

    return validation;
}