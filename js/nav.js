document.addEventListener('DOMContentLoaded', function() {
    // Active sidebar nav
    let elems = document.querySelector('.sidenav');
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status != 200) return;

                // muat dari tautan menu
                document.querySelectorAll('.topnav, .sidenav').forEach(elm => {
                    elm.innerHTML = xhr.responseText;
                })

                document.querySelectorAll('.sidenav a, .topnav a').forEach(elm => {
                    elm.addEventListener('click', (e) => {
                        // close the sidenav
                        let sidenav = document.querySelector('.sidenav');
                        M.Sidenav.getInstance(sidenav).close();

                        // load the body content when clicked
                        page = e.target.getAttribute('href').substr(1);
                        loadPage(page);
                    })
                })
            }
        }
        xhr.open('GET','nav.html', true);
        xhr.send();
    }
})

// load page content
let page = window.location.hash.substr(1);
if(page == "") page = 'home';
loadPage(page)

function loadPage(page) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == 4) {
            let content = document.querySelector('#body-content');
            if(this.status == 200) {
                content.innerHTML = xhr.responseText;
            }else if(this.status == 404) {
                content.innherHTML = '<p>Halaman tidak ditemukan,</p>'
            }else {
                content.innherHTMl = '<p>Ups.. halaman tidak dapat diakses</p>'
            }
        }
    }
    xhr.open('GET', `pages/${page}.html`,true);
    xhr.send();
}