import { cadastro, login, paginaPrincipal,} from './ui.js';


function router() {
    const path = window.location.hash;
    
    if (path === '#login') {
        login();
    }
    else if (path === '#dashboard') {
        paginaPrincipal();
    }
    else if(path === '#cadastro'){
        cadastro();
    }
    else {
        paginaPrincipal();
    }

}

router();

window.addEventListener('hashchange', router);

