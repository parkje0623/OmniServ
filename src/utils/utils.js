// Handle Confirm Password Match
export const checkConfirmPassword = (password, confirm, setConfirmError) => {
    if (password === confirm) {
        setConfirmError("");
        return true;
    }
    setConfirmError("Confirm password must match the current password.");
    return false;
};

// Handle Password Must Not Match
export const checkPasswordNotMatch = (oldPassword, newPassword, setError) => {
    if (oldPassword !== newPassword) {
        setError("");
        return true;
    }
    setError("New password MUST not match the current password.");
    return false;
}

// Handle Password Condition Validation
export const checkPasswordConditions = (password, setPasswordError) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);
    const isValidLength = password.length >= 8;

    let errorMsg = "";
    switch (true) {
        case !isValidLength:
            errorMsg = "*Password must be at least 8 characters long.";
            break;
        case !hasUppercase:
            errorMsg = "*Password must contain at least one uppercase letter.";
            break;
        case !hasLowercase:
            errorMsg = "*Password must contain at least one lowercase letter.";
            break;
        case !hasNumber:
            errorMsg = "*Password must contain at least one number.";
            break;
        case !hasSpecialChar:
            errorMsg = "*Password must contain at least one of (!@#$%^&*()).";
            break;
        default:
            setPasswordError("");
            return true;
    }
    setPasswordError(errorMsg);
    return false;
};