# 📋 Dionysus — Release Instructions

## 🎯 Maqsad
Hermes Shared Memory ro **profe-shional release** kon baraye LinkedIn + GitHub

---

## 🔧 STEP 1: Token Check

Current token `workflow` scope nadare. Bayad check koni:

```bash
gh auth status
```

Agar `workflow` scope nist:
1. Beru be: https://github.com/settings/tokens
2. **Generate new token (classic)**
3. **Scopes:** `repo` + `workflow`
4. Copy kon

```bash
gh auth login --with-token <<< "ghp_YOUR_TOKEN"
```

---

## 🔧 STEP 2: Workflow Push

```bash
cd ~/hermes-shared-memory
git pull origin main
git push origin main
```

---

## 🔧 STEP 3: Version Tag

```bash
cd ~/hermes-shared-memory
git tag -a v1.0.0 -m "🎉 Initial Release: Hermes Shared Memory"
git push origin v1.0.0
```

**Natije:**
- ✅ GitHub Actions roshan
- ✅ Package publish
- ✅ Release sakhte mishe

---

## 📱 LinkedIn Post

```
🚀 I just built something cool!

Hermes Shared Memory — a free cloud bridge between AI Agents.

The Problem:
If you run Hermes Agent on multiple devices (laptop + Android),
each agent has isolated memory.

The Solution:
Cloudflare Workers + KV = Shared memory API

✅ Read/Write any JSON
✅ Merge updates without data loss
✅ Auto-sync every hour
✅ 100% Free (100K requests/day)

Tech Stack:
- Cloudflare Workers (serverless)
- Cloudflare KV (key-value storage)
- GitHub Actions (CI/CD)
- npm package publishing

🔗 GitHub: https://github.com/Arefmtl/hermes-shared-memory-

#HermesAgent #Cloudflare #AI #OpenSource #Serverless #TechInnovation
```

---

## ⚠️ Credentials Check

Code TOZHIF-e! Hich token/secret-i tosh nist.

---

**Mitoonam anjam bedi?** 🙏
