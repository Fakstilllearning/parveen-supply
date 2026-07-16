// Satu sumber untuk semua tombol WhatsApp di halaman ini
const CONFIG = {
    whatsappNumber: "6285864175507",
    defaultMessage: "Halo Admin Parveen, saya tertarik dengan katalog supply Parveen Supply.",
};

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".js-wa-link").forEach(function (el) {
        const msg = el.dataset.msg && el.dataset.msg.length > 0 ? el.dataset.msg : CONFIG.defaultMessage;
        el.href = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
        el.target = "_blank";
        el.rel = "noopener noreferrer";
    });

    // Animasi scroll fade-up (dimatikan otomatis kalau user set "reduce motion")
    const fadeElements = document.querySelectorAll(".fade-up");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        fadeElements.forEach((el) => el.classList.add("visible"));
    } else {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
        );
        fadeElements.forEach((el) => observer.observe(el));
    }

    // Filter kategori di Katalog Produk
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const cat = btn.dataset.category;
            productCards.forEach((card) => {
                const show = cat === "semua" || card.dataset.category === cat;
                card.style.display = show ? "" : "none";
            });
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {

            // Tutup FAQ lain (opsional)
            faqItems.forEach((faq) => {
                if (faq !== item) {
                    faq.classList.remove("active");
                }
            });

            // Toggle FAQ yang diklik
            item.classList.toggle("active");
        });
    });

    // Menu mobile (hamburger) — buka/tutup daftar navigasi di layar kecil
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.classList.toggle("active", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Otomatis tutup menu begitu salah satu link diklik (mis. lompat ke #produk)
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                navToggle.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
});