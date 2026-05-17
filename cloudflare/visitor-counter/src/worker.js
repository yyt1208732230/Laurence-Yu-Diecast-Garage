const ALLOWED_PRODUCTION_ORIGIN = 'https://diecast.ilovefuturemobility.org';
const LOCAL_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function isAllowedOrigin(origin) {
    return origin === ALLOWED_PRODUCTION_ORIGIN || LOCAL_ORIGIN_PATTERN.test(origin || '');
}

function corsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const headers = {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Origin'
    };

    if (isAllowedOrigin(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }

    return headers;
}

function jsonResponse(request, body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: corsHeaders(request)
    });
}

function validateVisitorId(visitorId) {
    return typeof visitorId === 'string'
        && visitorId.length >= 8
        && visitorId.length <= 128
        && /^[a-zA-Z0-9._:-]+$/.test(visitorId);
}

async function ensureSchema(env) {
    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_id TEXT NOT NULL,
            visited_at TEXT NOT NULL
        )
    `).run();

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS visitors (
            id TEXT PRIMARY KEY,
            first_seen TEXT NOT NULL
        )
    `).run();
}

async function getVisitTotal(env) {
    const row = await env.DB.prepare('SELECT COUNT(*) AS total FROM visits').first();
    return Number(row?.total || 0);
}

async function recordVisit(request, env) {
    let payload;

    try {
        payload = await request.json();
    } catch (e) {
        return jsonResponse(request, { error: 'Invalid JSON body' }, 400);
    }

    if (!validateVisitorId(payload?.visitorId)) {
        return jsonResponse(request, { error: 'Invalid visitorId' }, 400);
    }

    await ensureSchema(env);
    await env.DB.prepare('INSERT INTO visits (visitor_id, visited_at) VALUES (?, ?)')
        .bind(payload.visitorId, new Date().toISOString())
        .run();

    return jsonResponse(request, { total: await getVisitTotal(env) });
}

async function readTotal(request, env) {
    await ensureSchema(env);
    return jsonResponse(request, { total: await getVisitTotal(env) });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(request)
            });
        }

        if (!env.DB) {
            return jsonResponse(request, { error: 'D1 binding DB is not configured' }, 500);
        }

        if (url.pathname === '/api/visit' && request.method === 'POST') {
            return recordVisit(request, env);
        }

        if (url.pathname === '/api/visitors' && request.method === 'GET') {
            return readTotal(request, env);
        }

        return jsonResponse(request, { error: 'Not found' }, 404);
    }
};
