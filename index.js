// script.js

// Project data
const projects = [
    {
        img: './assets/demo-2.gif',
        title: 'YouTube Video Summarizer',
        liveLink:
            'https://github.com/srvenu/youtube_video_to_notes/blob/main/demo.gif',
        codeLink: 'https://github.com/srvenu/youtube_video_to_notes',
    },
    {
        img: './assets/portfolio.png',
        title: 'Portfolio Using Tailwind CSS',
        liveLink: 'https://srvenu.github.io/SimpleWebsite/',
        codeLink: 'https://github.com/srvenu/Portfolio1',
    },
    {
        img: './assets/Game.gif',
        title: 'Simon Game',
        liveLink: 'https://srvenu.github.io/SimonGame/',
        codeLink: 'https://github.com/srvenu/SimonGame',
    },
    {
        img: './assets/simpleWebPage.gif',
        title: 'Tailwind Responsive Webpage',
        liveLink: 'https://srvenu.github.io/SimpleWebsite/',
        codeLink: 'https://github.com/srvenu/SimpleWebsite',
    },
];

// Load projects into the HTML
document.addEventListener('DOMContentLoaded', () => {
    const template = document.getElementById('project-card-template');
    const container = document.getElementById('project-grid');

    projects.forEach((project) => {
        const clone = template.content.cloneNode(true);

        // Update data
        clone.querySelector('img').src = project.img;
        clone.querySelector('img').alt = project.title;
        clone.querySelector('h3').textContent = project.title;
        clone.querySelectorAll('a')[0].href = project.liveLink;
        clone.querySelectorAll('a')[1].href = project.codeLink;

        container.appendChild(clone);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const html = document.documentElement;
    const aboutMeBtn = document.getElementById("aboutme-btn");
    const closeButton = document.getElementById("close-btn");
    const aboutMe = document.getElementById("about-me");
    const latestWorks = document.getElementById("latestwork-btn");
    const certificates = document.querySelectorAll(".item");

    let angle = 0;
    let isPaused = false;

    // ======== LOAD THEME ========
    const loadTheme = () => {
        const theme = localStorage.getItem("theme") || "light";
        html.classList.toggle("dark", theme === "dark");
        themeToggle.src = `assets/${theme === "dark" ? "sun_icon" : "moon"}.png`;
        themeToggle.classList.toggle("invert", theme !== "dark");
    };

    loadTheme();

    // ======== TOGGLE THEME ========
    themeToggle.addEventListener("click", () => {
        const isDark = html.classList.toggle("dark");
        themeToggle.src = `assets/${isDark ? "sun_icon" : "moon"}.png`;
        themeToggle.classList.toggle("invert", !isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // ======== ABOUT ME TOGGLE ========
    aboutMeBtn.addEventListener("click", () => {
        aboutMe.classList.replace("hidden", "flex");
    });

    closeButton.addEventListener("click", () => {
        aboutMe.classList.replace("flex", "hidden");
    });

    // ======== SCROLL TO LATEST WORKS ========
    latestWorks.addEventListener("click", () => {
        document.getElementById("target-section").scrollIntoView({ behavior: "smooth" });
    });

    // ======== DOWNLOAD RESUME ========
    document.getElementById("downloadBtn").addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = "./assets/Venu_Gopal_SR_Resume (updated_on_dec_2024).pdf";
        link.download = "Venu_Gopal_SR_Resume.pdf";
        link.click();
    });

    // ======== UPDATE CERTIFICATES POSITION ========
    const updateCertificates = () => {
        const distance =
            window.innerWidth <= 480
                ? 180
                : window.innerWidth <= 768
                    ? 280
                    : 400;

        certificates.forEach((cert, i) => {
            const position = (i + Math.floor(angle / (360 / certificates.length))) % certificates.length;
            cert.style.setProperty("--position", position + 1);
            cert.style.transform = `rotateY(${angle + i * (360 / certificates.length)
                }deg) translateZ(${distance}px)`;
        });
    };

    // ======== ROTATE CERTIFICATES ========
    const rotate = () => {
        if (!isPaused) {
            angle -= 0.2; // Adjust speed here
            updateCertificates();
        }
        requestAnimationFrame(rotate);
    };

    // ======== STOP ROTATION ON HOVER ========
    certificates.forEach((cert) => {
        cert.addEventListener("mouseenter", () => (isPaused = true));
        cert.addEventListener("mouseleave", () => (isPaused = false));
    });

    // ======== INITIALIZE ========
    updateCertificates();
    rotate();

    // ======== UPDATE ON RESIZE ========
    window.addEventListener("resize", updateCertificates);
});
