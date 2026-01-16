from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.db.base import Base
from app.db.types import GUID
from app.domain.models import Source


class ListingModel(Base):
    __tablename__ = "listings"

    id: Mapped[str] = mapped_column(GUID(), primary_key=True, default=uuid4)
    source: Mapped[Source] = mapped_column(Enum(Source), nullable=False)
    raw_payload: Mapped[dict] = mapped_column(
        JSONB().with_variant(JSON, "sqlite"), nullable=False
    )
    title: Mapped[str | None] = mapped_column(String, nullable=True)
    price_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    price_currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    mileage_km: Mapped[int | None] = mapped_column(Integer, nullable=True)
    first_registration: Mapped[date | None] = mapped_column(Date, nullable=True)
    brand: Mapped[str | None] = mapped_column(String, nullable=True)
    model: Mapped[str | None] = mapped_column(String, nullable=True)
    variant: Mapped[str | None] = mapped_column(String, nullable=True)
    battery_kwh: Mapped[Decimal | None] = mapped_column(Numeric(6, 2), nullable=True)
    drive: Mapped[str | None] = mapped_column(String, nullable=True)
    notes: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    score: Mapped["ScoringResultModel"] = relationship(
        back_populates="listing", uselist=False, cascade="all, delete-orphan"
    )


class ScoringResultModel(Base):
    __tablename__ = "scoring_results"

    listing_id: Mapped[str] = mapped_column(
        GUID(), ForeignKey("listings.id", ondelete="CASCADE"), primary_key=True
    )
    total_score: Mapped[int] = mapped_column(Integer, nullable=False)
    breakdown: Mapped[dict] = mapped_column(
        JSONB().with_variant(JSON, "sqlite"), nullable=False
    )

    listing: Mapped[ListingModel] = relationship(back_populates="score")
