from fastapi import FastAPI

from app.api.routers.health import router as health_router
from app.api.routers.listings import router as listings_router


def create_app() -> FastAPI:
    app = FastAPI(title="Auto Buy Assistant API")
    app.include_router(health_router)
    app.include_router(listings_router, prefix="/listings", tags=["listings"])
    return app


app = create_app()
