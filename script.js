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

// Menampilkan/Menyembunyikan Sidebar (Desktop & Mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('lmsSidebar');
    if(sidebar) {
        if (sidebar.classList.contains('hidden')) {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('open');
        } else {
            sidebar.classList.toggle('open');
            if(window.innerWidth > 768) {
                sidebar.classList.toggle('hidden');
            }
        }
    }
}

// Berpindah BAB
function showBab(babId) {
    document.querySelectorAll('.content-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
    });
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    const targetBab = document.getElementById(babId);
    if(targetBab) targetBab.classList.add('active');
    
    const activeSidebar = document.querySelector(`.sidebar-item[onclick="showBab('${babId}')"]`);
    if(activeSidebar) activeSidebar.classList.add('active');

    // Otomatis pilih tab pertama dari BAB yang diklik
    const firstSubBtn = targetBab.querySelector('.subbab-btn');
    if(firstSubBtn) firstSubBtn.click();

    currentBabIndex = babList.indexOf(babId);

    // Otomatis tutup sidebar di Mobile setelah klik
    if(window.innerWidth <= 768) {
        document.getElementById('lmsSidebar').classList.remove('open');
    }

    // Scroll ke atas halaman materi
    const contentArea = document.querySelector('.lms-content-area');
    if(contentArea) contentArea.scrollTo({top: 0, behavior: 'smooth'});
}

// Berpindah SUBBAB dalam 1 BAB (termasuk Video, Game, Kuis)
function showSubbab(subId, btnId) {
    const targetSub = document.getElementById(subId);
    if(!targetSub) return;
    
    const babContainer = targetSub.closest('.content-wrapper');
    
    // Sembunyikan konten lain di Bab ini
    babContainer.querySelectorAll('.sub-content').forEach(sub => {
        sub.classList.remove('active');
    });

    // Hilangkan efek aktif di semua tombol subbab
    babContainer.querySelectorAll('.subbab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Tampilkan konten yang dipilih
    targetSub.classList.add('active');
    const btnElement = document.getElementById(btnId);
    if(btnElement) btnElement.classList.add('active');

    // Auto-scroll halus ke area navigasi subbab agar siswa fokus
    const navBar = babContainer.querySelector('.subbab-nav');
    if(navBar) {
        navBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Navigasi Pindah BAB dari tombol paling bawah
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

// Set up UI awal saat halaman dibuka
window.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('lmsSidebar');
    if(sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('hidden'); 
    }
});
