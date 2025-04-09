export const REGEX = {
    noSpaces: /^[^\s]+$/,
    startsWithhLetter: /^[a-zA-Z]/,
    validCharacters: /^[a-zA-Z0-9_]+$/, // Only letters, numbers, underscores allowed
    endsWithLetterOrNumber: /[a-zA-Z0-9]$/, // Must end with letter or number
    validEmail: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
};
