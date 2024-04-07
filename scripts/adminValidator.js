export const validate = (event, type) => {
    let validation = {
        state: true,
        field: "none",
        message: "none",
    }

    const targets = event.target;
    let lengthInputs;

    //Remove buttons from the inputs length
    if (type === "createForm") {
        lengthInputs = targets.length - 1;
    } else if (type === "editForm") {
        lengthInputs = targets.length - 2;
    } else {
        validation.state = false;
        validation.field = "global";
        validation.message = "Form is not correct, reload and try again";
        return validation;
    }

    //Check the expected length (0-indexed) of the form
    if (lengthInputs !== 7) {
        validation.state = false;
        validation.field = "global";
        validation.message = "Unexpected amount of fields, reload and try again";
        return validation;
    };

    //In case a name has an invalid name (external manipulation)
    const wrongForm = () => {
        validation.state = false;
        validation.field = "global";
        validation.message = "Form is not correct, reload and try again";
    }

    //Check if the inputs are empties
    for (let i = 0; i < lengthInputs; i++) {
        if (targets[i].value == "") {
            validation.state = false;
            validation.field = "global";
            validation.message = "Fill all fields";
            return validation;
        };
    };

    //Alphanumeric test for title
    if (targets[0].name === "title") {
        if (!(/^(\w\.?\s?)+$/.test(targets[0].value))) {
            validation.state = false;
            validation.field = targets[0].name;
            validation.message = "Title is not correct, use alphanumeric chars only and avoid long spaces";
            return validation;
        };
    } else {
        wrongForm();
        return validation;
    };

    //Alphabetical only test
    if (targets[1].name === "authors") {
        if (!(/^([a-zA-Z]\.?\s?)+$/.test(targets[1].value))) {
            validation.state = false;
            validation.field = targets[1].name;
            validation.message = "Authors is not correct, use alphabetical chars only and avoid long spaces";
            return validation;
        };
    } else {
        wrongForm();
        return validation;
    };

    //Numeric integer only test
    if (targets[2].name === "pages") {
        console.log(targets[2].name);
        if (!(/^\d+$/.test(targets[2].value)) || targets[2].value <= 0) {
            validation.state = false;
            validation.field = targets[2].name;
            validation.message = "Pages is not correct, use positive integers only and avoid long spaces";
            return validation;
        };
    } else {
        wrongForm();
        return validation;
    };

    //Alphabetical only test
    if (targets[3].name === "genre") {
        if (!(/^[a-zA-Z]+$/.test(targets[3].value))) {
            validation.state = false;
            validation.field = targets[3].name;
            validation.message = "Genre is not correct, use alphabetical chars only and avoid long spaces";
            return validation;
        };
    } else {
        wrongForm();
        return validation;
    };

    //Numeric integer only test
    if (targets[4].name === "year") {
        if (!(/^\-?\d+$/.test(targets[4].value))) {
            validation.state = false;
            validation.field = targets[4].name;
            validation.message = "Pages is not correct, use numeric chars only and avoid long spaces";
            return validation;
        };
    } else {
        wrongForm();
        return validation;
    };

    //Check radio button values
    if ((targets[5].name === "status") && (targets[6].name === "status")) {
        if (!(/^available$/.test(targets[5].value)) || !(/^unavailable$/.test(targets[6].value))) {
            validation.state = false;
            validation.field = targets[5].name;
            validation.message = "Radio buttons contain wrong information, reload the page";
            return validation;
        };
    } else {
        wrongForm();
        return validation;
    };

    return validation;
}