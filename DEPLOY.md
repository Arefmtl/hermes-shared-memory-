# 🚀 استقرار روی Cloudflare — راهنمای گام به گام

دو راه داری: **Wrangler CLI** یا **داشبورد Cloudflare**.

---

## روش ۱: از طریق داشبورد Cloudflare (ساده‌تر، بدون نصب)

### مرحله ۱: برو به Cloudflare Dashboard
1. وارد [dash.cloudflare.com](https://dash.cloudflare.com) بشو
2. از منوی چپ **Workers & Pages** رو انتخاب کن
3. بزن روی **Create Application** → **Create Worker**

### مرحله ۲: کد Worker رو بچسبون
1. اسم Worker رو بذار: `hermes-memory`
2. توی ادیتور، کل محتوای فایل `src/worker.js` رو کپی کن و جایگزین کن
3. بزن **Save and Deploy**

### مرحله ۳: KV Namespace بساز
1. از منوی چپ زیر Worker جدیدت، برو به **KV**
2. بزن **Create a Namespace**
3. اسمش رو بذار: `SHARED_MEMORY`
4. بزن **Create**

### مرحله ۴: KV رو به Worker وصل کن
1. برگرد به تب **Settings** → **Variables**
2. زیر **KV Namespace Bindings** بزن **Add binding**
3. `Variable name` = `SHARED_MEMORY`
4. `KV namespace` = `SHARED_MEMORY` (همونی که ساختی)
5. بزن **Save**

### مرحله ۵: API Token رو تنظیم کن
1. بازم توی **Settings** → **Variables**
2. زیر **Environment Variables** بزن **Add variable**
3. `Variable name` = `API_TOKEN`
4. `Value` = یه رمز قوی (مثلاً `hermes@aref#2026` یا چیزی که خودت دوست داری)
5. گزینه **Encrypt** رو فعال کن ✅
6. بزن **Save**

> 📝 این رمز رو جایی ذخیره کن — بعداً توی `.env` هر دو دستگاه نیازش داری!

### مرحله ۶: آدرس Worker رو پیدا کن
1. برگرد به تب اول Worker
2. آدرسش رو کپی کن: `https://hermes-memory.your-subdomain.workers.dev`
3. تستش کن:
```bash
curl https://hermes-memory.your-subdomain.workers.dev/
# باید برگردونه: {"service":"hermes-shared-memory","status":"ok",...}
```

### مرحله ۷: تست کن
```bash
# با رمزت
curl -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -X PUT -d '{"test":"hello"}' \
     https://hermes-memory.your-subdomain.workers.dev/memory/test

curl -H "Authorization: Bearer TOKEN" \
     https://hermes-memory.your-subdomain.workers.dev/memory/test
```

---

## روش ۲: از طریق Wrangler CLI (حرفه‌ای‌تر)

```bash
# Wrangler نصب کن
npm install -g wrangler

# لاگین به Cloudflare
wrangler login

# برو به پوشه پروژه
cd ~/hermes-shared-memory

# KV namespace بساز
wrangler kv:namespace create SHARED_MEMORY
# → یه ID برمیگردونه، بذارش توی wrangler.toml

# Deploy کن
wrangler deploy

# API Token بذار (رمز امن)
wrangler secret put API_TOKEN
# → رمزت رو تایپ کن
```

---

## تنظیم روی Hermes

### توی `.env` هر دو دستگاه (Termux و لپ‌تاپ):
```bash
CF_MEMORY_URL=https://hermes-memory.your-subdomain.workers.dev
CF_MEMORY_TOKEN=your-secret-token
```

### توی session:

حالا می‌تونی از دستورات زیر استفاده کنی:

```bash
# توی هر دو agent
python ~/.hermes/scripts/cf_shared_memory.py status
python ~/.hermes/scripts/cf_shared_memory.py set profile/user '{"name": "Aref", "lang": "fa"}'
python ~/.hermes/scripts/cf_shared_memory.py get profile/user
```

---

## 🎯 خلاصه

| کار | وضعیت |
|-----|--------|
| ✅ Worker ساخته شد | توی داشبورد Cloudflare |
| ✅ KV Namespace | SHARED_MEMORY |
| ✅ API Token | تنظیم شد |
| ✅ Script نصب شد | `~/.hermes/scripts/cf_shared_memory.py` |
| ✅ Skill نصب شد | `shared-memory` |

> حالا هر دو Hermes Agent به یه حافظه مشترک دسترسی دارن! 🎉
