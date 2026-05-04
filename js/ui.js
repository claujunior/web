export function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
<div class="container"> 
  <div class="login">
    <h1>Login</h1>
    <input id="username" placeholder="Username">
    <input id="password" placeholder="Password">
    <button>Entrar</button>
  </div>
</div>`
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
   