# 📤 دستورات آپلود به GitHub

## مرحله ۱: ساخت Repository روی GitHub

1. برو به: https://github.com/new
2. Repository name: `calculator-app`
3. Description: `ماشین حساب پیشرفته با HTML, CSS, JavaScript`
4. Public انتخاب کن
5. **هیچکدوم از گزینه‌ها رو تیک نزن** (نه README، نه .gitignore، نه License)
6. روی "Create repository" کلیک کن

---

## مرحله ۲: وصل کردن و آپلود

بعد از ساخت repository، این دستورات رو اجرا کن:

```bash
# وصل کردن به GitHub (USERNAME رو با نام کاربری خودت عوض کن)
git remote add origin https://github.com/USERNAME/calculator-app.git

# بررسی remote
git remote -v

# آپلود به GitHub
git push -u origin main
```

---

## مرحله ۳: لاگین GitHub

اولین بار که `git push` می‌زنی:
- یک پنجره لاگین باز میشه
- وارد حساب GitHub شو
- به Hermes اجازه دسترسی بده

---

## بعد از آپلود:

پروژت رو می‌تونی اینجا ببینی:
```
https://github.com/USERNAME/calculator-app
```

---

## فعال کردن GitHub Pages (رایگان!):

1. برو به Settings پروژه
2. از منوی چپ، Pages رو انتخاب کن
3. Source: Deploy from a branch
4. Branch: main → Save
5. بعد از ۱-۲ دقیقه، سایتت اینجا زنده میشه:
   ```
   https://USERNAME.github.io/calculator-app
   ```

---

## دستورات بعدی (برای آینده):

```bash
# دانلود آخرین تغییرات
git pull

# آپلود تغییرات جدید
git add .
git commit -m "توضیح تغییر"
git push
```
