import { URL } from './URL.js';

const api = URL + '/account/info';

async function getUser() {
    return await $.get(api)
        .done(function(data) {

        })
        .fail(function() {
            console.log('Error');
        })
}

export default getUser;