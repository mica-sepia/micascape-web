// js/neofetch.js

export function execute(args, matrixEngine) {
    const outputArea = document.getElementById("terminal-output-area");
    if (!outputArea) return;

    const existingBox = document.getElementById("neofetch-display");
    if (existingBox) {
        existingBox.remove();
        return;
    }

    const fetchBox = document.createElement("pre");
    fetchBox.id = "neofetch-display";
    fetchBox.style.cssText = "font-family: 'Courier New', monospace; color: #bb9af3; background: #24283b; padding: 15px; border-radius: 4px; border: 1px dashed #414868; white-space: pre; margin-bottom: 20px; line-height: 1.3;";
    outputArea.appendChild(fetchBox);

    const lines = [
        "   /\\_/\\      mica@micascape",
        "  ( o.o )     --------------",
        "   > ^ <      OS: Micascape GNU/Linux x86_64",
        "  /     \\     Host: syskit",
        "              Kernel: 6.8.0-generic",
        "              Uptime: 4 mins",
        "              Pronouns: she/her",
        "              Identity: meow meow",
        "              Location: Scotland 🏴\u200d\u200d󠁧󠁢󠁳󠁣󠁴󠁿",
        "              Shell: zsh 5.8",
        "              WM: larprland"
    ];

    let currentLine = 0;

    function streamText() {
        if (currentLine < lines.length) {

            fetchBox.textContent += lines[currentLine] + "\n";
            currentLine++;
            
            setTimeout(streamText, 25);
        }
    }

    streamText();
}