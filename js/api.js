const API_URL = 'http://127.0.0.1:8000';

export async function login(username, password) {
    const response = await fetch(API_URL+"/users/login",{
     
    method: "POST", 
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        username,
        password
    })
});
    if(!response.ok){
        throw new Error("Login invalido")
    }
    return await response.json()
  };

 export async function cadastroapi(username, password) {
    const response = await fetch(API_URL+"/users",{
     
    method: "POST", 
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        username,
        password
    })
});
    if(!response.ok){
        throw new Error("cadastro invalido")
    }
    return await response.json()
  };

 export async function mostrarAnimes1(page = 1) {

  const response = await fetch(
    API_URL+`/anime?page=${page}`
  );
  if(!response.ok){
        throw new Error("Error")
    }
    const data = await response.json();
   
    return data.data;
}