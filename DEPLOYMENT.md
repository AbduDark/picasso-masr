# 🚀 دليل نشر بيكاسو مصر على السيرفر
## https://picasso-masr.com

---

> [!IMPORTANT]
> اقرأ الدليل كاملاً قبل البدء. نفّذ الخطوات بالترتيب بالضبط.

---

## المتطلبات

| المكوّن | التفصيل |
|---------|---------|
| **السيرفر** | VPS بـ Ubuntu 22.04 LTS — (2 CPU / 2 GB RAM كحد أدنى) |
| **Node.js** | v20 LTS |
| **Supabase** | مشروع منشأ على [supabase.com](https://supabase.com) |
| **الدومين** | `picasso-masr.com` موجّه DNS إلى IP السيرفر |

---

## الخطوة 1 — إعداد Supabase (قاعدة البيانات)

### 1.1 شغّل Migration

1. افتح **Supabase Dashboard → SQL Editor**
2. اضغط **New query**
3. انسخ محتوى الملف كاملاً:
   ```
   supabase/migrations/001_setup_complete.sql
   ```
4. اضغط **Run** ← انتظر حتى تظهر رسالة `Done ✓`

### 1.2 أنشئ حساب الأدمن

1. افتح **Supabase → Authentication → Users**
2. اضغط **Add user → Create new user**
3. أدخل:
   - **Email:** `admin@picasso-masr.com`
   - **Password:** كلمة سر قوية ≥ 12 حرف
4. فعّل **Email Confirm** واضغط **Create user**

> [!NOTE]
> هذا الحساب هو الوحيد الذي سيسمح له بالدخول للوحة التحكم `/admin`

### 1.3 اجمع مفاتيح Supabase

افتح **Settings → API** وانسخ:

| المفتاح | المكان |
|---------|--------|
| `Project URL` | NEXT_PUBLIC_SUPABASE_URL |
| `anon public` | NEXT_PUBLIC_SUPABASE_ANON_KEY |
| `service_role secret` | SUPABASE_SERVICE_ROLE_KEY |

---

## الخطوة 2 — تجهيز السيرفر (VPS)

```bash
# اتصل بالسيرفر
ssh root@YOUR_SERVER_IP

# حدّث الحزم
apt update && apt upgrade -y

# ثبّت Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# ثبّت PM2 (مدير العمليات)
npm install -g pm2

# ثبّت Nginx
apt install -y nginx

# ثبّت Certbot (SSL)
apt install -y certbot python3-certbot-nginx

# تحقق من الإصدارات
node -v  # يجب أن يظهر v20.x.x
pm2 -v
nginx -v
```

---

## الخطوة 3 — رفع الكود على السيرفر

### الخيار أ) من GitHub (مُوصى به)

```bash
# على السيرفر
cd /var/www
git clone https://github.com/YOUR_USERNAME/picasso-masr.git picasso-masr
cd picasso-masr
```

### الخيار ب) رفع مباشر بـ SCP

```bash
# من جهازك
scp -r d:/WorkSpace/Projects/PicassoMisr root@YOUR_SERVER_IP:/var/www/picasso-masr
```

---

## الخطوة 4 — ملف البيئة `.env.production`

```bash
# على السيرفر، داخل مجلد المشروع
cd /var/www/picasso-masr
nano .env.production
```

الصق هذا المحتوى (استبدل القيم بالبيانات الحقيقية):

```env
# ─── Supabase ───────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyXXXXXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=eyXXXXXXXXXXXXXXXXXXX

# ─── Site ───────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://picasso-masr.com
NODE_ENV=production
```

اضغط **Ctrl+X → Y → Enter** للحفظ.

---

## الخطوة 5 — بناء التطبيق

```bash
cd /var/www/picasso-masr

# ثبّت الحزم
npm ci --production=false

# ابنِ التطبيق
npm run build

# تأكد أن البناء نجح
echo "✓ Build complete"
```

> [!WARNING]
> إذا ظهر خطأ أثناء البناء، تأكد أن ملف `.env.production` صحيح وأن مفاتيح Supabase موجودة.

---

## الخطوة 6 — تشغيل التطبيق بـ PM2

```bash
cd /var/www/picasso-masr

# شغّل التطبيق
pm2 start npm --name "picasso-masr" -- start

# احفظ إعدادات PM2 (للاستعادة بعد إعادة تشغيل السيرفر)
pm2 save

# شغّل PM2 عند بدء تشغيل السيرفر
pm2 startup
# انسخ الأمر الذي يظهر وشغّله

# تحقق أن التطبيق يعمل
pm2 status
pm2 logs picasso-masr --lines 20
```

التطبيق الآن يعمل على `localhost:3000`.

---

## الخطوة 7 — إعداد Nginx (Reverse Proxy)

```bash
nano /etc/nginx/sites-available/picasso-masr
```

الصق هذا الإعداد:

```nginx
server {
    listen 80;
    server_name picasso-masr.com www.picasso-masr.com;

    # Redirect www → non-www
    if ($host = www.picasso-masr.com) {
        return 301 https://picasso-masr.com$request_uri;
    }

    location / {
        proxy_pass          http://localhost:3000;
        proxy_http_version  1.1;
        proxy_set_header    Upgrade $http_upgrade;
        proxy_set_header    Connection 'upgrade';
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;
        proxy_cache_bypass  $http_upgrade;
    }

    # Static files cache
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Favicon and robots
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Max upload size (for images)
    client_max_body_size 15M;
}
```

```bash
# فعّل الإعداد
ln -s /etc/nginx/sites-available/picasso-masr /etc/nginx/sites-enabled/

# تأكد من صحة الإعداد
nginx -t

# أعد تشغيل Nginx
systemctl reload nginx
```

---

## الخطوة 8 — SSL بـ Certbot (HTTPS)

> [!IMPORTANT]
> تأكد أن DNS للدومين `picasso-masr.com` يشير لـ IP السيرفر قبل هذه الخطوة.

```bash
# احصل على شهادة SSL مجانية
certbot --nginx -d picasso-masr.com -d www.picasso-masr.com \
  --non-interactive --agree-tos -m admin@picasso-masr.com

# تأكد من التجديد التلقائي
certbot renew --dry-run
```

بعد هذه الخطوة، الموقع يعمل على `https://picasso-masr.com` 🎉

---

## الخطوة 9 — الضبط النهائي في next.config.js

تأكد أن `next.config.js` يحتوي على:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
}

module.exports = nextConfig
```

---

## الخطوة 10 — اختبار ما بعد النشر

```bash
# تأكد أن التطبيق يعمل
curl -I https://picasso-masr.com
# يجب أن يرجع: HTTP/2 200

# شوف الـ logs
pm2 logs picasso-masr --lines 50

# مراقبة الأداء
pm2 monit
```

---

## قائمة تفحص ما بعد النشر ✅

- [ ] الصفحة الرئيسية تفتح على `https://picasso-masr.com`
- [ ] صفحة `https://picasso-masr.com/admin` تطلب تسجيل الدخول
- [ ] تسجيل الدخول بالإيميل والباسورد يعمل
- [ ] إضافة منتج تجريبي ثم التحقق منه على الموقع
- [ ] رفع صورة للمعرض يعمل
- [ ] استعلام WhatsApp يفتح على الجوال
- [ ] الموقع يعمل باللغتين (عربي/إنجليزي)
- [ ] شهادة SSL تعمل (قفل أخضر)

---

## أوامر مفيدة بعد النشر

```bash
# تحديث الكود من GitHub
cd /var/www/picasso-masr
git pull origin main
npm ci --production=false
npm run build
pm2 restart picasso-masr

# إعادة تشغيل التطبيق فقط
pm2 restart picasso-masr

# عرض الـ logs في الوقت الفعلي
pm2 logs picasso-masr

# إيقاف التطبيق مؤقتاً
pm2 stop picasso-masr

# تجديد SSL يدوياً
certbot renew
```

---

## هيكل ملفات المشروع

```
picasso-masr/
├── app/
│   ├── (public)/          ← صفحات الموقع العامة
│   │   ├── page.tsx       ← الصفحة الرئيسية (Server Component)
│   │   ├── products/      ← صفحة المنتجات وتفاصيل كل منتج
│   │   └── ...
│   ├── admin/             ← لوحة التحكم (محمية بـ Auth)
│   │   ├── page.tsx       ← Dashboard + إحصائيات
│   │   ├── products/      ← إدارة المنتجات + رفع صور
│   │   ├── orders/        ← إدارة الطلبات
│   │   ├── inquiries/     ← الاستفسارات
│   │   ├── testimonials/  ← آراء العملاء
│   │   ├── gallery/       ← معرض الصور
│   │   └── settings/      ← إعدادات الموقع
│   └── api/               ← API routes
├── components/
│   ├── sections/          ← أقسام الصفحة الرئيسية
│   ├── ui/                ← مكونات UI قابلة للإعادة
│   └── providers/         ← Context providers
├── lib/
│   ├── data.ts            ← Server-side data fetching
│   ├── supabase/          ← Supabase clients
│   ├── constants.ts       ← Seed data + constants
│   └── utils.ts           ← Helper functions
├── supabase/
│   └── migrations/
│       └── 001_setup_complete.sql  ← كل شيء في ملف واحد
├── messages/
│   ├── ar.json            ← ترجمة عربي
│   └── en.json            ← ترجمة إنجليزي
└── .env.production        ← متغيرات البيئة (لا ترفع لـ Git!)
```

---

## متغيرات البيئة الكاملة

```env
# ─── Supabase (مطلوب) ───────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ─── Site ───────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://picasso-masr.com
NODE_ENV=production
```

---

> [!TIP]
> **تحديث الكود بعد التطوير:** أي تعديل تعمله على الجهاز المحلي، ارفعه على GitHub ثم شغّل `git pull && npm run build && pm2 restart picasso-masr` على السيرفر.

> [!NOTE]
> **Supabase مجاني:** الخطة المجانية تكفي لبداية الموقع (500 MB قاعدة بيانات، 1 GB Storage). عند الحاجة، رقّي للـ Pro ($25/شهر).
