
/* =====================================================
   SENAY FUTURE ACADEMY — SCRIPT
   Handles: mobile nav, dark mode (persisted), scroll reveal
   ===================================================== */
 
document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initActiveNav();
    initThemeToggle();
    initScrollReveal();
    initCourseFilter();
    initNotesFilter();
    initTestButtons();
    initContactForm();
});
 
/* -------------------- Mobile navigation -------------------- */
function initMobileNav() {
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");
 
    if (!menuToggle || !navbar) return;
 
    menuToggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });
 
    // Close the menu when a link is tapped
    navbar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navbar.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
 
    // Close the menu when clicking outside it
    document.addEventListener("click", (event) => {
        const clickedInside =
            navbar.contains(event.target) || menuToggle.contains(event.target);
 
        if (!clickedInside) {
            navbar.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }
    });
}
 
/* -------------------- Active nav link (auto-detected) -------------------- */
function initActiveNav() {
    const navLinks = document.querySelectorAll(".navbar a");
    if (!navLinks.length) return;
 
    // e.g. "/site/about.html" -> "about.html"; "" or "/" -> "index.html"
    let currentPage = window.location.pathname.split("/").pop().toLowerCase();
    if (currentPage === "") currentPage = "index.html";
 
    navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href").toLowerCase();
        link.classList.toggle("active", linkPage === currentPage);
    });
}
 
/* -------------------- Dark mode (persisted) -------------------- */
function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;
 
    const stored = localStorage.getItem("sfa-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const startDark = stored ? stored === "dark" : prefersDark;
 
    setTheme(startDark);
 
    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        setTheme(!isDark);
    });
 
    function setTheme(dark) {
        document.body.classList.toggle("dark-mode", dark);
        themeToggle.textContent = dark ? "☀️" : "🌙";
        localStorage.setItem("sfa-theme", dark ? "dark" : "light");
    }
}
 
/* -------------------- Course search + category filter -------------------- */
function initCourseFilter() {
    const searchInput = document.getElementById("notesSearch");
    const searchButton = document.getElementById("searchButton");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const courseCards = document.querySelectorAll(".course-grid .course-card");
    const noResults = document.getElementById("noCourses");
 
    // Only run on pages that actually have a course grid
    if (!courseCards.length) return;
 
    let activeCategory = "all";
 
    function applyFilter() {
        const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
        let visibleCount = 0;
 
        courseCards.forEach((card) => {
            const title = (card.dataset.title || "").toLowerCase();
            const category = card.dataset.category || "";
 
            const matchesCategory =
                activeCategory === "all" || category === activeCategory;
            const matchesSearch = query === "" || title.includes(query);
 
            const isVisible = matchesCategory && matchesSearch;
            card.style.display = isVisible ? "" : "none";
 
            if (isVisible) visibleCount += 1;
        });
 
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }
 
    // Category buttons
    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            categoryButtons.forEach((b) => b.classList.remove("active"));
            button.classList.add("active");
            activeCategory = button.dataset.category || "all";
            applyFilter();
        });
    });
 
    // Live search as the visitor types
    if (searchInput) {
        searchInput.addEventListener("input", applyFilter);
 
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                applyFilter();
            }
        });
    }
 
    // Explicit search button
    if (searchButton) {
        searchButton.addEventListener("click", applyFilter);
    }
}
/* -------------------- Contact form -------------------- */
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
 
    const formMessage = document.getElementById("formMessage");
    const submitButton = form.querySelector(".send-message");
 
    const rules = {
        fullName: {
            validate: (v) => v.trim().length > 1,
            message: "Please enter your full name.",
        },
        email: {
            validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            message: "Please enter a valid email address.",
        },
        message: {
            validate: (v) => v.trim().length > 4,
            message: "Please write a short message.",
        },
    };
 
    // Ensure every rule-checked field has an error slot under it
    Object.keys(rules).forEach((name) => {
        const field = form.elements[name];
        if (!field) return;
 
        const group = field.closest(".form-group");
        if (group && !group.querySelector(".field-error")) {
            const error = document.createElement("span");
            error.className = "field-error";
            error.textContent = rules[name].message;
            group.appendChild(error);
        }
    });
 
    function setFieldState(name, isValid) {
        const field = form.elements[name];
        if (!field) return;
 
        const group = field.closest(".form-group");
        if (!group) return;
 
        group.classList.toggle("has-error", !isValid);
    }
 
    function validateForm() {
        let isValid = true;
 
        Object.keys(rules).forEach((name) => {
            const field = form.elements[name];
            if (!field) return;
 
            const fieldValid = rules[name].validate(field.value);
            setFieldState(name, fieldValid);
            if (!fieldValid) isValid = false;
        });
 
        return isValid;
    }
 
    // Clear a field's error as soon as it becomes valid
    Object.keys(rules).forEach((name) => {
        const field = form.elements[name];
        if (!field) return;
 
        field.addEventListener("input", () => {
            if (rules[name].validate(field.value)) {
                setFieldState(name, true);
            }
        });
    });
 
    form.addEventListener("submit", (event) => {
        event.preventDefault();
 
        if (!validateForm()) {
            if (formMessage) {
                formMessage.textContent = "Please fix the highlighted fields.";
                formMessage.className = "form-message error";
            }
            return;
        }
 
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.querySelector("span").textContent = "Sending...";
        }
 
        // No backend is connected yet — simulate a send so the form
        // feels complete. Replace this block with a real fetch() call
        // once a form endpoint or email service is wired up.
        setTimeout(() => {
            if (formMessage) {
                formMessage.textContent =
                    "Thanks! Your message has been sent — we'll get back to you soon.";
                formMessage.className = "form-message success";
            }
 
            form.reset();
 
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.querySelector("span").textContent = "Send Message";
            }
        }, 800);
    });
}
 
/* -------------------- Toast notification (reusable) -------------------- */
function showToast(message, duration = 2600) {
    let toast = document.querySelector(".sfa-toast");
 
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "sfa-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }
 
    toast.textContent = message;
    // Restart the transition even if a toast is already visible
    requestAnimationFrame(() => toast.classList.add("is-visible"));
 
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove("is-visible");
    }, duration);
}
 
/* -------------------- Start Test buttons -------------------- */
function initTestButtons() {
    const testButtons = document.querySelectorAll(".start-test");
    if (!testButtons.length) return;
 
    testButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".test-card");
            const title = card?.querySelector("h3")?.textContent.trim() || "This test";
            showToast(`${title} is coming soon — check back shortly.`);
        });
    });
}
 
/* -------------------- Notes search filter -------------------- */
function initNotesFilter() {
    const searchInput = document.getElementById("notesSearch");
    const noteCards = document.querySelectorAll(".notes-grid .note-card");
    const noResults = document.getElementById("noNotes");
 
    // Only run on pages that actually have a notes grid
    if (!noteCards.length || !searchInput) return;
 
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;
 
        noteCards.forEach((card) => {
            const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const type = card.querySelector(".note-type")?.textContent.toLowerCase() || "";
            const isVisible = query === "" || title.includes(query) || type.includes(query);
 
            card.style.display = isVisible ? "" : "none";
            if (isVisible) visibleCount += 1;
        });
 
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    });
}
 
/* -------------------- Scroll reveal -------------------- */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        ".features, .featured-courses, .about-preview, .cta, " +
        ".about-main, .mission-section, .about-benefits, " +
        ".course-search, .categories-section, .courses-list, " +
        ".services-intro, .how-it-works, .notes-section, " +
        ".tests-section, .test-tips, .contact-section, .map-section"
    );
 
    if (!targets.length) return;
 
    targets.forEach((el) => el.classList.add("reveal"));
 
    if (!("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("is-visible"));
        return;
    }
 
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );
 
    targets.forEach((el) => observer.observe(el));
}
 