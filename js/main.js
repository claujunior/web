import { loginPage } from './pages/login.js';
import { paginaPrincipal } from './pages/dashboard.js';
import { cadastro } from './pages/cadastro.js';

function router() {
    const path = window.location.hash;

    if (path === '#login') {
        loginPage();
    } else if (path === '#dashboard') {
        paginaPrincipal();
    } else if (path === '#cadastro') {
        cadastro();
    } else {
        paginaPrincipal();
    }
}

router();

window.addEventListener('hashchange', router);

