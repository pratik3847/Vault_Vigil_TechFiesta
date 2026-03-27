## FastAPI backend

### Run locally (Windows PowerShell)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Endpoints

- `GET /health`
- `GET /api/transactions`
- `GET /api/risk-factors`
- `GET /api/network-graph`

Frontend expects the API at `http://localhost:8000`.
