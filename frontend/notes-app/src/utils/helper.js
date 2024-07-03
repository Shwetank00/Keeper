export const validateEmail = (email) => {
  // The regular expression to be used for validation.
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Use the test() method of the regular expression to check if the email address matches the pattern.
  return regex.test(email);
};

export const getInitials = (name) => {
  // If the name is empty, return an empty string.
  if (!name) return "";

  // Split the name into an array of words.
  const words = name.split(" ");

  // Initialize an empty string to store the initials.
  let initials = "";

  // Loop through the first two words of the name (or all the words if there are fewer than two).
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    // Add the first letter of each word to the initials string.
    initials += words[i][0];
  }

  // Return the initials string in uppercase.
  return initials.toUpperCase();
};
