<div dir="rtl">

# 🌐 حافظه مشترک Hermes — Hermes Shared Memory

> **پل ابری رایگان بین دو یا چند Hermes Agent از طریق Cloudflare Workers**

</div>

---

<div dir="rtl">

## 🎯 چرا این پروژه؟

اگر از **Hermes Agent** روی چند تا دستگاه استفاده می‌کنی (مثلاً یکی روی لپ‌تاپ، یکی روی Termux اندروید)،
هرکدوم **حافظه و تاریخچه جدا** دارن. یعنی Agent لپ‌تاپ نمی‌دونه توی Termux چی گذشته.

این پروژه یه **API حافظه ابری رایگان** می‌سازه که:

- ✅ هر دو Agent می‌تونن از یه حافظه مشترک استفاده کنن
- ✅ Cloudflare Workers هست → **کاملاً رایگان** (۱۰۰K درخواست/روز)
- ✅ نیازی به سرور اختصاصی نداری
- ✅ بدون دردسر نصب و راه‌اندازی
- ✅ از هر جای دنیا در دسترس

### مشکل اصلی

```
📱 Agent A (Termux)     💻 Agent B (Laptop)
     │                         │
     │  حافظه جدا              │  حافظه جدا
     │  skills جدا             │  skills جدا
     │  sessions جدا           │  sessions جدا
     │                         │
     └─────── ❌ هیچ اشتراکی ندارن ───────┘
```

### راه‌حل

```
📱 Agent A (Termux)           💻 Agent B (Laptop)
     │                              │
     ├── 📤 می‌نویسه ──➤  ☁️ Cloudflare  ◂── 📥 می‌خونه
     │                    │  Workers + KV  │
     └── 📥 می‌خونه ◂───  └───────────────┘  ──➤ 📤 می‌نویسه
     
     ✅ هر دو از یه حافظه می‌خونن/می‌نویسن
```

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

---

## 🚀 شروع سریع

### ۱. استقرار روی Cloudflare

**از طریق داشبورد (ساده):**

۱. برو به [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
۲. بزن **Create Application** → **Create Worker**
۳. اسمش رو بذار `hermes-memory`
۴. محتوای فایل [`src/worker.js`](src/worker.js) رو کپی کن و بچسبون
۵. بزن **Save and Deploy**

**ساخت KV Namespace:**
- توی Worker → **KV** → **Create a Namespace**
- اسم: `SHARED_MEMORY`
- برگرد به **Settings** → **Variables** → **KV Namespace Bindings**
- Add binding: `Variable=SHARED_MEMORY`, `KV namespace=SHARED_MEMORY`

**API Token:**
- **Settings** → **Variables** → **Environment Variables**
- `Variable name`: `API_TOKEN`
- `Value`: یه رمز امن (مثلاً `hermes@token123`)
- ✅ Encrypt رو فعال کن

> 📝 آدرس Worker این شکلی میشه: `https://hermes-memory.your-subdomain.workers.dev`

### ۲. نصب روی Hermes Agent

**توی `.env` هر دو دستگاه:**
```bash
CF_MEMORY_URL=https://hermes-memory.your-subdomain.workers.dev
CF_MEMORY_TOKEN=your-secret-token
```

**توی هر جلسه Hermes:**
```bash
/skill shared-memory
```

### ۳. استفاده

```bash
# وضعیت سرویس
python ~/.hermes/scripts/cf_shared_memory.py status

# ذخیره یه حافظه
python ~/.hermes/scripts/cf_shared_memory.py set user/profile '{"name":"Aref","lang":"fa"}'

# خوندن حافظه
python ~/.hermes/scripts/cf_shared_memory.py get user/profile

# ادغام جزئی (بدون از دست دادن بقیه فیلدها)
python ~/.hermes/scripts/cf_shared_memory.py patch user/profile '{"theme":"dark"}'

# لیست همه حافظه‌ها
python ~/.hermes/scripts/cf_shared_memory.py list
```

---

## 📂 ساختار پروژه

```
hermes-shared-memory/
├── src/
│   └── worker.js           ← کد Cloudflare Worker
├── wrangler.toml            ← کانفیگ Wrangler CLI
├── DEPLOY.md                ← راهنمای کامل استقرار
├── README.md                ← همین فایل
└── .gitignore               ← فایل‌های نادیده گرفته شده

~/.hermes/
├── scripts/
│   └── cf_shared_memory.py  ← اسکریپت خط فرمان
└── skills/custom/
    └── shared-memory/
        └── SKILL.md          ← Skill مخصوص Hermes
```

---

## 🧠 ایده‌های استفاده

| سناریو | توضیح |
|--------|-------|
| 🏠 **لپ‌تاپ + Termux** | یه Agent روی لپ‌تاپ برای کارهای سنگین، یکی روی Termux همیشه روشن |
| 👥 **دستگاه‌های خانواده** | دو Agent روی دو تا لپ‌تاپ مختلف با یه حافظه مشترک |
| 📱 **موبایل + دسکتاپ** | از موبایل دستور بدی، روی دسکتاپ جواب بگیره |
| 🌍 **ریموت + لوکال** | یکی روی VPS خارج، یکی روی سیستم خودت |

---

## 📜 مجوز

MIT — آزاد برای استفاده شخصی و تجاری.

---

## 🙏 قدردانی

- [Nous Research](https://nousresearch.com/) برای [Hermes Agent](https://github.com/NousResearch/hermes-agent)
- [Cloudflare](https://cloudflare.com/) برای Workers رایگان

</div>

---

## 🇬🇧 English

# 🌐 Hermes Shared Memory

> **Free cloud bridge between two or more Hermes Agents via Cloudflare Workers**

## 🎯 Why This Project?

If you use **Hermes Agent** on multiple devices (e.g., laptop + Android Termux),
each agent has **its own isolated memory and sessions**. The laptop agent doesn't
know what happened on Termux.

This project creates a **free cloud memory API** that:

- ✅ Lets both agents share the same memory across devices
- ✅ Powered by Cloudflare Workers → **100% free** (100K requests/day)
- ✅ No server needed
- ✅ Zero configuration hassle
- ✅ Accessible from anywhere in the world

### The Problem

```
📱 Agent A (Termux)     💻 Agent B (Laptop)
     │                         │
     │  isolated memory        │  isolated memory
     │  separate skills        │  separate skills
     │  separate sessions      │  separate sessions
     │                         │
     └─────── ❌ No shared state ───────┘
```

### The Solution

```
📱 Agent A (Termux)         💻 Agent B (Laptop)
     │                              │
     ├── ✍️ writes ──➤  ☁️ Cloudflare  ◂── 📖 reads
     │                    │  Workers + KV  │
     └── 📖 reads ◂───  └───────────────┘  ──➤ ✍️ writes
     
     ✅ Both agents read/write the same memory
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Read/Write** | Any JSON data |
| 🔄 **Merge (PATCH)** | Partial updates without data loss |
| 🔑 **Secure** | Bearer Token authentication |
| 🌍 **Global** | Accessible from any device |
| 💰 **Free** | Cloudflare Workers Free Tier |
| ⏱️ **TTL** | Auto-expiry for temporary data |

## 🚀 Quick Start

### 1. Deploy to Cloudflare

**Via Dashboard (easy):**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. Click **Create Application** → **Create Worker**
3. Name it `hermes-memory`
4. Copy [`src/worker.js`](src/worker.js) content and paste
5. Click **Save and Deploy**

**Create KV Namespace:**
- Worker → **KV** → **Create a Namespace**
- Name: `SHARED_MEMORY`
- Go back to **Settings** → **Variables** → **KV Namespace Bindings**
- Add binding: `Variable=SHARED_MEMORY`, `KV namespace=SHARED_MEMORY`

**API Token:**
- **Settings** → **Variables** → **Environment Variables**
- `Variable name`: `API_TOKEN`
- `Value`: A secure token (e.g., `hermes@token123`)
- ✅ Enable **Encrypt**

> 📝 Worker URL will be: `https://hermes-memory.your-subdomain.workers.dev`

### 2. Install on Both Hermes Agents

**In `.env` on each device:**
```bash
CF_MEMORY_URL=https://hermes-memory.your-subdomain.workers.dev
CF_MEMORY_TOKEN=your-secret-token
```

**In each Hermes session:**
```bash
/skill shared-memory
```

### 3. Usage

```bash
# Check service status
python ~/.hermes/scripts/cf_shared_memory.py status

# Save a memory
python ~/.hermes/scripts/cf_shared_memory.py set user/profile '{"name":"Aref","lang":"en"}'

# Read a memory
python ~/.hermes/scripts/cf_shared_memory.py get user/profile

# Partial merge (preserve other fields)
python ~/.hermes/scripts/cf_shared_memory.py patch user/profile '{"theme":"dark"}'

# List all memories
python ~/.hermes/scripts/cf_shared_memory.py list
```

## 📂 Project Structure

```
hermes-shared-memory/
├── src/
│   └── worker.js           ← Cloudflare Worker code
├── wrangler.toml            ← Wrangler CLI config
├── DEPLOY.md                ← Complete deployment guide
├── README.md                ← This file
└── .gitignore               ← Ignored files

~/.hermes/
├── scripts/
│   └── cf_shared_memory.py  ← CLI script
└── skills/custom/
    └── shared-memory/
        └── SKILL.md          ← Hermes Skill
```

## 🧠 Use Cases

| Scenario | Description |
|----------|-------------|
| 🏠 **Laptop + Termux** | One agent on laptop for heavy tasks, one on Termux always-on |
| 👥 **Family devices** | Two agents on different laptops with shared memory |
| 📱 **Mobile + Desktop** | Command from mobile, response on desktop |
| 🌍 **Remote + Local** | One on cloud VPS, one on local machine |

## 📜 License

MIT — Free for personal and commercial use.

## 🙏 Credits

- [Nous Research](https://nousresearch.com/) for [Hermes Agent](https://github.com/NousResearch/hermes-agent)
- [Cloudflare](https://cloudflare.com/) for free Workers
