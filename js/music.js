let currentPage = 1;
const totalPages = 4;
let cachedRecentTracks = null;
let cachedTopTracks = null; 
let cachedTopAlbums = null;
let cachedTopArtists = null;

const placeholderArt = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%231a1b26%22/><text y=%22.9em%22 font-size=%2260%22 x=%2215%22>💽</text></svg>";

export async function execute(args, matrixEngine) {
    const outputArea = document.getElementById("terminal-output-area");
    if (!outputArea) return;

    const existingBox = document.getElementById("music-display");
    if (existingBox) {
        existingBox.remove();
        return;
    }

    const USERNAME = "maad_kalzu"; 
    const k1 = "8fddf5";
    const k2 = "7a50b8536388ceaa227e49ca06";
    const API_KEY = k1 + k2; 

    const musicBox = document.createElement("div");
    musicBox.id = "music-display";
    musicBox.style.cssText = "display: flex; gap: 20px; font-family: 'Courier New', monospace; background: #24283b; padding: 15px; border-radius: 4px; border: 1px dashed #414868; margin-bottom: 20px; align-items: flex-start; max-width: 100%; overflow-x: auto; position: relative;";
    outputArea.appendChild(musicBox);

    const artContainer = document.createElement("div");
    artContainer.style.cssText = "flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 8px;";
    
    const albumImg = document.createElement("img");
    albumImg.id = "music-album-art";
    albumImg.style.cssText = "width: 120px; height: 120px; border-radius: 4px; border: 2px solid #414868; background: #1a1b26; object-fit: cover; filter: brightness(0.9); transition: src 0.2s ease-in-out;";
    albumImg.src = placeholderArt;
    
    artContainer.appendChild(albumImg);
    musicBox.appendChild(artContainer);

    const textPre = document.createElement("pre");
    textPre.id = "music-terminal-text";
    textPre.style.cssText = "margin: 0; padding-bottom: 25px; font-family: inherit; color: #7aa2f7; white-space: pre; line-height: 1.4; flex-grow: 1;";
    textPre.textContent = "▸ Authenticating Last.fm network tokens...\n▸ Syncing radio core matrices...\n\n";
    musicBox.appendChild(textPre);

    const controls = document.createElement("div");
    controls.style.cssText = "position: absolute; bottom: 10px; right: 15px; display: flex; gap: 12px; font-size: 14px; user-select: none;";
    
    const prevBtn = document.createElement("span");
    prevBtn.innerText = "<";
    prevBtn.style.cssText = "cursor: pointer; color: #565f89; transition: color 0.2s;";
    
    const pageNum = document.createElement("span");
    pageNum.id = "music-page-indicator";
    pageNum.style.cssText = "color: #565f89; pointer-events: none;";
    
    const nextBtn = document.createElement("span");
    nextBtn.innerText = ">";
    nextBtn.style.cssText = "cursor: pointer; color: #a9b1d6; transition: color 0.2s;";
    
    controls.appendChild(prevBtn);
    controls.appendChild(pageNum);
    controls.appendChild(nextBtn);
    musicBox.appendChild(controls);

    prevBtn.onmouseenter = () => prevBtn.style.color = "#7aa2f7";
    prevBtn.onmouseleave = () => prevBtn.style.color = currentPage === 1 ? "#343b58" : "#a9b1d6";
    nextBtn.onmouseenter = () => nextBtn.style.color = "#7aa2f7";
    nextBtn.onmouseleave = () => nextBtn.style.color = currentPage === totalPages ? "#343b58" : "#a9b1d6";

    function getValidArtUrl(obj) {
        if (obj && obj.image && Array.isArray(obj.image) && obj.image.length > 2) {
            const url = obj.image[2]["#text"] || obj.image[1]["#text"];
            if (url && url.trim() !== "") return url;
        }
        return null;
    }

    function updateArtworkForPage(pageNumber) {
        let url = null;

        if (pageNumber === 1 && cachedRecentTracks && cachedRecentTracks[0]) {
            url = getValidArtUrl(cachedRecentTracks[0]);
        } 
        else if (pageNumber === 3 && cachedTopAlbums && cachedTopAlbums[0]) {
            url = getValidArtUrl(cachedTopAlbums[0]);
        }

        if (!url && cachedTopAlbums && cachedTopAlbums[0]) {
            url = getValidArtUrl(cachedTopAlbums[0]);
        }
        if (!url && cachedRecentTracks && cachedRecentTracks[0]) {
            url = getValidArtUrl(cachedRecentTracks[0]);
        }

        albumImg.src = url || placeholderArt;
    }

    function renderPage(pageNumber) {
        textPre.textContent = "";
        pageNum.innerText = `${pageNumber}/${totalPages}`;
        
        prevBtn.style.color = pageNumber === 1 ? "#343b58" : "#a9b1d6";
        nextBtn.style.color = pageNumber === totalPages ? "#343b58" : "#a9b1d6";

        let lines = [];

        if (pageNumber === 1) {
            lines = [
                "   [ currently playing ]   ",
                "   ───────────────────────   "
            ];
            if (cachedRecentTracks && cachedRecentTracks.length > 0) {
                const active = cachedRecentTracks[0];
                const isPlaying = active["@attr"] && active["@attr"].nowplaying === "true";
                
                lines.push(`   TRACK  ▸ ${active.name}`);
                lines.push(`   ARTIST ▸ ${active.artist["#text"] || active.artist.name}`);
                lines.push(`   ALBUM  ▸ ${active.album["#text"] || "Single Asset"}`);
                lines.push(`   STATUS ▸ ${isPlaying ? "[███████████████] LIVE" : "[░░░░░░░░░░░░░░░] IDLE (LAST PLAYED)"}`);
            } else {
                lines.push("   System log stream returned empty channel set.");
            }
        } 
        else if (pageNumber === 2) {
            lines = [
                "   [ all time tracks ]   ",
                "   ─────────────────────────   "
            ];
            if (cachedTopTracks && cachedTopTracks.length > 0) {
                const topTrack = cachedTopTracks[0];
                lines.push(`   OUR #1 ASSAY RECORD:`);
                lines.push(`   TRACK  ▸ ${topTrack.name}`);
                lines.push(`   ARTIST ▸ ${topTrack.artist.name}`);
                lines.push(`   PLAYS  ▸ ${topTrack.playcount} total scrobbling loops`);
            } else {
                lines.push("   No top track assets loaded.");
            }
        } 
        else if (pageNumber === 3) {
            lines = [
                "   [ top albums ]   ",
                "   ──────────────────────────   "
            ];
            if (cachedTopAlbums && cachedTopAlbums.length > 0) {
                const topAlbum = cachedTopAlbums[0];
                lines.push(`   HEAVIEST ROTATION ALBUM:`);
                lines.push(`   TITLE  ▸ ${topAlbum.name}`);
                lines.push(`   ARTIST ▸ ${topAlbum.artist.name}`);
                lines.push(`   COUNT  ▸ ${topAlbum.playcount} full system spins`);
            } else {
                lines.push("   No top album assets loaded.");
            }
        } 
        else if (pageNumber === 4) {
            lines = [
                "   [ top artists ]   ",
                "   ───────────────────────────   "
            ];
            if (cachedTopArtists && cachedTopArtists.length > 0) {
                const topArtist = cachedTopArtists[0];
                lines.push(`   COMMANDING ARTIST PROFILE:`);
                lines.push(`   NAME   ▸ ${topArtist.name}`);
                lines.push(`   METRIC ▸ ${topArtist.playcount} distinct audio logs`);
            } else {
                lines.push("   No top artist assets loaded.");
            }
        }

        lines.push("   ───────────────────────   ");
        updateArtworkForPage(pageNumber);

        let currentLine = 0;
        function streamLines() {
            if (currentLine < lines.length) {
                textPre.textContent += lines[currentLine] + "\n";
                currentLine++;
                setTimeout(streamLines, 12);
            }
        }
        streamLines();
    }

    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPage(currentPage); } };
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderPage(currentPage); } };

    try {
        const root = "https://ws.audioscrobbler.com/2.0/?format=json";
        
        const [resTracks, resTopTracks, resAlbums, resArtists] = await Promise.all([
            fetch(`${root}&method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&limit=5`),
            fetch(`${root}&method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&limit=5`),
            fetch(`${root}&method=user.gettopalbums&user=${USERNAME}&api_key=${API_KEY}&limit=5`),
            fetch(`${root}&method=user.gettopartists&user=${USERNAME}&api_key=${API_KEY}&limit=5`)
        ]);

        if (!resTracks.ok || !resTopTracks.ok || !resAlbums.ok || !resArtists.ok) throw new Error("API Denied Handshake");

        const [dataTracks, dataTopTracks, dataAlbums, dataArtists] = await Promise.all([
            resTracks.json(), resTopTracks.json(), resAlbums.json(), resArtists.json()
        ]);

        cachedRecentTracks = dataTracks.recenttracks.track;
        cachedTopTracks = dataTopTracks.toptracks.track; 
        cachedTopAlbums = dataAlbums.topalbums.album;
        cachedTopArtists = dataArtists.topartists.artist;

        renderPage(currentPage);

    } catch (err) {
        console.error("Pipeline failure: ", err);
        textPre.textContent = "✖ Error: Live audio dashboard kernel payload failed to deploy.\nConnection refused by Last.fm core gateway module.";
    }
}