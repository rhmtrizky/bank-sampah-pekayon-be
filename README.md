# Bank Sampah Pekayon BE — API Reference

This document summarizes the currently available service APIs and their routers.

- Base URL: `/` (Express router mounted in `src/routes/index.js`)
- Health: `GET /` → `{ status: "ok", message: "Server running on port <PORT>" }`
- Auth is required for most endpoints via `Authorization: Bearer <token>`

## Auth (`/auth`)

Routes: `src/routes/auth.routes.js`, Controller: `src/controllers/auth.controller.js`

- POST `/auth/register`

  - Role: public
  - Body: `{ name, email?, phone?, alamat?, password, rt?, rw }`
  - Notes: email or phone is required; creates role `warga`; also initializes wallet
  - Response: `{ user, token }`

- POST `/auth/login`

  - Role: public
  - Body: `{ emailOrPhone, password }`
  - Response: `{ user, token }`

- GET `/auth/profile`

  - Role: authenticated
  - Response: `user` (no password)

- PUT `/auth/profile`
  - Role: authenticated
  - Body: `{ name?, email?, phone?, alamat?, rt?, rw? }`
  - Notes: uniqueness checks for email/phone when changed
  - Response: updated `user`

> RW self-registration is disabled: `POST /auth/register-rw` returns a disabled message.

## Wallet (`/wallet`)

Routes: `src/routes/wallet.routes.js`, Controller: `src/controllers/wallet.controller.js`

- GET `/wallet/`

  - Role: authenticated
  - Response: current wallet `balance`

- GET `/wallet/history`
  - Role: authenticated
  - Response: wallet transaction history

## Transactions (`/transactions`)

Routes: `src/routes/transactions.routes.js`, Controller: `src/controllers/transactions.controller.js`

- POST `/transactions/offline`

  - Role: `rw`
  - Body: offline transaction payload (see controller for schema)
  - Response: created transaction

- GET `/transactions/`

  - Role: `rw`
  - Query: `month?`, `year?`, `page?`, `limit?`
  - Response: `{ data: [transaction], pagination: { page, limit, total, totalPages } }`

- GET `/transactions/:id`

  - Role: `rw`
  - Response: transaction detail

- PATCH `/transactions/:id`

  - Role: `rw`
  - Body: `{ weight_kg: number }` (recomputes `total_amount` using latest RW price)
  - Response: updated transaction

- DELETE `/transactions/:id`
  - Role: `rw`
  - Response: `{ success: true }`

## Deposit Request (`/deposit-request`)

Routes: `src/routes/depositRequest.routes.js`, Controller: `src/controllers/depositRequests.controller.js`

- POST `/deposit-request/`

  - Role: `warga`
  - Body: create request payload
  - Response: created deposit request

- GET `/deposit-request/mine`

  - Role: `warga`
  - Response: list of caller's deposit requests

- GET `/deposit-request/:id`

  - Role: `warga`, `rw`, `kelurahan`, `super_admin`
  - Response: details of a deposit request

- PATCH `/deposit-request/:id/schedule`

  - Role: `rw`
  - Body: schedule payload
  - Response: updated request with schedule info

- PATCH `/deposit-request/:id/complete`

  - Role: `rw`
  - Response: mark as completed

- PATCH `/deposit-request/:id/cancel`

  - Role: `warga`
  - Response: mark as canceled

- PATCH `/deposit-request/bulk-schedule`

  - Role: `rw`
  - Body: `{ from_date: string(ISO), to_date: string(ISO), scheduled_date: string(ISO) }`
  - Behavior: schedules all `pending` requests for the caller's RW with `created_at` between `from_date` and `to_date`, setting `status` to `scheduled` and `scheduled_date`.
  - Response: `{ updatedCount: number, scheduled_date: string(ISO), range: { from_date: string(ISO), to_date: string(ISO) } }`

## Waste Types (`/waste-types`)

Routes: `src/routes/wasteTypes.routes.js`, Controller: `src/controllers/wasteTypes.controller.js`

- GET `/waste-types/`

  - Role: authenticated (could be public if desired)
  - Response: list of waste types

- POST `/waste-types/`

  - Role: `rw`
  - Body: create payload
  - Response: created waste type

- PATCH `/waste-types/:id`

  - Role: `rw`
  - Body: update payload
  - Response: updated waste type

- DELETE `/waste-types/:id`
  - Role: `rw`
  - Response: deletion result

## Price List (`/price-list`)

Routes: `src/routes/priceList.routes.js`, Controller: `src/controllers/priceList.controller.js`

- GET `/price-list/`

  - Role: authenticated
  - Response: list price list entries

- GET `/price-list/rw/:rw_id`

  - Role: authenticated
  - Response: price list entries for RW

- POST `/price-list/`

  - Role: `rw`
  - Body: RW price list create payload
  - Response: created entry

- POST `/price-list/kelurahan`
  - Role: `kelurahan`
  - Body: Kelurahan price list create payload
  - Response: created entry

## Schedules (`/schedule`)

Routes: `src/routes/schedules.routes.js`, Controller: `src/controllers/schedules.controller.js`

- GET `/schedule/collection`

  - Role: authenticated
  - Response: list collection schedules

- GET `/schedule/withdraw`

  - Role: authenticated
  - Response: list withdraw schedules

- POST `/schedule/collection`

  - Role: `rw`, `kelurahan`
  - Body: create payload
  - Response: created schedule

- POST `/schedule/withdraw`
  - Role: `rw`, `kelurahan`
  - Body: create payload
  - Response: created schedule

## Bulk Sales (`/bulk-sales`)

Routes: `src/routes/bulkSales.routes.js`, Controller: `src/controllers/bulkSales.controller.js`

- POST `/bulk-sales/pengepul`

  - Role: `rw`, `kelurahan`
  - Body: create payload
  - Response: created pengepul

- GET `/bulk-sales/pengepul`

  - Role: authenticated
  - Response: list pengepul

- POST `/bulk-sales/`

  - Role: `rw`, `kelurahan`
  - Body: create payload
  - Response: created bulk sale

- GET `/bulk-sales/`
  - Role: authenticated
  - Response: list bulk sales

## Reports (`/reports`)

Routes: `src/routes/reports.routes.js`, Controller: `src/controllers/reports.controller.js`

- GET `/reports/rw`

  - Role: `rw`, `kelurahan`
  - Response: RW report

- GET `/reports/kelurahan`
  - Role: `kelurahan`
  - Response: Kelurahan report

## Monitoring (`/monitoring`)

Routes: `src/routes/monitoring.routes.js`, Controller: `src/controllers/monitoring.controller.js`

- GET `/monitoring/rw`

  - Role: `kelurahan`, `rw`
  - Response: monitoring data for RW

- GET `/monitoring/rt`
  - Role: `kelurahan`, `rw`
  - Response: monitoring data for RT

## Admin (`/admin`)

Routes: `src/routes/admin.routes.js`, Controller: `src/controllers/admin.controller.js`

All routes require `super_admin`.

- POST `/admin/kelurahan`
- GET `/admin/kelurahan`
- PATCH `/admin/kelurahan/:id`

- POST `/admin/rw`
- GET `/admin/rw`
- PATCH `/admin/rw/:id`

## RW Public (`/rw`)

Routes: `src/routes/rw.routes.js`, Controller: `src/controllers/rw.controller.js`

- GET `/rw/`

  - Role: public
  - Response: list RW (public)

- GET `/rw/:id`
  - Role: public
  - Response: RW detail

## Upload (`/upload`)

Routes: `src/routes/upload.routes.js`, Controller: `src/controllers/upload.controller.js`

- POST `/upload/image`
  - Role: authenticated
  - Form-Data: `file` (single image)
  - Response: `{ url }`

---

### Middleware

- `authRequired`: JWT bearer auth required
- `requireRole([roles])`: restricts access to certain roles

### Notes

- See `src/routes/index.js` for route mounting paths.
- See `src/validations/*.validation.js` for expected payload schemas.
- Service logic lives under `src/services/*` and repository operations under `src/repositories/*`.

## Dashboard (`/dashboard`)

Routes: `src/routes/dashboard.routes.js`

### Dashboard RW (`/dashboard/rw`) — Role: `rw`

Controller: `src/controllers/dashboard/rw.dashboard.controller.js`  
Service: `src/services/dashboard/rw.dashboard.service.js`  
Repository: `src/repositories/dashboard/rw.dashboard.repository.js`

- GET `/dashboard/rw/summary`

  - Response: `{ total_transactions_today, total_weight_today, total_amount_today, total_deposit_requests_pending, total_active_warga_in_rw, total_rt_active }`

- GET `/dashboard/rw/charts/transactions-daily`

  - Response: `[{ date: "YYYY-MM-DD", count: number }]` (last 30 days)

- GET `/dashboard/rw/charts/weight-daily`

  - Response: `[{ date: "YYYY-MM-DD", total_weight: number }]` (kg, last 30 days)

- GET `/dashboard/rw/charts/waste-composition`

  - Response: `[{ waste_type_id, waste_type_name, total_weight }]`

- GET `/dashboard/rw/recent/transactions`

  - Response: `[{ transaction_id, user_id, waste_type_id, weight_kg, total_amount, transaction_method, created_at }]` (limit 10)

- GET `/dashboard/rw/recent/requests`

  - Query Params: `page` (default 1), `limit` (default 10)
  - Response: `{ data: [{ request_id, user: { user_id, name }, status, scheduled_date?, created_at }], pagination: { page, limit, total, totalPages } }`

- GET `/dashboard/rw/rt-statistics`

  - Response: `[{ rt, total_transactions, total_weight }]` sorted by weight desc

- GET `/dashboard/rw/sales-summary`

  - Response: `{ total_weight, total_amount }` from `bulk_sales` (by RW)

- GET `/dashboard/rw/recent-sales`

  - Response: `[{ sale_id, total_weight, total_amount, date, pengepul_id }]` (limit 10)

- GET `/dashboard/rw/alerts`

  - Response: `{ pending_requests, today_collection_schedules: [schedule], upcoming_withdraw_schedules: [schedule], unread_notifications }`

- GET `/dashboard/rw/schedules`
  - Response: `{ next_collection_schedules: [schedule], next_withdraw_schedules: [schedule] }`

Schedule item shape (collection): `{ schedule_id, rw_id, kelurahan_id, date, start_time, end_time, description }`  
Schedule item shape (withdraw): `{ withdraw_schedule_id, rw_id, kelurahan_id, date, start_time, end_time }`

### Dashboard Kelurahan (`/dashboard/kelurahan`) — Role: `kelurahan`

Controller: `src/controllers/dashboard/kelurahan.dashboard.controller.js`  
Service: `src/services/dashboard/kelurahan.dashboard.service.js`  
Repository: `src/repositories/dashboard/kelurahan.dashboard.repository.js`

- GET `/dashboard/kelurahan/summary`

  - Response: `{ total_rw, total_transactions_today_all_rw, total_weight_today_all_rw, total_penjualan_all_rw, total_warga_aktif_kelurahan }`

- GET `/dashboard/kelurahan/charts/rw-performance`

  - Response: `[{ rw_id, nomor_rw, name, total_transactions, total_weight_this_month }]`

- GET `/dashboard/kelurahan/charts/weight-monthly`

  - Response: `[{ month: "YYYY-MM", total_weight }]` (last 12 months)

- GET `/dashboard/kelurahan/recent/transactions`

  - Response: `[{ transaction_id, rw_id, user_id, waste_type_id, weight_kg, total_amount, created_at }]` (limit 20)

- GET `/dashboard/kelurahan/recent-sales`

  - Response: `[{ sale_id, total_weight, total_amount, date, pengepul_id }]` (limit 20)

- GET `/dashboard/kelurahan/rw-ranking`

  - Response: `[{ rw_id, total_transactions, total_weight, total_sales_amount }]` (sorted by combined performance)

- GET `/dashboard/kelurahan/waste-composition`

  - Response: `[{ waste_type_id, waste_type_name, total_weight }]` (aggregated across all RW)

- GET `/dashboard/kelurahan/alerts`
  - Response: `{ rw_no_activity_this_month: [{ rw_id, nomor_rw, name }], rt_anomalies: [{ rw_id, rt }], unread_notifications }`

### Example Auth Header

Use JWT Bearer:

```
Authorization: Bearer <token>
```

### Quick Test Commands (PowerShell)

Replace `<HOST>` with server address and `<TOKEN>` with your JWT.

```powershell
Invoke-RestMethod -Method GET -Uri "http://<HOST>/dashboard/rw/summary" -Headers @{ Authorization = "Bearer <TOKEN>" }
Invoke-RestMethod -Method GET -Uri "http://<HOST>/dashboard/kelurahan/summary" -Headers @{ Authorization = "Bearer <TOKEN>" }
```

---

## Request/Response Details (Frontend Guide)

This section lists canonical request bodies for POST/PATCH/PUT and response bodies for GET.

### Auth

- `POST /auth/register` request: `{ name: string, email?: string, phone?: string, alamat?: string, password: string, rt?: number, rw: number }`
- `POST /auth/register` response: `{ user: { user_id, name, email?, phone, alamat?, role, rt?, rw, kelurahan_id }, token: string }`
- `POST /auth/login` request: `{ emailOrPhone: string, password: string }`
- `POST /auth/login` response: `{ user: { user_id, name, email?, phone, role, rt?, rw, kelurahan_id }, token: string }`
- `GET /auth/profile` response: `{ user_id, name, email?, phone, alamat?, role, rt?, rw, kelurahan_id, created_at, updated_at }`
- `PUT /auth/profile` request: `{ name?: string, email?: string, phone?: string, alamat?: string, rt?: number, rw?: number }`
- `PUT /auth/profile` response: updated user (same shape as profile)

### Wallet

- `GET /wallet/` response: `{ wallet_id, user_id, balance }`
- `GET /wallet/history` response: `[{ history_id, user_id, type: 'deposit'|'withdraw', amount, reference_id?, created_at }]`

### Transactions

- `POST /transactions/offline` request: `{ user_id: number, waste_type_id: number, weight_kg: number, price_per_kg: number, total_amount: number, rt?: number }`
- `POST /transactions/offline` response: `{ transaction_id, user_id, rw_id, waste_type_id, weight_kg, price_per_kg, total_amount, transaction_method: 'offline', rt?, created_at }`
- `GET /transactions/` response: `{ data: [{ transaction_id, user_id, rw_id, waste_type_id, weight_kg, price_per_kg, total_amount, transaction_method, rt?, created_at }], pagination: { page, limit, total, totalPages } }`
- `GET /transactions/:id` response: `{ transaction_id, user_id, rw_id, waste_type_id, weight_kg, price_per_kg, total_amount, transaction_method, rt?, created_at }`
- `PATCH /transactions/:id` request: `{ weight_kg: number }`
- `PATCH /transactions/:id` response: updated transaction (same shape)
- `DELETE /transactions/:id` response: `{ success: true }`

### Deposit Request

- `POST /deposit-request/` request: `{ photo?: string, items: [{ waste_type_id: number, weight_kg: number }] }`
- `POST /deposit-request/` response: `{ request_id, user_id, rw_id, status: 'pending'|'scheduled'|'completed'|'cancelled', scheduled_date?, created_at }`
- `GET /deposit-request/mine` response: `[{ request_id, status, scheduled_date?, created_at }]`
- `GET /deposit-request/:id` response: `{ request_id, user_id, rw_id, status, scheduled_date?, created_at, items: [{ item_id, waste_type_id, weight_kg }] }`
- `PATCH /deposit-request/:id/schedule` request: `{ scheduled_date: string(ISO) }`
- `PATCH /deposit-request/:id/schedule` response: `{ request_id, status: 'scheduled', scheduled_date, ... }`
- `PATCH /deposit-request/:id/complete` response: `{ request_id, status: 'completed', ... }`
- `PATCH /deposit-request/:id/cancel` response: `{ request_id, status: 'cancelled', ... }`
- `PATCH /deposit-request/bulk-schedule` request: `{ from_date: string(ISO), to_date: string(ISO), scheduled_date: string(ISO) }`
- `PATCH /deposit-request/bulk-schedule` response: `{ updatedCount: number, scheduled_date: string(ISO), range: { from_date: string(ISO), to_date: string(ISO) } }`

### Waste Types

- `GET /waste-types/` response: `[{ waste_type_id, name, description? }]`
- `POST /waste-types/` request: `{ name: string, description?: string }`
- `POST /waste-types/` response: `{ waste_type_id, name, description?, created_at, updated_at }`
- `PATCH /waste-types/:id` request: `{ name?: string, description?: string }`
- `PATCH /waste-types/:id` response: updated waste type
- `DELETE /waste-types/:id` response: `{ success: boolean }`

### Price List

- `GET /price-list/` response: `[{ price_id, waste_type_id, rw_id?, kelurahan_id?, buy_price, sell_price, effective_date }]`
- `GET /price-list/rw/:rw_id` response: same as above filtered by `rw_id`
- `POST /price-list/` request: `{ waste_type_id: number, buy_price: number, sell_price: number, effective_date: string(ISO) }`
- `POST /price-list/` response: created price list entry
- `POST /price-list/kelurahan` request: `{ waste_type_id: number, buy_price: number, sell_price: number, effective_date: string(ISO) }`
- `POST /price-list/kelurahan` response: created price list entry

### Schedules

- `GET /schedule/collection` response: `[{ schedule_id, rw_id?, kelurahan_id?, date, start_time, end_time, description? }]`
- `GET /schedule/withdraw` response: `[{ withdraw_schedule_id, rw_id?, kelurahan_id?, date, start_time, end_time }]`
- `POST /schedule/collection` request: `{ date: string(ISO), start_time: string(ISO), end_time: string(ISO), description?: string }`
- `POST /schedule/collection` response: created schedule item
- `POST /schedule/withdraw` request: `{ date: string(ISO), start_time: string(ISO), end_time: string(ISO) }`
- `POST /schedule/withdraw` response: created withdraw schedule item

### Bulk Sales

- `POST /bulk-sales/pengepul` request: `{ name: string, phone?: string, address?: string }`
- `POST /bulk-sales/pengepul` response: `{ pengepul_id, name, phone?, address? }`
- `GET /bulk-sales/pengepul` response: `[{ pengepul_id, name, phone?, address? }]`
- `POST /bulk-sales/` request: `{ pengepul_id: number, items: [{ waste_type_id: number, weight_kg: number, price_per_kg: number }], date?: string(ISO) }`
- `POST /bulk-sales/` response: `{ sale_id, rw_id?, kelurahan_id?, total_weight, total_amount, date }`
- `GET /bulk-sales/` response: `[{ sale_id, rw_id?, kelurahan_id?, total_weight, total_amount, date }]`

### Reports

- `GET /reports/rw` response: `{ total_transactions, total_weight, total_revenue, total_withdraw, month, year }`
- `GET /reports/kelurahan` response: `{ total_transactions, total_weight, total_revenue, total_withdraw, month, year }`

### Monitoring

- `GET /monitoring/rw` response: `[{ rw_id, metrics... }]`
- `GET /monitoring/rt` response: `[{ rw_id, rt, metrics... }]`

### Admin

- `POST /admin/kelurahan` request: `{ nama_kelurahan: string, kecamatan?: string, kota?: string }`
- `POST /admin/kelurahan` response: `{ kelurahan_id, nama_kelurahan, kecamatan?, kota? }`
- `GET /admin/kelurahan` response: `[{ kelurahan_id, nama_kelurahan, kecamatan?, kota? }]`
- `PATCH /admin/kelurahan/:id` request: `{ nama_kelurahan?: string, kecamatan?: string, kota?: string }`
- `PATCH /admin/kelurahan/:id` response: updated kelurahan
- `POST /admin/rw` request: `{ kelurahan_id: number, nomor_rw: number, name?: string, phone?: string, address?: string }`
- `POST /admin/rw` response: `{ rw_id, kelurahan_id, nomor_rw, name?, phone?, address? }`
- `GET /admin/rw` response: `[{ rw_id, kelurahan_id, nomor_rw, name?, phone?, address?, active }]`
- `PATCH /admin/rw/:id` request: `{ nomor_rw?: number, name?: string, phone?: string, address?: string, active?: boolean }`
- `PATCH /admin/rw/:id` response: updated RW

### RW Public

- `GET /rw/` response: `[{ rw_id, kelurahan_id, nomor_rw, name?, phone?, address?, active }]`
- `GET /rw/:id` response: `{ rw_id, kelurahan_id, nomor_rw, name?, phone?, address?, active }`

### Upload

- `POST /upload/image` form-data: `file` (single image)
- `POST /upload/image` response: `{ url: string }`
