// Hermes Shared Memory — Cloudflare Worker
// دوتا Hermes Agent می‌تونن از این API برای حافظه مشترک استفاده کنن

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS — برای اینکه هم از Termux هم از لپ‌تاپ قابل دسترسی باشه
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ==========================================
    // احراز هویت — با API Token ساده
    // ==========================================
    const auth = request.headers.get('Authorization');
    const expectedToken = env.API_TOKEN;
    if (!auth || auth !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    try {
      // ==========================================
      // GET / — وضعیت
      // ==========================================
      if (method === 'GET' && path === '/') {
        return new Response(JSON.stringify({
          service: 'hermes-shared-memory',
          version: 1,
          status: 'ok',
          docs: 'GET /memory/:key | PUT /memory/:key | DELETE /memory/:key | GET /memory/list',
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // ==========================================
      // GET /memory/list — لیست همه کلیدها
      // ==========================================
      if (method === 'GET' && path === '/memory/list') {
        const prefix = url.searchParams.get('prefix') || '';
        const list = await env.SHARED_MEMORY.list({ prefix });
        return new Response(JSON.stringify({
          keys: list.keys.map(k => ({ name: k.name, expiration: k.expiration })),
          cursor: list.cursor || null,
          list_complete: list.list_complete,
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // ==========================================
      // GET /memory/:key — خوندن یه حافظه
      // ==========================================
      if (method === 'GET' && path.startsWith('/memory/')) {
        const key = path.slice(8);
        if (!key) {
          return new Response(JSON.stringify({ error: 'Key required' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const value = await env.SHARED_MEMORY.get(key);
        if (value === null) {
          return new Response(JSON.stringify({ found: false, key }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        return new Response(value, {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // ==========================================
      // PUT /memory/:key — نوشتن حافظه
      // ==========================================
      if (method === 'PUT' && path.startsWith('/memory/')) {
        const key = path.slice(8);
        if (!key) {
          return new Response(JSON.stringify({ error: 'Key required' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const body = await request.text();
        // TTL اختیاری (چند ثانیه)
        const ttlParam = url.searchParams.get('ttl');
        const ttl = ttlParam ? parseInt(ttlParam) : undefined;

        // اعتبارسنجی JSON
        try {
          JSON.parse(body);
        } catch {
          return new Response(JSON.stringify({ error: 'Body must be valid JSON' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const putOptions = {};
        if (ttl && !isNaN(ttl) && ttl > 60) putOptions.expirationTtl = ttl;

        await env.SHARED_MEMORY.put(key, body, putOptions);
        return new Response(JSON.stringify({ success: true, key }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // ==========================================
      // PATCH /memory/:key — به‌روزرسانی جزئی (merge)
      // ==========================================
      if (method === 'PATCH' && path.startsWith('/memory/')) {
        const key = path.slice(8);
        if (!key) {
          return new Response(JSON.stringify({ error: 'Key required' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const patchData = await request.json();
        const existing = await env.SHARED_MEMORY.get(key);
        let merged;

        if (existing) {
          const existingObj = JSON.parse(existing);
          merged = { ...existingObj, ...patchData };
        } else {
          merged = { ...patchData, _created_at: new Date().toISOString() };
        }

        await env.SHARED_MEMORY.put(key, JSON.stringify(merged));
        return new Response(JSON.stringify({ success: true, key, merged: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // ==========================================
      // DELETE /memory/:key — حذف
      // ==========================================
      if (method === 'DELETE' && path.startsWith('/memory/')) {
        const key = path.slice(8);
        if (!key) {
          return new Response(JSON.stringify({ error: 'Key required' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        await env.SHARED_MEMORY.delete(key);
        return new Response(JSON.stringify({ success: true, key, deleted: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // ==========================================
      // 404
      // ==========================================
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
