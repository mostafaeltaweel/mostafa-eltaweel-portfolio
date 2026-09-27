# تعديل البورتفوليو من GitHub

> هذا الدليل يخص النسخة الثابتة قبل ربط Supabase. لتشغيل الإدارة الجديدة، اتبع [دليل الإعداد](SETUP-AR.md).
> بعد الربط، عدّل المشاريع من `/admin/`؛ تعديل ملفات GitHub وحده لا يغيّر بيانات Supabase.

كل مشروع له ملف مستقل داخل `content/projects`. الموقع يتحدث بعد حفظ التغييرات على فرع `main` ونجاح النشر.

## تعديل مشروع

1. افتح [مجلد المشاريع](https://github.com/mostafaeltaweel/mostafa-eltaweel-portfolio/tree/main/content/projects).
2. افتح ملف المشروع المطلوب.
3. اضغط علامة القلم **Edit**.
4. عدّل القيم بين علامات التنصيص.
5. اضغط **Commit changes** واحفظ على `main`.
6. انتظر نجاح [عملية النشر](https://github.com/mostafaeltaweel/mostafa-eltaweel-portfolio/actions).
7. افتح [الموقع](https://mostafaeltaweel.github.io/mostafa-eltaweel-portfolio/).

## إضافة مشروع

1. ارفع صورة المشروع إلى `assets/images` باستخدام **Add file → Upload files**.
2. افتح مجلد `content/projects`.
3. اختر **Add file → Create new file**.
4. سمّ الملف باسم جديد، مثل `sales-dashboard.json`.
5. انسخ المثال التالي وعدّل بياناته.
6. احفظ الملف باستخدام **Commit changes**.

```json
{
  "id": "sales-dashboard",
  "title": "Sales Dashboard",
  "group": "Analytics & BI",
  "category": "Power BI",
  "description": "وصف المشروع والنتيجة التي حققها.",
  "image": "assets/images/powerbi-survey.jpg",
  "imageAlt": "صورة لوحة المبيعات",
  "order": 70,
  "visible": true,
  "wide": true,
  "isNew": true,
  "problem": "ما السؤال الذي تحاول الإجابة عنه؟",
  "approach": "كيف أعددت البيانات وبنيت التحليل؟",
  "outcome": "ما الذي يعرضه العمل وما النتيجة المثبتة؟",
  "limitations": "اذكر مصدر البيانات وحدود الاستخدام.",
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com/mostafaeltaweel",
      "download": false
    }
  ]
}
```

المثال يستخدم صورة موجودة. غيّر `image` لمسار الصورة الجديدة بعد رفعها.

| الحقل | الاستخدام |
| --- | --- |
| `title` | اسم المشروع |
| `id` | معرّف يطابق اسم الملف بدون `.json` |
| `group` | `Analytics & BI` أو `Applied AI` أو `Tools & Automation` |
| `category` | المجال أو الأدوات |
| `description` | وصف المشروع |
| `image` | مسار الصورة داخل المستودع أو رابط HTTPS |
| `imageAlt` | وصف الصورة لقارئ الشاشة |
| `order` | ترتيب المشروع؛ الرقم الأصغر يظهر أولًا |
| `visible` | `true` للإظهار، و`false` للإخفاء |
| `wide` | `true` لبطاقة عريضة |
| `isNew` | `true` لإظهار علامة New |
| `links` | أزرار المشروع؛ يمكن إضافة أكثر من زر أو استخدام `[]` |
| `download` | `true` لتنزيل ملف من الموقع، و`false` لفتح الرابط |

## حذف مشروع أو إخفاؤه

- للإخفاء المؤقت: غيّر `visible` إلى `false` واحفظ.
- للحذف: افتح ملف المشروع، ثم اختر **Delete file** من قائمة الملف واحفظ.

عدد المشاريع الظاهر في الصفحة يتحدث تلقائيًا. حذف ملف المشروع لا يحذف صورته أو ملفات التنزيل.

## تعديل بياناتك وباقي الصفحة

- عدّل التخصص والجملة التعريفية ونبذة About في `content/site.json`.
- لتغيير السيرة الذاتية، ارفع الملف الجديد باسم `assets/Resume.pdf`.
- لتغيير صورتك، استبدل `assets/images/portrait.png`.
- لتعديل التواصل والخبرات والشهادات وأي نص آخر، عدّل `templates/index.html`.
- لتعديل الألوان والخطوط، عدّل `style.css`.

لا تعدّل `index.html` مباشرة؛ عملية البناء تعيد إنشاءه من البيانات والقالب.

## تفعيل النشر لأول مرة

إذا استلمت النسخة كملف ZIP:

1. فك ضغط الملف على جهازك.
2. افتح المستودع على GitHub واختر **Add file → Upload files**.
3. اسحب محتويات المجلد إلى صفحة الرفع، وليس ملف ZIP أو المجلد الأب.
4. تأكد أن `index.html` ومجلدات `content` و`scripts` و`templates` في جذر المستودع.
5. احفظ التغييرات على فرع `main`.
6. تأكد من تحديث `.github/workflows/pages.yml` أيضًا.

إذا لم يظهر مجلد `.github` أثناء الرفع، افتح ملف `pages.yml` الموجود في المستودع واضغط **Edit**.
انسخ إليه محتوى الملف المقابل من النسخة الجديدة، ثم احفظ التغيير.
لا تكتفِ برفع ملف ZIP؛ GitHub Pages لا يفك ضغطه تلقائيًا.

1. افتح **Settings → Pages** داخل المستودع.
2. تحت **Build and deployment**، اختر **GitHub Actions** كمصدر.
3. افتح **Actions → Deploy to GitHub Pages**.
4. اضغط **Run workflow** واختر `main`.

ملف النشر موجود في `.github/workflows/pages.yml`. الرابط يظل كما هو.
راجع [توثيق GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) لإعداد المصدر.

## لو التعديل لم يظهر

1. افتح تبويب **Actions**.
2. افتح أحدث عملية نشر.
3. إذا فشلت خطوة البناء، اقرأ اسم الملف والحقل في رسالة الخطأ.
4. صحّح الملف ثم احفظه من جديد.
5. بعد نجاح النشر، حدّث الصفحة باستخدام `Ctrl + F5`.

ملفات JSON تحتاج علامات تنصيص مزدوجة وفواصل بين الحقول. آخر حقل لا يحتاج فاصلة بعده.
اكتب `true` و`false` بدون علامات تنصيص. لا تضع تعليقات داخل JSON.
مسارات الملفات حساسة لحالة الحروف على GitHub؛ استخدم الاسم كما هو.
إذا فشل البناء، لا ينشر التعديل الجديد وتبقى آخر نسخة منشورة.

## معاينة محلية

مع تثبيت Node.js 22، شغّل الأمر التالي من مجلد المشروع:

```sh
node scripts/build.mjs
```

ثم شغّل `node scripts/serve.mjs` وافتح `http://127.0.0.1:4173/`. مجلد `_site` يحتوي على ملفات النشر.
