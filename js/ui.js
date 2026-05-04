export function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>Login</h1>
    <input id="username" type="text" placeholder="Username" />
    <input id="password" type="text" placeholder="Password" />
    <button id="btn">Login</button>`
    ;


     const username1 = document
    .getElementById("username")
    username1.addEventListener("input", () => {
    console.log(username1.value);
  });

  const password1 = document
    .getElementById("password")
    password1.addEventListener("input", () => {
    console.log(password1.value);
  });

  document
    .getElementById("btn")
    .addEventListener("click", () => {
      console.log(username1.value,password1.value);
    });
}
   