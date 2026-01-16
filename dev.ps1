$ErrorActionPreference = "Stop"

Write-Host "Starting Auto Buy Assistant dev workflow"

try {
    Write-Host ""
    Write-Host "==> Step 1: Build and start containers"
    docker compose up -d --build

    Write-Host ""
    Write-Host "==> Step 2: Wait for API health check"
    $deadline = (Get-Date).AddSeconds(60)
    $healthy = $false

    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -TimeoutSec 2
            if ($response.status -eq "ok") {
                $healthy = $true
                break
            }
        } catch {
            Start-Sleep -Seconds 2
        }
    }

    if (-not $healthy) {
        throw "API health check did not return status ok within 60 seconds."
    }

    Write-Host ""
    Write-Host "==> Step 3: Run Alembic migrations (if available)"
    docker compose exec -T api sh -c "command -v alembic" | Out-Null
    if ($LASTEXITCODE -eq 0) {
        docker compose exec -T api alembic upgrade head
    } else {
        Write-Host "Alembic not available in container; skipping migrations."
    }

    Write-Host ""
    Write-Host "==> Step 4: Run tests"
    docker compose exec -T api pytest

    Write-Host ""
    Write-Host "DONE – system is running"
} catch {
    Write-Error "ERROR: $($_.Exception.Message)"
    exit 1
}
