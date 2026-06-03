// ==========================================
// LOGIKA UNTUK PORTAL (LANDING PAGE)
// ==========================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

const navLinks = document.querySelectorAll('.nav-links');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(navMenu) navMenu.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-in').forEach(el => observer.observe(el));


// ==========================================
// LOGIKA UNTUK RUANG BELAJAR (LMS)
// ==========================================

// Daftar Urutan BAB
const babList = ['bab-intro', 'bab-1', 'bab-2', 'bab-3', 'bab-4', 'bab-5'];
let currentBabIndex = 0;

// Fungsi Menampilkan/Menyembunyikan Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('lmsSidebar');
    if(sidebar) {
        // Jika sedang hidden (desktop mode awal) atau tidak ada class open
        if (sidebar.classList.contains('hidden')) {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('open');
        } else {
            sidebar.classList.toggle('open');
            // Untuk layar besar jika mau disembunyikan total
            if(window.innerWidth > 768) {
                sidebar.classList.toggle('hidden');
            }
        }
    }
}

// Fungsi Berpindah BAB
function showBab(babId) {
    // Sembunyikan semua Bab
    document.querySelectorAll('.content-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
    });
    
    // Nonaktifkan semua menu sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    // Tampilkan Bab Target
    const targetBab = document.getElementById(babId);
    if(targetBab) targetBab.classList.add('active');
    
    // Aktifkan menu sidebar yang dipilih
    const activeSidebar = document.querySelector(`.sidebar-item[onclick="showBab('${babId}')"]`);
    if(activeSidebar) activeSidebar.classList.add('active');

    // Reset Subbab ke yang pertama di bab tersebut
    const firstSubBtn = targetBab.querySelector('.subbab-btn');
    if(firstSubBtn) {
        firstSubBtn.click(); // Otomatis klik subbab pertama
    }

    // Update current index untuk tombol prev/next
    currentBabIndex = babList.indexOf(babId);

    // Otomatis tutup sidebar di HP setelah memilih
    if(window.innerWidth <= 768) {
        document.getElementById('lmsSidebar').classList.remove('open');
    }

    // Scroll ke atas
    const contentArea = document.querySelector('.lms-content-area');
    if(contentArea) contentArea.scrollTo({top: 0, behavior: 'smooth'});
}

// Fungsi Berpindah SUBBAB dalam 1 BAB
function showSubbab(subId, btnElement) {
    // Cari container Bab dari tombol yang diklik
    const babContainer = btnElement.closest('.content-wrapper');
    
    // Sembunyikan semua sub-content di dalam bab ini
    babContainer.querySelectorAll('.sub-content').forEach(sub => {
        sub.classList.remove('active');
    });

    // Hapus class active dari semua tombol subbab di dalam bab ini
    babContainer.querySelectorAll('.subbab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Tampilkan sub-content target dan aktifkan tombolnya
    document.getElementById(subId).classList.add('active');
    btnElement.classList.add('active');
}

// Fungsi Navigasi Bawah (Sebelumnya / Selanjutnya)
function prevBab() {
    if (currentBabIndex > 0) {
        showBab(babList[currentBabIndex - 1]);
    }
}

function nextBab() {
    if (currentBabIndex < babList.length - 1) {
        showBab(babList[currentBabIndex + 1]);
    } else {
        alert("Hore! Kamu sudah menyelesaikan semua materi! 🎉");
    }
}

// Inisialisasi tampilan awal LMS (Mobile sidebar hidden by default)
window.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('lmsSidebar');
    if(sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('hidden'); // Pakai sistem translate open/close di mobile
    }
});
