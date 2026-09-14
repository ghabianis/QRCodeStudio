
const SUPABASE_URL = 'https://ktheyohwsbifdalqrnel.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__jTdurbxkpXq1SA7i1j-Rw_zX47ZM19';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- DOM ----------
const authScreen = document.getElementById('authScreen');
const appContainer = document.getElementById('appContainer');
const tabSignIn = document.getElementById('tabSignIn');
const tabSignUp = document.getElementById('tabSignUp');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authMessage = document.getElementById('authMessage');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authSubmitIcon = document.getElementById('authSubmitIcon');
const authSubmitText = document.getElementById('authSubmitText');

const urlInput = document.getElementById('urlInput');
const fgColor = document.getElementById('fgColor');
const fgColorText = document.getElementById('fgColorText');
const bgColor = document.getElementById('bgColor');
const bgColorText = document.getElementById('bgColorText');
const sizeSelect = document.getElementById('sizeSelect');
const errorSelect = document.getElementById('errorSelect');
const canvas = document.getElementById('qrcodeCanvas');
const userEmailSpan = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const saveQrBtn = document.getElementById('saveQrBtn');
const updateQrBtn = document.getElementById('updateQrBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const qrListContainer = document.getElementById('qrListContainer');
const noQrMessage = document.getElementById('noQrMessage');
const toastEl = document.getElementById('toast');

const downloadPngBtn = document.getElementById('downloadPngBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

// ---------- STATE ----------
let currentUser = null;
let currentQrId = null;
let qrItems = [];
let authMode = 'signin';

// ---------- TOAST ----------
function showToast(message, duration = 3000) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => toastEl.classList.remove('show'), duration);
}

// ---------- AUTH MODE ----------
function setAuthMode(mode) {
    authMode = mode;
    authMessage.textContent = '';
    authMessage.className = 'auth-message';
    if (mode === 'signin') {
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
        authSubmitText.textContent = 'Sign In';
        authSubmitIcon.className = 'fas fa-sign-in-alt';
        authPassword.autocomplete = 'current-password';
    } else {
        tabSignUp.classList.add('active');
        tabSignIn.classList.remove('active');
        authSubmitText.textContent = 'Sign Up';
        authSubmitIcon.className = 'fas fa-user-plus';
        authPassword.autocomplete = 'new-password';
    }
}

tabSignIn.addEventListener('click', () => setAuthMode('signin'));
tabSignUp.addEventListener('click', () => setAuthMode('signup'));

// ---------- AUTH SUBMIT ----------
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authMessage.textContent = '';
    authMessage.className = 'auth-message';
    const email = authEmail.value.trim();
    const password = authPassword.value;
    if (!email || !password) {
        authMessage.textContent = 'Please fill in all fields.';
        authMessage.classList.add('error');
        return;
    }
    if (password.length < 6) {
        authMessage.textContent = 'Password must be at least 6 characters.';
        authMessage.classList.add('error');
        return;
    }
    authSubmitBtn.disabled = true;
    const originalText = authSubmitText.textContent;
    authSubmitText.textContent = 'Please wait...';
    try {
        if (authMode === 'signin') {
            const { error } = await sb.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } else {
            const { data, error } = await sb.auth.signUp({ email, password });
            if (error) throw error;
            if (data.user && !data.session) {
                authMessage.textContent = '✓ Account created! Check your email to confirm, then sign in.';
                authMessage.classList.add('success');
                setTimeout(() => setAuthMode('signin'), 2500);
            }
        }
    } catch (err) {
        console.error('Auth error:', err);
        let msg = err.message || 'Authentication failed.';
        if (/Invalid login credentials/i.test(msg)) msg = 'Invalid email or password.';
        if (/User already registered/i.test(msg)) msg = 'This email is already registered. Try signing in.';
        if (/Email not confirmed/i.test(msg)) msg = 'Please confirm your email first, then sign in.';
        authMessage.textContent = msg;
        authMessage.classList.add('error');
    } finally {
        authSubmitBtn.disabled = false;
        authSubmitText.textContent = originalText;
    }
});

logoutBtn.addEventListener('click', async () => {
    await sb.auth.signOut();
    showToast('Logged out');
});

function showApp() {
    authScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
}
function showAuth() {
    appContainer.classList.add('hidden');
    authScreen.classList.remove('hidden');
    authForm.reset();
    setAuthMode('signin');
}

async function applyUser(user) {
    currentUser = user;
    if (user) {
        userEmailSpan.textContent = user.email;
        showApp();
        updatePreview();
        loadQrCodes();
    } else {
        showAuth();
        qrItems = [];
        qrListContainer.innerHTML = '';
        noQrMessage.style.display = 'block';
        cancelEdit();
    }
}

sb.auth.onAuthStateChange((_event, session) => {
    applyUser(session?.user || null);
});

// ---------- QR RENDER ----------
function renderQRCode(url, fg, bg, size, errorLevel) {
    if (!url) url = 'https://example.com';
    try {
        QRCode.toCanvas(canvas, url, {
            width: parseInt(size),
            margin: 2,
            color: { dark: fg, light: bg },
            errorCorrectionLevel: errorLevel
        });
    } catch (err) {
        console.error('QR render error:', err);
    }
}

function updatePreview() {
    if (!currentUser) return;
    renderQRCode(
        urlInput.value.trim() || 'https://example.com',
        fgColor.value, bgColor.value,
        sizeSelect.value, errorSelect.value
    );
}

fgColor.addEventListener('input', () => { fgColorText.value = fgColor.value; updatePreview(); });
fgColorText.addEventListener('input', () => {
    if (/^#[0-9A-F]{6}$/i.test(fgColorText.value)) { fgColor.value = fgColorText.value; updatePreview(); }
});
bgColor.addEventListener('input', () => { bgColorText.value = bgColor.value; updatePreview(); });
bgColorText.addEventListener('input', () => {
    if (/^#[0-9A-F]{6}$/i.test(bgColorText.value)) { bgColor.value = bgColorText.value; updatePreview(); }
});
urlInput.addEventListener('input', updatePreview);
sizeSelect.addEventListener('change', updatePreview);
errorSelect.addEventListener('change', updatePreview);

// ---------- DB OPS ----------
async function loadQrCodes() {
    if (!currentUser) return;
    const { data, error } = await sb
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error(error);
        showToast('Error loading QR codes: ' + error.message);
        return;
    }
    qrItems = data || [];
    renderQrList();
}

async function saveQrCode() {
    if (!currentUser) return;
    const url = urlInput.value.trim();
    if (!url) { showToast('URL is required'); return; }
    const qrData = {
        user_id: currentUser.id,
        url,
        fg_color: fgColor.value,
        bg_color: bgColor.value,
        size: parseInt(sizeSelect.value),
        error_level: errorSelect.value,
        created_at: new Date().toISOString()
    };
    const { error } = await sb.from('qr_codes').insert([qrData]);
    if (error) { showToast('Error saving: ' + error.message); return; }
    showToast('QR code saved!');
    await loadQrCodes();
}

async function updateQrCode() {
    if (!currentQrId || !currentUser) return;
    const url = urlInput.value.trim();
    if (!url) { showToast('URL is required'); return; }
    const updates = {
        url,
        fg_color: fgColor.value,
        bg_color: bgColor.value,
        size: parseInt(sizeSelect.value),
        error_level: errorSelect.value
    };
    const { error } = await sb
        .from('qr_codes')
        .update(updates)
        .eq('id', currentQrId)
        .eq('user_id', currentUser.id);
    if (error) { showToast('Update failed: ' + error.message); return; }
    showToast('QR code updated');
    cancelEdit();
    await loadQrCodes();
}

async function deleteQrCode(id, event) {
    event.stopPropagation();
    if (!currentUser) return;
    if (!confirm('Delete this QR code permanently?')) return;
    const { error } = await sb
        .from('qr_codes')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);
    if (error) { showToast('Delete failed: ' + error.message); return; }
    showToast('QR code deleted');
    if (currentQrId === id) cancelEdit();
    await loadQrCodes();
}

function renderQrList() {
    if (!currentUser) return;
    if (qrItems.length === 0) {
        noQrMessage.style.display = 'block';
        noQrMessage.textContent = 'No saved QR codes yet. Create one above!';
        qrListContainer.innerHTML = '';
        return;
    }
    noQrMessage.style.display = 'none';
    qrListContainer.innerHTML = '';
    qrItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'qr-card';
        const canvasEl = document.createElement('canvas');
        canvasEl.width = 150;
        canvasEl.height = 150;
        canvasEl.style.width = '100%';
        canvasEl.style.maxWidth = '150px';
        QRCode.toCanvas(canvasEl, item.url, {
            width: 150, margin: 1,
            color: { dark: item.fg_color, light: item.bg_color },
            errorCorrectionLevel: item.error_level || 'M'
        });
        const urlText = document.createElement('div');
        urlText.className = 'url-text';
        urlText.textContent = item.url.length > 30 ? item.url.slice(0, 27) + '…' : item.url;
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'card-actions';
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-outline btn-sm';
        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editBtn.addEventListener('click', (e) => { e.stopPropagation(); startEdit(item); });
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', (e) => deleteQrCode(item.id, e));
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        card.appendChild(canvasEl);
        card.appendChild(urlText);
        card.appendChild(actionsDiv);
        qrListContainer.appendChild(card);
    });
}

function startEdit(item) {
    if (!currentUser) return;
    currentQrId = item.id;
    urlInput.value = item.url;
    fgColor.value = item.fg_color;
    fgColorText.value = item.fg_color;
    bgColor.value = item.bg_color;
    bgColorText.value = item.bg_color;
    sizeSelect.value = item.size || 300;
    errorSelect.value = item.error_level || 'M';
    updatePreview();
    saveQrBtn.classList.add('hidden');
    updateQrBtn.classList.remove('hidden');
    cancelEditBtn.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    currentQrId = null;
    saveQrBtn.classList.remove('hidden');
    updateQrBtn.classList.add('hidden');
    cancelEditBtn.classList.add('hidden');
    urlInput.value = 'https://example.com';
    fgColor.value = '#000000'; fgColorText.value = '#000000';
    bgColor.value = '#ffffff'; bgColorText.value = '#ffffff';
    sizeSelect.value = '300';
    errorSelect.value = 'M';
    if (currentUser) updatePreview();
}

function downloadPng() {
    if (!currentUser) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = 'qrcode.png'; a.click();
}

function downloadSvg() {
    if (!currentUser) return;
    try {
        QRCode.toString(urlInput.value.trim() || 'https://example.com', {
            type: 'svg',
            width: parseInt(sizeSelect.value),
            margin: 2,
            color: { dark: fgColor.value, light: bgColor.value },
            errorCorrectionLevel: errorSelect.value
        }).then(function (svgString) {
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'qrcode.svg'; a.click();
            URL.revokeObjectURL(url);
        });
    } catch (err) { showToast('SVG download failed'); }
}

function downloadPdf() {
    if (!currentUser) return;
    try {
        const { jsPDF } = window.jspdf;
        const size = parseInt(sizeSelect.value);
        const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [size + 40, size + 40] });
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, 20, size, size);
        doc.save('qrcode.pdf');
    } catch (err) { showToast('PDF download failed'); }
}

saveQrBtn.addEventListener('click', saveQrCode);
updateQrBtn.addEventListener('click', updateQrCode);
cancelEditBtn.addEventListener('click', cancelEdit);
downloadPngBtn.addEventListener('click', downloadPng);
downloadSvgBtn.addEventListener('click', downloadSvg);
downloadPdfBtn.addEventListener('click', downloadPdf);

(async function init() {
    appContainer.classList.add('hidden');
    authScreen.classList.remove('hidden');
    setAuthMode('signin');
    const { data: { session } } = await sb.auth.getSession();
    applyUser(session?.user || null);
})();
