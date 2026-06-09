function switchTab(tabId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active-section'));
    
    const activeSection = document.getElementById('section-' + tabId);
    if (activeSection) {
        activeSection.classList.add('active-section');
    }

    const borderLabel = document.getElementById('dynamic-label');
    if (tabId === 'home') borderLabel.innerText = "System-Root";
    if (tabId === 'projects') borderLabel.innerText = "Project-Library";
    if (tabId === 'contact') borderLabel.innerText = "Communication-Channels";

    const footerStatus = document.getElementById('status-bar-tab');
    const formattedName = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    footerStatus.innerText = `Status (System | Active_Tab: ${formattedName} | Mode: View)`;

    const menuItems = document.querySelectorAll('.sidebar ul li');
    menuItems.forEach(item => item.style.color = '');
    
    const selectedMenu = document.getElementById('menu-' + tabId);
    if (selectedMenu) {
        selectedMenu.style.color = '#ff9e64';
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const bootScreen = document.getElementById("boot-screen");
    const bootLog = document.getElementById("boot-log");
    const input = document.getElementById("terminal-input");
    
    let matrixEngine = null;
    const logLines = [
        { text: "MICASCAPE BIOS v2.0.67 RELEASE...", type: "normal" },
        { text: "CPU: AM386 SINGLE THREAD.. OK", type: "success" },
        { text: "MEMORY: 640KB SYSTEM RAM TEST... PASSED", type: "success" },
        { text: "DRIVE [0]: mounting /dev/sda1/micascape-web...", type: "normal" },
        { text: "NET: initializing opsec install...", type: "normal" },
        { text: "NET: connection to sys@micascape... ESTABLISHED", type: "success" },
        { text: "WARN: larping asset overflow detected in buffer.", type: "warn" },
        { text: "SYS: this javascript is killing me...", type: "warn" },
        { text: "SYS: beep boop i am a robot or something", type: "normal" },
        { text: "KHI: MEOW MEOW Meow :3", type: "success" },
        { text: "GRUB: Loading Linux kernel v6.8.0-generic...", type: "normal" },
        { text: "GRUB: Loading initial ramdisk...", type: "normal" },
        { text: "LINUX: Booting kernel from command line pipeline...", type: "normal" },
        { text: "KERNEL: ACPI: Core revision 20240101", type: "normal" },
        { text: "KERNEL: tsc: Fast TSC calibration failed", type: "warn" },
        { text: "KERNEL: iommu: Defaulting to passthrough mode", type: "normal" },
        { text: "KERNEL: EXT4-fs (sda1): mounted filesystem with ordered data mode.", type: "success" },
        { text: "INIT: version 2.96 booting...", type: "normal" },
        { text: "SYSTEMD: Welcome to Micascape GNU/Linux OS!", type: "success" },
        { text: "SYSTEMD: [ OK ] Started Journal Service.", type: "success" },
        { text: "SYSTEMD: [ OK ] Started Load Kernel Modules.", type: "success" },
        { text: "SYSTEMD: [ OK ] Mounted /sys/kernel/config.", type: "success" },
        { text: "SYSTEMD: [ OK ] Reached target Local File Systems.", type: "success" },
        { text: "SYSTEMD: [ OK ] Started Network Time Synchronization.", type: "success" },
        { text: "SYSTEMD: [ OK ] Reached target Multi-User System.", type: "success" },
        { text: "BOOT SUCCESSFUL. Launching System-Root shell...", type: "success" }
    ];

    let currentLine = 0;

    // Cascading fast log loop
    function printLine() {
        if (currentLine < logLines.length) {
            const lineData = logLines[currentLine];
            const p = document.createElement("div");
            p.className = "log-line";
            
            if (lineData.type === "success") p.classList.add("log-success");
            if (lineData.type === "warn") p.classList.add("log-warn");
            
            p.innerText = `▸ ${lineData.text}`;
            bootLog.appendChild(p);
            
            bootScreen.scrollTop = bootScreen.scrollHeight;
            currentLine++;
            
            let delay = Math.random() * 50 + 15; 
            if (lineData.text.includes("GRUB:") || lineData.text.includes("SYSTEMD:") || lineData.type === "warn") {
                delay += 60; 
            }
            setTimeout(printLine, delay);
        } else {
            setTimeout(() => {
                bootScreen.classList.add("fade-out");
                setTimeout(() => {
                    bootScreen.remove();
                    if (window.MatrixRain) {
                        matrixEngine = new window.MatrixRain("matrix-canvas");
                    }
                }, 500);
            }, 500);
        }
    }

    setTimeout(printLine, 200);
    switchTab('home');

    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            const fullInput = input.value.trim();
            input.value = "";
            
            if (!fullInput) return;

            const parts = fullInput.split(" ");
            const command = parts[0].toLowerCase();
            const args = parts.slice(1);
            
            if (command === "home" || command === "projects" || command === "contact") {
                switchTab(command);
                return;
            }
            
            if (command === "help") {
                alert("Available routines:\nNavigation: 'home', 'projects', 'contact'\nModular binaries: 'neofetch', 'matrix'");
                return;
            }

           
            if (command === "matrix" && matrixEngine && !matrixEngine.execute) {
                if (matrixEngine.isActive()) {
                    matrixEngine.stop();
                } else {
                    matrixEngine.init();
                }
                return;
            }

            try {
                const module = await import(`./${command}.js`);
                
                if (typeof module.execute === "function") {
                    module.execute(args, matrixEngine);
                }
            } catch (err) {
                console.warn(`Dynamic routine lookup failed for: js/${command}.js`, err);
                alert(`micascape-shell: ${command}: command binary file not found`);
            }
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && matrixEngine) {
            if (typeof matrixEngine.stop === "function" && matrixEngine.isActive()) {
                matrixEngine.stop();
            }
        }
    });
});