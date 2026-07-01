<div dir="rtl">

# 🌐 حافظه مشترک Hermes — Hermes Shared Memory

> **پل ابری رایگان بین دو یا چند Hermes Agent از طریق Cloudflare Workers**

</div>

---

<div dir="rtl">

## 🎯 چرا این پروژه؟

اگر از **Hermes Agent** روی چند تا دستگاه استفاده می‌کنی (مثلاً یکی روی لپ‌تاپ، یکی روی Termux اندروید)،
هرکدوم **حافظه و تاریخچه جدا** دارن.

این پروژه یه **API حافظه ابری رایگان** می‌سازه که هر دو Agent بتونن از یه حافظه مشترک استفاده کنن.

---

## ✨ قابلیت‌ها

| ویژگی | توضیح |
|--------|-------|
| 📝 **خوندن/نوشتن** | هر نوع داده JSON |
| 🔄 **ادغام (Merge)** | به‌روزرسانی جزئی بدون از دست دادن داده |
| 🔑 **امن** | Authentication با Bearer Token |
| 🌍 **جهانی** | از هر دستگاهی قابل دسترسی |
| 💰 **رایگان** | Cloudflare Workers Free Tier |
| ⏱️ **TTL** | انقضای خودکار برای داده‌های موقت |
| ⏰ **Sync** | Cron job هر ۱ ساعت |

---

## 🚀 استقرار

### ۱. نصب Wrangler

```bash
npm install -g wrangler
wrangler login
```

### ۲. ساخت KV Namespace

```bash
cd ~/hermes-shared-memory
wrangler kv namespace create SHARED_MEMORY
```

### ۳. تنظیم wrangler.toml

```toml
name = "hermes-shared-memory"
main = "src/worker.js"
compatibility_date = "2025-12-01"
workers_dev = true

[[kv_namespaces]]
binding = "SHARED_MEMORY"
id = "YOUR_NAMESPACE_ID"
preview_id = "YOUR_NAMESPACE_ID"
```

### ۴. API Token

```bash
wrangler secret put API_TOKEN
# رمزت رو تایپ کن
```

### ۵. Deploy

```bash
wrangler deploy
```

---

## 📋 استفاده

```bash
# وضعیت
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://hermes-memory.workers.dev/

# نوشتن
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Aref","device":"laptop"}' \
  https://hermes-memory.workers.dev/memory/mykey

# خوندن
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://hermes-memory.workers.dev/memory/mykey

# ادغام
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"online"}' \
  https://hermes-memory.workers.dev/memory/mykey

# لیست
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://hermes-memory.workers.dev/memory/list

# حذف
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://hermes-memory.workers.dev/memory/mykey
```

---

## ⏰ Cron Job (Sync خودکار)

هر ۱ ساعت، دو Agent همزمان می‌خونن/می‌نویسن:

```bash
# Cron schedule: 0 * * * * (هر ساعت سر ساعت)
```

---

## 📂 ساختار پروژه

```
hermes-shared-memory/
├── src/
│   └── worker.js           ← کد Cloudflare Worker
├── wrangler.toml            ← کانفیگ Wrangler
├── DEPLOY.md                ← راهنمای کامل
└── README.md                ← همین فایل
```

---

## 🇬🇧 English

# 🌐 Hermes Shared Memory

> **Free cloud bridge between two or more Hermes Agents via Cloudflare Workers**

## Features

| Feature | Description |
|---------|-------------|
| 📝 **Read/Write** | Any JSON data |
| 🔄 **Merge (PATCH)** | Partial updates without data loss |
| 🔑 **Secure** | Bearer Token authentication |
| 🌍 **Global** | Accessible from any device |
| 💰 **Free** | Cloudflare Workers Free Tier |
| ⏰ **Sync** | Cron job every 1 hour |

## Quick Start

```bash
npm install -g wrangler
wrangler login
wrangler kv namespace create SHARED_MEMORY
wrangler secret put API_TOKEN
wrangler deploy
```

## Usage

```bash
# Write
curl -X PUT -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}' \
  https://your-worker.workers.dev/memory/mykey

# Read
curl -H "Authorization: Bearer TOKEN" \
  https://your-worker.workers.dev/memory/mykey
```

## License

MIT

---

## 🙏 Credits

- [Nous Research](https://nousresearch.com/) for [Hermes Agent](https://github.com/NousResearch/hermes-agent)
- [Cloudflare](https://cloudflare.com/) for free Workers
