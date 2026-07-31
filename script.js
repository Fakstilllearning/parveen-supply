// Satu sumber untuk semua tombol WhatsApp di halaman ini
    const CONFIG = {
        whatsappNumber: "6285864175507",
        defaultMessage: "Halo Admin Parveen, saya tertarik dengan katalog supply Parveen Supply.",
    };

    document.addEventListener("DOMContentLoaded", function () {

        document.querySelectorAll(".js-wa-link").forEach(function (el) {
        const msg = el.dataset.msg && el.dataset.msg.length > 0 ? el.dataset.msg : CONFIG.defaultMessage;
        el.href = "https://api.whatsapp.com/send?phone=" + CONFIG.whatsappNumber + "&text=" + encodeURIComponent(msg);
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

        // Filter kategori di Katalog Produk (+ batas tampil 6 & tombol toggle Selengkapnya/Lebih Sedikit)
        const filterButtons = document.querySelectorAll(".filter-btn");
        const productCards = document.querySelectorAll(".product-card");
        const productMoreBtn = document.getElementById("productMoreBtn");
        const PRODUCT_VISIBLE_LIMIT = 8;
        let activeCategory = "semua";
        let isExpanded = false;

        function applyProductFilter() {
            const matches = Array.from(productCards).filter(
                (card) => activeCategory === "semua" || card.dataset.category === activeCategory
            );
            const hasOverflow = matches.length > PRODUCT_VISIBLE_LIMIT;

            productCards.forEach((card) => { card.style.display = "none"; });
            const toShow = isExpanded ? matches : matches.slice(0, PRODUCT_VISIBLE_LIMIT);
            toShow.forEach((card) => { card.style.display = ""; });

            if (productMoreBtn) {
                productMoreBtn.style.display = hasOverflow ? "inline-flex" : "none";
                productMoreBtn.textContent = isExpanded ? "Tampilkan Lebih Sedikit" : "Lihat Produk Selengkapnya";
            }
        }

        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                activeCategory = btn.dataset.category;
                isExpanded = false;
                applyProductFilter();
            });
        });

        if (productMoreBtn) {
            productMoreBtn.addEventListener("click", () => {
                isExpanded = !isExpanded;
                applyProductFilter();
                if (!isExpanded) {
                    productMoreBtn.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        }

        applyProductFilter();

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

        // Scroll progress bar di bagian paling atas halaman
        const scrollProgress = document.getElementById("scrollProgress");
        if (scrollProgress) {
            const updateScrollProgress = () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
                scrollProgress.style.transform = "scaleX(" + pct + ")";
            };
            window.addEventListener("scroll", updateScrollProgress, { passive: true });
            window.addEventListener("resize", updateScrollProgress);
            updateScrollProgress();
        }

        // Tombol back-to-top — muncul setelah scroll ke bawah, klik untuk kembali ke atas
        const backToTop = document.getElementById("backToTop");
        if (backToTop) {
            const toggleBackToTop = () => {
                backToTop.classList.toggle("visible", window.scrollY > 600);
            };
            window.addEventListener("scroll", toggleBackToTop, { passive: true });
            toggleBackToTop();
            backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
            });
        }

        // Animasi hitung naik untuk angka statistik (Products & Services, Years of Experience, dst)
        const statNumbers = document.querySelectorAll(".stat-number");
        if (statNumbers.length) {
            const animateStat = (el) => {
                const target = parseInt(el.dataset.target, 10) || 0;
                if (prefersReducedMotion) {
                    el.textContent = target;
                    return;
                }
                const duration = 1400;
                const startTime = performance.now();
                const step = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = target;
                    }
                };
                requestAnimationFrame(step);
            };

            const statObserver = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateStat(entry.target);
                            obs.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );
            statNumbers.forEach((el) => statObserver.observe(el));
        }

        // Form Feedback / Testimoni Pelanggan — sistem emoticon + kirim via WhatsApp
        const feedbackForm = document.getElementById("feedbackForm");
        
        if (feedbackForm) {
            const emoBtns = feedbackForm.querySelectorAll(".emo-btn");
            const feedbackNote = document.getElementById("feedbackNote");
            let selectedRating = 0;
            
            const ratingLabels = [
                "Sangat Buruk",
                "Buruk",
                "Biasa Saja",
                "Puas",
                "Sangat Puas"
            ];

            // Event listener untuk tombol emoticon
            emoBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    selectedRating = parseInt(btn.dataset.value, 10);
                    // Hapus status aktif dari semua tombol
                    emoBtns.forEach(b => b.classList.remove("active"));
                    // Tambahkan status aktif hanya pada yang diklik
                    btn.classList.add("active");
                });
            });

            // Event saat form disubmit
            feedbackForm.addEventListener("submit", (e) => {
                e.preventDefault();

                // Ambil nilai input dari form
                const name = document.getElementById("fbName").value.trim();
                const business = document.getElementById("fbBusiness").value.trim();
                const comment = document.getElementById("fbComment").value.trim();

                // Validasi input
                if (selectedRating === 0 || !name || !comment) {
                    if (feedbackNote) {
                        feedbackNote.textContent = "Mohon isi nama, pilih emoticon rating, dan tulis komentar terlebih dahulu.";
                        feedbackNote.classList.add("feedback-note-error");
                        // Tambahkan style warna merah untuk error (opsional jika class belum ada)
                        feedbackNote.style.color = "red"; 
                    }
                    return;
                }

                // Membentuk Pesan WhatsApp
                const ratingLabel = ratingLabels[selectedRating - 1];
                let message = "Halo Parveen, saya ingin memberikan masukan:\n\n";
                message += "Nama: " + name + "\n";
                if (business) {
                    message += "Bisnis: " + business + "\n";
                }
                message += "Rating: " + selectedRating + "/5 (" + ratingLabel + ")\n";
                message += "Komentar: " + comment;

                fetch(FEEDBACK_SHEET_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({ name, business, rating: selectedRating, comment }),
                }).catch(() => {});

                // Mengarahkan ke WhatsApp
                window.open(
                    "https://api.whatsapp.com/send?phone=" + CONFIG.whatsappNumber + "&text=" + encodeURIComponent(message),
                    "_blank",
                    "noopener,noreferrer"
                );

                // Membersihkan Form setelah disubmit
                if (feedbackNote) {
                    feedbackNote.classList.remove("feedback-note-error");
                    feedbackNote.style.color = "green"; // Warna hijau untuk sukses
                    feedbackNote.textContent = "Terima kasih! Kami arahkan Anda ke WhatsApp untuk mengirim masukan ini.";
                }

                // Reset form dan emoticon
                feedbackForm.reset();
                emoBtns.forEach(b => b.classList.remove("active"));
                selectedRating = 0;
            });
        }
    });

// Customer Feedback dari Google Sheets (live + Lihat Lainnya)
const FEEDBACK_SHEET_URL = "https://script.google.com/macros/s/AKfycbwaJSAq9u_MxLT__J7TWyJBS32QtesrZ1soc5ggN4brtbbB9TTYuWUwCkJtSHErnaxA9Q/exec";
const FEEDBACK_BATCH_SIZE = 8;

let feedbackData = [];
let feedbackShown = FEEDBACK_BATCH_SIZE;

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

function renderFeedbackSummary(data) {
    const summaryEl = document.getElementById("feedbackSummary");
    if (!summaryEl) return;
    const total = data.length;
    const suka = data.filter((f) => f.rating >= 4).length;
    const tidakSuka = data.filter((f) => f.rating <= 2).length;
    const netral = total - suka - tidakSuka;
    const pct = (n) => (total ? (n / total) * 100 : 0);
    const persenSuka = total ? Math.round((suka / total) * 100) : 0;

    summaryEl.innerHTML =
        '<div class="feedback-stats">' +
            '<div class="feedback-stat feedback-stat-like"><span class="feedback-stat-emoji">😊</span><span class="feedback-stat-number">' + suka + '</span><span class="feedback-stat-label">Pelanggan Suka</span></div>' +
            '<div class="feedback-stat feedback-stat-dislike"><span class="feedback-stat-emoji">🙁</span><span class="feedback-stat-number">' + tidakSuka + '</span><span class="feedback-stat-label">Tidak Suka</span></div>' +
            '<div class="feedback-stat feedback-stat-total"><span class="feedback-stat-emoji">⭐</span><span class="feedback-stat-number">' + total + '</span><span class="feedback-stat-label">Total Ulasan</span></div>' +
        '</div>' +
        '<div class="feedback-ratio-bar" role="img" aria-label="' + persenSuka + '% pelanggan menyukai produk kami">' +
            '<span class="ratio-segment ratio-like" style="width:' + pct(suka) + '%"></span>' +
            '<span class="ratio-segment ratio-neutral" style="width:' + pct(netral) + '%"></span>' +
            '<span class="ratio-segment ratio-dislike" style="width:' + pct(tidakSuka) + '%"></span>' +
        '</div>' +
        '<p class="feedback-ratio-caption"><strong>' + persenSuka + '%</strong> pelanggan menyukai produk &amp; layanan kami</p>';
}

function renderFeedbackList() {
    const listEl = document.getElementById("feedbackList");
    const moreBtn = document.getElementById("feedbackMoreBtn");
    if (!listEl) return;

    const EMOJI = { 1: "😡", 2: "🙁", 3: "😐", 4: "😊", 5: "😍" };
    const alreadyShown = listEl.children.length;
    const nextBatch = feedbackData.slice(alreadyShown, feedbackShown);

    const cardsHtml = nextBatch.map(function (f) {
        const sentiment = f.rating >= 4 ? "like" : f.rating <= 2 ? "dislike" : "neutral";
        const stars = "★".repeat(f.rating) + "☆".repeat(5 - f.rating);
        const author = escapeHtml(f.name) + (f.business ? " — " + escapeHtml(f.business) : "");
        return (
            '<div class="feedback-review-card sentiment-' + sentiment + ' fade-up">' +
                '<div class="feedback-review-top">' +
                    '<span class="feedback-review-stars" aria-hidden="true">' + stars + '</span>' +
                    '<span class="feedback-review-emoji" aria-hidden="true">' + EMOJI[f.rating] + '</span>' +
                '</div>' +
                '<p class="feedback-review-comment">&ldquo;' + escapeHtml(f.comment) + '&rdquo;</p>' +
                '<p class="feedback-review-author">' + author + '</p>' +
            '</div>'
        );
    }).join("");

    listEl.insertAdjacentHTML("beforeend", cardsHtml);

    // Fade-up hanya untuk kartu yang baru ditambahkan (bukan yang sudah
    // tampil dari klik "Lihat Feedback Lainnya" sebelumnya)
    const newFadeEls = Array.from(listEl.children).slice(alreadyShown);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
        newFadeEls.forEach((el) => el.classList.add("visible"));
    } else {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("visible");
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
        );
        newFadeEls.forEach((el) => obs.observe(el));
    }

    if (moreBtn) {
        moreBtn.style.display = feedbackShown < feedbackData.length ? "inline-flex" : "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const summaryEl = document.getElementById("feedbackSummary");
    const listEl = document.getElementById("feedbackList");
    if (!summaryEl || !listEl) return;

    fetch(FEEDBACK_SHEET_URL)
        .then((res) => res.json())
        .then((data) => {
            feedbackData = Array.isArray(data) ? data : [];
            renderFeedbackSummary(feedbackData);
            renderFeedbackList();
        })
        .catch(() => {
            // Kalau URL belum di-setup / gagal fetch, sembunyikan seksi ini
            // saja daripada tampil kosong/rusak
            const wrapper = document.querySelector(".feedback-showcase-wrapper");
            if (wrapper) wrapper.style.display = "none";
        });

    const moreBtn = document.getElementById("feedbackMoreBtn");
    if (moreBtn) {
        moreBtn.addEventListener("click", function () {
            feedbackShown += FEEDBACK_BATCH_SIZE;
            renderFeedbackList();
        });
    }
});
