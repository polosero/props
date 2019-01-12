window.addEventListener('load', fetchProps);

window.unauthorizedHandler = redirectToLogin;


function fetchProps() {
    clearProps();
    XHR(
        'GET',
        '/props/'
    ).then(response => {
        clearProps();
        response.forEach(drawProp);
    })
     .catch(handleError.bind(null));
}

function addProp(form, event) {
    event.stopPropagation();
    event.preventDefault();
    const data = extract(form);
    XHR(
        'POST',
        '/props/',
        data
    ).then(handleResponse.bind(null, form))
     .catch(handleError.bind(null, form));
}

function updateProp(form, event) {
    event.stopPropagation();
    event.preventDefault();
    const data = extract(form);
    XHR(
        'PUT',
        `/props/${data.id}`,
        data
    ).then(handleResponse.bind(null, form))
     .catch(handleError.bind(null, form));
}

function deleteProp(form, propId) {
    XHR(
        'DELETE',
        `/props/${propId}`
    ).then(handleResponse.bind(null, form))
     .catch(handleError.bind(null, form));
}

function acquireLock() {
    return XHR(
        'PUT',
        '/props/lock'
    ).catch(handleError.bind(null));
}

function releaseLock() {
    return XHR(
        'DELETE',
        '/props/lock'
    ).catch(handleError.bind(null));
}



function openAddProp() {
    const form = document.getElementById('prop-form');
    form.reset();
    form.onsubmit = addProp.bind(null, form);
    form.hidden = false;
    form.querySelector('.delete').hidden = true;
}

function openEditProp(prop) {
    const form = document.getElementById('prop-form');
    form.reset();
    form.hidden = false;
    const delBtn = form.querySelector('.delete');
    delBtn.hidden = false;
    delBtn.onclick = deleteProp.bind(null, form, prop.id);
    setValues(form, prop);
    form.onsubmit = event => {
        event.stopPropagation();
        event.preventDefault();
        acquireLock()
            .then(updateProp.bind(null, form, event));
    };
}



function handleResponse(form, reponse) {
    fetchProps();
    if (form) {
        form.hidden = true;
        setError(form);
        form.reset();
    }
}

function handleError(form, error) {
    console.error(error);
    form && setError(form, error);
}



function hidePropForm() {
    document.getElementById('prop-form').hidden = true;
}



function clearProps() {
    document.getElementsByTagName('main')[0].innerHTML = '';
}
function drawProp(prop) {
    let template = document.getElementById('prop');
    let content = template.content.cloneNode(true);
    const q = content.querySelector.bind(content);
    q('.edit').addEventListener('click', openEditProp.bind(null, prop))
    q('h3').innerText = prop.name;
    q('.description').innerText = prop.description;
    q('.comment').innerText = prop.comment || '';
    document.getElementsByTagName('main')[0]
        .appendChild(content);
}
