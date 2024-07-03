export const validateEmail = (email) => {
  // The regular expression to be used for validation.
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Use the test() method of the regular expression to check if the email address matches the pattern.
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};
