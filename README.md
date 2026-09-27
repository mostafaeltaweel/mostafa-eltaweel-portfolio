# Mostafa Eltaweel — Data Analyst & Applied AI

![Version](https://img.shields.io/badge/version-v2.0.0-00b09b)
[![Deploy to GitHub Pages](https://github.com/mostafaeltaweel/mostafa-eltaweel-portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/mostafaeltaweel/mostafa-eltaweel-portfolio/actions/workflows/pages.yml)
[![Website](https://img.shields.io/badge/website-live-00b09b)](https://mostafaeltaweel.github.io/mostafa-eltaweel-portfolio/)

Personal portfolio presenting practical work across data analytics, business intelligence, machine learning, computer vision, and workflow automation.

## ابدأ هنا

النسخة الحالية تشمل واجهة الزوار، سبعة مشاريع، دراسات حالة، ولوحة إدارة عربية تعمل مع Supabase.

- [ربط Vercel وSupabase وتشغيل لوحة الإدارة](SETUP-AR.md).
- [التوجه المهني ومراجعة مشروع التحليل المالي](CAREER-AND-REPORT-AR.md).
- [تعديل النسخة الثابتة من GitHub](EDITING-AR.md).

لوحة الإدارة: `/admin/`. تجربة محلية دون نشر: `/admin/?demo=1` عندما لا يكون Supabase مربوطًا.
بعد الربط، استخدم لوحة الإدارة لتعديل المحتوى المباشر. ملفات `content` تصبح نسخة الإعداد الأولية.

## تعديل النسخة الثابتة من GitHub

ابدأ من [دليل التعديل بالعربي](EDITING-AR.md).

- المشاريع: ملف لكل مشروع داخل [`content/projects`](content/projects).
- التخصص والنبذة: [`content/site.json`](content/site.json).
- باقي محتوى الصفحة: [`templates/index.html`](templates/index.html).
- احفظ التغييرات على `main` لنشر الموقع تلقائيًا باستخدام GitHub Actions.

## Live website

[mostafaeltaweel.github.io/mostafa-eltaweel-portfolio](https://mostafaeltaweel.github.io/mostafa-eltaweel-portfolio/)

## Selected work

- Electricity Theft Detection — dual-branch CNN-LSTM risk-scoring application.
- EmoLens — EfficientNet-B3 and CBAM facial-emotion recognition.
- Data Professional Survey — interactive Power BI dashboard.
- Business Performance Report — downloadable Power BI project.
- Feed Formulation Calculator — Arabic offline-first React PWA.
- Life Manager — connected Arabic Excel management system.

## Core capabilities

- Data analytics: Power BI, Power Query, DAX, SQL, Excel, Python.
- Applied AI: machine learning, deep learning, computer vision, explainability.
- Automation: n8n, REST APIs, webhooks, data transformation, scheduled reporting.
- Product delivery: Streamlit, React, PWA, responsive HTML/CSS/JavaScript.

## Run locally

Run `node scripts/build.mjs` with Node.js 22 or later. Then run `node scripts/serve.mjs` and open `http://127.0.0.1:4173/`.
The build validates project data and local image and download paths before deployment. Do not edit the generated `index.html`.

Run `node --test tests/*.test.mjs` for validation and build tests. Browser tests require Playwright and Edge (or a configured browser channel).
The browser API tests use a mock. Run `supabase/security-check.sql` and the steps in the setup guide against the connected project before launch.

## Versioning

This project follows semantic versioning. See [CHANGELOG.md](CHANGELOG.md) for release history.

## Contact

- [LinkedIn](https://www.linkedin.com/in/mostafa-eltaweel/)
- [GitHub](https://github.com/mostafaeltaweel)
- Email: mostafa.eltaweel000@gmail.com

© 2026 Mostafa Eltaweel.
