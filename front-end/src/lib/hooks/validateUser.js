export function validateUsername(username) {
  const usernameRegex = /^[a-z0-9]{8,}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password) {
  const passwordRegex = /^[a-zA-Z0-9]{8,}$/;
  return passwordRegex.test(password);
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

export function validateName(name) {
  const nameRegex = /^[\p{L} ]{4,}$/u;
  return nameRegex.test(name);
}
