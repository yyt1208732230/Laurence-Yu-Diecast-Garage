# Diecast visitor counter

Cloudflare Worker + D1 endpoint for the static site's historical visit count.

## Cloudflare setup

Run these from this directory after logging in with Wrangler:

```powershell
npx wrangler d1 create diecast_visitors
```

Put the returned D1 `database_id` into `wrangler.toml`, then initialize the table:

```powershell
npx wrangler d1 execute diecast_visitors --remote --file=./schema.sql
```

Deploy the Worker:

```powershell
npx wrangler deploy
```

The Worker route is configured for:

```text
diecast.ilovefuturemobility.org/api/*
```

## Endpoints

`POST /api/visit`

```json
{ "visitorId": "browser-generated-id" }
```

Every valid request inserts one visit event. The `visitorId` still comes from the
browser's local storage, but repeated requests from the same `visitorId` are
counted as additional visits.

Response:

```json
{ "total": 1234 }
```

`GET /api/visitors`

```json
{ "total": 1234 }
```

## Manual checks

```powershell
curl.exe https://diecast.ilovefuturemobility.org/api/visitors
curl.exe -X POST https://diecast.ilovefuturemobility.org/api/visit -H "Content-Type: application/json" -d "{\"visitorId\":\"manual-test-visitor\"}"
```
