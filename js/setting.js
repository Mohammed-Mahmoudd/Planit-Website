// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupEventListeners();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // أحداث التبويبات
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const contentId = this.getAttribute('onclick').split("'")[1];
            showContent(contentId, this);
        });
    });

    // أحداث القوائم المنسدلة
    document.querySelectorAll('.dropdown-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.parentElement.classList.toggle('active');
        });
    });

    // أحداث الحفظ
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    document.getElementById('saveGeneralSettings')?.addEventListener('click', saveSettings);
}

// تبديل المحتوى
function showContent(contentId, button) {
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    
    document.getElementById(contentId).classList.add('active');
    button.classList.add('active');
}

// تحديد خيار في القائمة المنسدلة
function selectOption(element) {
    const dropdown = element.closest('.custom-dropdown');
    const btn = dropdown.querySelector('.dropdown-btn');
    btn.textContent = element.textContent;
    dropdown.classList.remove('active');
}

// حفظ الإعدادات
function saveSettings() {
    try {
        const settings = {
            account: {
                name: document.querySelector('#content2 input[placeholder="Mohamed"]').value,
                surname: document.querySelector('#content2 input[placeholder="Hamza"]').value,
                email: document.querySelector('#content2 input[type="email"]').value
            },
            general: {
                mobileNotification: document.querySelector('#content1 .switch:nth-child(1) input').checked,
                desktopNotification: document.querySelector('#content1 .switch:nth-child(2) input').checked,
                gmailNotification: document.querySelector('#content1 .switch:nth-child(3) input').checked,
                appearance: document.querySelector('#content1 .dropdown-btn').textContent.trim(),
                language: document.querySelector('#content1 .custom-dropdown:last-child .dropdown-btn').textContent.trim()
            }
        };

        localStorage.setItem('appSettings', JSON.stringify(settings));
        showToast('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('حدث خطأ أثناء الحفظ', true);
    }
}

// تحميل الإعدادات
function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('appSettings'));
    if (saved) {
        // تحميل إعدادات الحساب
        if (saved.account) {
            document.querySelector('#content2 input[placeholder="Mohamed"]').value = saved.account.name || '';
            document.querySelector('#content2 input[placeholder="Hamza"]').value = saved.account.surname || '';
            document.querySelector('#content2 input[type="email"]').value = saved.account.email || '';
        }

        // تحميل الإعدادات العامة
        if (saved.general) {
            document.querySelector('#content1 .switch:nth-child(1) input').checked = saved.general.mobileNotification || false;
            document.querySelector('#content1 .switch:nth-child(2) input').checked = saved.general.desktopNotification || false;
            document.querySelector('#content1 .switch:nth-child(3) input').checked = saved.general.gmailNotification || false;
            
            if (saved.general.appearance) {
                document.querySelector('#content1 .dropdown-btn').textContent = saved.general.appearance;
            }
            
            if (saved.general.language) {
                document.querySelector('#content1 .custom-dropdown:last-child .dropdown-btn').textContent = saved.general.language;
            }
        }
    }
}

// عرض التنبيهات
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}