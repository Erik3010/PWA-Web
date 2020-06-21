let base_url = "https://readerapi.codepolitan.com/";

// kode yang akan dipanggil jika fetch berhasil
function status(response) {
    if(response.status !== 200) {
        console.log(`Error: ${response.status}`);
        // methods reject() akan membuat block catch terpaknggil
        return Promise.reject(new Error(response.statusText));
    }else{
        // mengubah suatu object menjadi suatu object agar bisa di-then kan
        return Promise.resolve(response);
    }
}

// function untuk memparsing JSON menjadi array javascript
function json(response) {
    return response.json();
}

// function untuk menhandle error di block catch
function error(err) {
    console.log(`Error: ${err}`);
}

// function untuk request JSON
function getArticles() {

    if('caches' in window) {
        caches.match(`${base_url}articles`).then(res => {
            if(res) {
                res.json().then(data => {
                    let articlesHTML = "";
                    data.result.forEach(article => {
                        articlesHTML += `
                            <div class="card">
                                <a href="./article.html?id=${article.id}">
                                    <div class="card-image waves-effect waves-block waves-light">
                                        <img src="${article.thumbnail}">
                                    </div>
                                </a>
                                <div class="card-content">
                                    <span class="card-title truncate">${article.title}</span>
                                    <p>${article.description}</p>
                                </div>
                            </div>
                        `
                    });
                    document.getElementById('articles').innerHTML = articlesHTML;
                })
            }
        })
    }

    fetch(`${base_url}articles`)
        .then(status)
        .then(json)
        .then(data => {
            // object/array Javascript  dari response.data() masuk lewat data
            let articlesHTML = "";
            data.result.forEach(article => {
                articlesHTML += `
                    <div class="card">
                        <a href="./article.html?id=${article.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${article.thumbnail}">
                            </div>
                        </a>
                        <div class="card-content">
                            <span class="card-title truncate">${article.title}</span>
                            <p>${article.description}</p>
                        </div>
                    </div>
                `
            });
            document.getElementById('articles').innerHTML = articlesHTML;
        })
        .catch(error)
}

function getArticleById() {
    // ambil nilai dari query ?id=
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    if("caches" in window) {
        caches.match(`${base_url}article/${idParam}`).then(res => {
            if(res) {
                res.json().then(data => {
                    let articleHTML = `
                        <div class="card">
                            <div class="card-image waves-effect waves-block waves-light">
                            <img src="${data.result.cover}" />
                            </div>
                            <div class="card-content">
                            <span class="card-title">${data.result.post_title}</span>
                            ${snarkdown(data.result.post_content)}
                            </div>
                        </div>
                    `;

                document.getElementById('body-content').innerHTML = articleHTML;
                    })
            }
        })
    }

    fetch(`${base_url}article/${idParam}`)
        .then(status)
        .then(json)
        .then(data => {
            console.log(data);

            let articleHTML = `
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.result.cover}" />
                    </div>
                    <div class="card-content">
                    <span class="card-title">${data.result.post_title}</span>
                    ${snarkdown(data.result.post_content)}
                    </div>
                </div>
            `;

            document.getElementById('body-content').innerHTML = articleHTML;
        })
}