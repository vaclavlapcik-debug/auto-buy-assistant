from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class Source(str, Enum):
    AUTOSCOUT24 = "AUTOSCOUT24"
    MOBILE_DE = "MOBILE_DE"
    SAUTO = "SAUTO"
    OTHER = "OTHER"


class Money(BaseModel):
    currency: str = "EUR"
    amount: Decimal


class Mileage(BaseModel):
    km: int


class Vehicle(BaseModel):
    brand: str | None = None
    model: str | None = None
    variant: str | None = None
    drive: str | None = None


class EVSpecs(BaseModel):
    battery_kwh: Decimal | None = None


class Listing(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    source: Source
    raw_payload: dict[str, Any]
    title: str | None = None
    price: Money | None = None
    mileage: Mileage | None = None
    first_registration: date | None = None
    brand: str | None = None
    model: str | None = None
    variant: str | None = None
    battery_kwh: Decimal | None = None
    drive: str | None = None
    notes: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ScoringResult(BaseModel):
    listing_id: UUID
    total_score: int
    breakdown: dict[str, Any]
