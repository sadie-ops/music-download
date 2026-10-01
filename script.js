const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");

searchButton.addEventListener("click", searchMusic);

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchMusic();
    }
});

async function searchMusic() {

    const query = searchInput.value.trim();

    if (query === "") {
        results.innerHTML = `
            <p class="message">
                Please type a song or artist.
            </p>
        `;
        return;
    }

    results.innerHTML = `
        <p class="message">
            🔎 Searching...
        </p>
    `;

    try {

        const url =
            "https://itunes.apple.com/search?" +
            "term=" + encodeURIComponent(query) +
            "&media=music" +
            "&entity=song" +
            "&limit=20" +
            "&country=ph";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const data = await response.json();

        displayResults(data.results);

    } catch (error) {

        console.error(error);

        results.innerHTML = `
            <p class="message">
                ❌ Search failed. Check your internet connection.
            </p>
        `;
    }
}


/**
 * @param {Array} songs
 */
function displayResults(songs) {

    results.innerHTML = "";

    if (!songs || songs.length === 0) {

        results.innerHTML = `
            <p class="message">
                😕 No songs found.
            </p>
        `;

        return;
    }

    songs.forEach(function (song) {

        const card = document.createElement("div");

        card.className = "music-card";

        const title =
            song.trackName || "Unknown Song";

        const artist =
            song.artistName || "Unknown Artist";

        const album =
            song.collectionName || "";

        const artwork =
            song.artworkUrl100 || "";

        const preview =
            song.previewUrl || "";

        const songURL =
            song.trackViewUrl || "#";


        card.innerHTML = `

            <div class="music-info">

                <img
                    class="album-art"
                    src="${artwork}"
                    alt="Album artwork"
                >

                <div>

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <p>
                        ${escapeHTML(artist)}
                    </p>

                    <small>
                        ${escapeHTML(album)}
                    </small>

                </div>

            </div>


            ${
                preview
                ?
                `
                <audio
                    controls
                    preload="none"
                    src="${preview}">
                </audio>
                `
                :
                `
                <p class="no-preview">
                    No preview available.
                </p>
                `
            }


            <div class="buttons">

                ${
                    preview
                    ?
                    `
                    <button
                        class="preview-button"
                        onclick="playPreview(this)">
                        ▶ Preview
                    </button>
                    `
                    :
                    ""
                }


                <a
                    class="view-button"
                    href="${songURL}"
                    target="_blank"
                    rel="noopener">

                    🎵 View Song

                </a>

            </div>

        `;

        results.appendChild(card);
    });
}


/**
 * @param {HTMLElement} button
 */
function playPreview(button) {

    const card =
        button.closest(".music-card");

    const audio =
        card.querySelector("audio");

    if (!audio) {
        return;
    }

    if (audio.paused) {

        audio.play();

        button.textContent =
            "⏸ Pause";

    } else {

        audio.pause();

        button.textContent =
            "▶ Preview";
    }

    audio.onended = function () {

        button.textContent =
            "▶ Preview";

    };
}


/**
 * @param {string} text
 */
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}