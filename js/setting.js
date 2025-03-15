function showContent(id, btn) {
    // إخفاء كل المحتويات
    document.querySelectorAll('.content').forEach(div => {
        div.classList.remove('content-active');
    });

    // إظهار المحتوى المطلوب
    document.getElementById(id).classList.add('content-active');

    // إعادة تعيين لون الأزرار
    document.querySelectorAll('.button_Ge').forEach(button => {
        button.classList.remove('buttonGe-active');
    });

    // جعل الزر الحالي نشطًا
    btn.classList.add('buttonGe-active');
}
document.querySelectorAll(".toggleSwitch").forEach(switchInput => {
    const switchID = switchInput.getAttribute("data-id");

    // تحميل الحالة من localStorage
    if (localStorage.getItem(switchID) === "on") {
        switchInput.checked = true;
    }

    // حفظ الحالة عند التغيير
    switchInput.addEventListener("change", function() {
        if (this.checked) {
            localStorage.setItem(switchID, "on");
        } else {
            localStorage.setItem(switchID, "off");
        }
    });
});
document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
    const btn = dropdown.querySelector(".dropdown-btn");
    const list = dropdown.querySelector(".dropdown-list");
    
    // عند الضغط على الزر، قم بتبديل القائمة النشطة
    btn.addEventListener("click", function(event) {
        event.stopPropagation(); // منع إغلاقها فور الضغط
        dropdown.classList.toggle("active");
    });

    // تحديد الخيار المختار من القائمة
    list.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", function() {
            btn.textContent = this.textContent;
            dropdown.classList.remove("active");
        });
    });
});

// إغلاق القوائم عند النقر خارجها
document.addEventListener("click", function(event) {
    document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("active");
        }
    });
});
