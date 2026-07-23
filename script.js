// Satu sumber untuk semua tombol WhatsApp di halaman ini
    const CONFIG = {
        whatsappNumber: "6285864175507",
        defaultMessage: "Halo Admin Parveen, saya tertarik dengan katalog supply Parveen Supply.",
    };

    document.addEventListener("DOMContentLoaded", function () {

        document.querySelectorAll(".js-wa-link").forEach(function (el) {
        const msg = el.dataset.msg && el.dataset.msg.length > 0 ? el.dataset.msg : CONFIG.defaultMessage;
        // Ganti wa.me menjadi api.whatsapp.com
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
            
            // Gunakan String.fromCodePoint() dengan angka desimal
            // Cara ini 100% kebal terhadap masalah encoding file (tidak akan jadi tanda tanya)
            const emojisChar = [
                String.fromCodePoint(128545) + " (Sangat Buruk)", // 😡
                String.fromCodePoint(128577) + " (Buruk)",        // 🙁
                String.fromCodePoint(128528) + " (Biasa Saja)",   // 😐
                String.fromCodePoint(128522) + " (Puas)",         // 😊
                String.fromCodePoint(128525) + " (Sangat Puas)"   // 😍
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

                // Membentuk Pesan WhatsApp dengan Emoticon
                const emoText = emojisChar[selectedRating - 1];
                let message = "Halo Parveen, saya ingin memberikan masukan:\n\n";
                message += "Nama: " + name + "\n";
                if (business) {
                    message += "Bisnis: " + business + "\n";
                }
                message += "Rating: " + selectedRating + "/5 " + emoText + "\n";
                message += "Komentar: " + comment;

                // Mengarahkan ke WhatsApp (Ganti wa.me menjadi api.whatsapp.com)
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
