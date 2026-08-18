---
name: webhook
description: "Terminal node that delivers workflow outputs to an external URL as a JSON web request. Text inputs are sent verbatim; media inputs are rendered server-side and delivered as absolute file URLs."
metadata:
  nodeType: Webhook
  triggers: "webhook, send, notify, deliver, callback, integration, post to url"
---

# Webhook

## What It Does
A **terminal** node that resolves all connected inputs into a JSON payload and
fires an HTTP request (`POST` / `PUT` / `PATCH` / `DELETE`) at a configured
endpoint. It is the workflow-side complement to the Export node: instead of
handing results back to Gatewai, it pushes them to an external service.

Dispatch happens **server-side only** — the node's Run button routes through
the backend, where media is rendered to stable file URLs before delivery. The
browser processor is a no-op mirror and never fires a request.

## When to Use
- **Automation:** push generated media/text into another product (Slack, Zapier,
  n8n, Make, a custom service) when a workflow completes.
- **API integration:** deliver outputs to a customer endpoint from an
  API-driven workflow run.
- **Chaining run-to-run:** trigger a downstream workflow that consumes files.

## Inputs
Dynamic inputs (Compositor-style). Add them from the node or by dragging a
connection onto the node.

| Input | Types | Resolution |
|-------|-------|------------|
| Any connected handle | `Text`, `Image`, `Video`, `Audio`, `Caption`, `SVG`, `GIF`, `Lottie` | `Text` is sent verbatim; everything else is rendered (if needed) and sent as an absolute file URL |

Payload keys are the connected input handle labels, sanitized to JSON-safe
keys and de-duplicated (`Title` → `Title`, `Title_2`, …).

## Config
| Field | Type | Range | Default | Description |
|-------|------|-------|---------|-------------|
| url | string | must start `http://`/`https://` | – | Endpoint receiving the request |
| method | enum | `POST`, `PUT`, `PATCH`, `DELETE` | `POST` | HTTP method (no `GET` — a webhook without a body is a ping, not a delivery) |
| headers | array<{key, value}> | ≤ 40 rows, key ≤ 128 chars | `[]` | Custom headers; `Content-Type` defaults to `application/json` unless overridden |
| timeout | int seconds | 5–60 | `30` | Request timeout; aborts on batch cancellation too |

## Output
This is a **Terminal Node** — no output handles. The HTTP response body is
stored as the node result (`type: Text`) so the editor can display what the
endpoint returned (non-2xx responses surface as node errors with the status and
response body).

## Execution model
- **Editor:** click **Dispatch Webhook** (the generic terminal-node Run button).
  It saves the canvas and runs the node through the backend
  (`POST /api/v1/canvas/:id/run`), so media URLs are resolved server-side.
  Anonymous users are routed to sign-in (server dispatch requires auth).
- **API / batch:** the node fires automatically when its batch task executes.
- **Browser:** the browser processor is a strict no-op — it only restores the
  last server result for display and never makes a network request.

## Pricing
Free — 0 credits. Only the media re-render (if any) is billed via normal
render pricing.
