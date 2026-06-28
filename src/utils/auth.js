export function logout() {
  localStorage.removeItem("token");

  localStorage.removeItem("role");

  localStorage.removeItem("email");

  window.location.href = "/";
}

export function getRole() {
  return localStorage.getItem("role");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
