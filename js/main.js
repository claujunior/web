import { outrapagina, renderHome } from './ui.js';


function router() {
    const path = window.location.hash;
    
    if (path === '#login') {
        renderHome();
    }
    else if (path === '#dashboard') {
        outrapagina();
    }

}

router();

window.addEventListener('hashchange', router);

