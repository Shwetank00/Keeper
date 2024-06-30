
export const validateEmail = (email) => {
    // The regular expression to be used for validation.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Use the test() method of the regular expression to check if the email address matches the pattern.
    return regex.test(email);
};
