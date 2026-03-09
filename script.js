let reels = [];
let currentPage = 1;
let perPage = 6;

window.addEventListener("load", async () => {
    const res = await fetch("data.json");
    reels = await res.json();

    renderPage(currentPage);
    renderPagination();
});

function renderPage(page) {

    const container = document.getElementById("reelsContainer");

    container.innerHTML = "";

    let start = (page - 1) * perPage;
    let end = start + perPage;

    const pageData = reels.slice(start, end);

    pageData.forEach(item => {

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${item.title}</h3>
            <div class="lazy-video"
                 data-url="${item.url}">
                 Loading video...
            </div>
        `;

        container.appendChild(div);
    });

    lazyLoadVideos();
    
}

function renderPagination() {

    const totalPages = Math.ceil(reels.length / perPage);
    const pagination = document.getElementById("pagination");

    let html = "";

    if(currentPage > 1){
        html += `<button onclick="goPage(${currentPage-1})">Prev</button>`;
    }

    html += `<span> Page ${currentPage} / ${totalPages} </span>`;

    if(currentPage < totalPages){
        html += `<button onclick="goPage(${currentPage+1})">Next</button>`;
    }

    pagination.innerHTML = html;
}

function goPage(page) {

    currentPage = page;

    renderPage(page);
    renderPagination();

}

function lazyLoadVideos() {

    const videos = document.querySelectorAll(".lazy-video");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const el = entry.target;

                const url = el.dataset.url;

                el.innerHTML = `
                    <div class="fb-video"
                         data-href="${url}"
                         data-width="320"
                         data-show-text="false">
                    </div>
                `;

                if (window.FB) {
                    FB.XFBML.parse(el);
                }

                observer.unobserve(el);

            }

        });

    }, {
        rootMargin: "200px"
    });

    videos.forEach(v => observer.observe(v));
}