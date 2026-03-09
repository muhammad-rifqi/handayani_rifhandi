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

    for (let i = 1; i <= totalPages; i++) {

        let active = (i === currentPage) ? "active" : "";

        html += `
            <button class="${active}" onclick="goPage(${i})">
                ${i}
            </button>
        `;
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
                         data-width="320">
                    </div>
                `;

                if (typeof FB !== "undefined") {
                    FB.XFBML.parse(el);
                }

                observer.unobserve(el);

            }

        });

    });

    videos.forEach(v => observer.observe(v));
}