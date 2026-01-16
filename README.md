# auto-buy-assistant
AI-assisted platform for evaluating car listings using scraping, history tracking, and explainable scoring.

## Quickstart (Docker)

```bash
docker compose up --build
```

Apply database migrations in another terminal:

```bash
docker compose exec api alembic upgrade head
```

### Example requests

Health check:

```bash
curl http://localhost:8000/health
```

Ingest a listing:

```bash
curl -X POST http://localhost:8000/listings/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source": "AUTOSCOUT24",
    "raw": {
      "price": "17 990 €",
      "km": "125 348 km",
      "first_registration": "09/2021",
      "title": "Skoda Enyaq 60 62kWh",
      "brand": "Skoda",
      "model": "Enyaq"
    }
  }'
```

Fetch a listing by ID:

```bash
curl http://localhost:8000/listings/<id>
```

## Tests

```bash
cd apps/api
pytest
```

## Dev workflow (PowerShell)

```powershell
.\dev.ps1
```

## One-command dev run (Windows)

```powershell
.\dev.ps1
```
