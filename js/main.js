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
            
            let delay = Math.random() * 60 + 20; 
            if (lineData.text.includes("GRUB:") || lineData.text.includes("SYSTEMD:") || lineData.type === "warn") {
                delay += 80; 
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

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const command = input.value.trim().toLowerCase();
            input.value = "";
            
            if (command === "matrix" && matrixEngine) {
                if (matrixEngine.isActive()) {
                    matrixEngine.stop();
                } else {
                    matrixEngine.init();
                }
            } else if (command === "help") {
                alert("hints of easter eggs maybe left throughout the site! use 'matrix' as an example :P");
            } else if (command === "clear" && matrixEngine) {
                matrixEngine.stop();
            } else if (command === "home" || command === "contact") {
                switchTab(command);
            }
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && matrixEngine && matrixEngine.isActive()) {
            matrixEngine.stop();
        }
    });
});