export function logout(){

localStorage.removeItem(
"token"
);

}


export function isLoggedIn(){

return !!localStorage.getItem(
"token"
);

}