from __future__ import annotations

import re
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any

from app.domain.models import Listing, Mileage, Money, Source

PRICE_KEYS = ("price", "price_eur", "amount")
MILEAGE_KEYS = ("km", "mileage", "kilometers")
REGISTRATION_KEYS = ("first_registration", "registration")


def _clean_numeric(value: str) -> str:
    return re.sub(r"[^\d,\.]", "", value)


def parse_price(value: Any) -> Money | None:
    if value is None:
        return None
    if isinstance(value, (int, float, Decimal)):
        return Money(amount=Decimal(str(value)))
    if not isinstance(value, str):
        return None
    cleaned = _clean_numeric(value)
    if not cleaned:
        return None
    normalized = cleaned.replace(".", "").replace(",", "")
    try:
        return Money(amount=Decimal(normalized))
    except InvalidOperation:
        return None


def parse_mileage(value: Any) -> Mileage | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return Mileage(km=int(value))
    if not isinstance(value, str):
        return None
    cleaned = _clean_numeric(value)
    if not cleaned:
        return None
    normalized = cleaned.replace(".", "").replace(",", "")
    try:
        return Mileage(km=int(normalized))
    except ValueError:
        return None


def parse_registration(value: Any) -> date | None:
    if not isinstance(value, str):
        return None
    match = re.match(r"^(?P<month>\d{1,2})[./-](?P<year>\d{4})$", value.strip())
    if not match:
        return None
    month = int(match.group("month"))
    year = int(match.group("year"))
    if month < 1 or month > 12:
        return None
    return date(year, month, 1)


def _first_present(raw: dict[str, Any], keys: tuple[str, ...]) -> Any:
    for key in keys:
        if key in raw:
            return raw[key]
    return None


def normalize_listing(source: Source, raw: dict[str, Any]) -> Listing:
    price = parse_price(_first_present(raw, PRICE_KEYS))
    mileage = parse_mileage(_first_present(raw, MILEAGE_KEYS))
    first_registration = parse_registration(_first_present(raw, REGISTRATION_KEYS))

    return Listing(
        source=source,
        raw_payload=raw,
        title=raw.get("title"),
        price=price,
        mileage=mileage,
        first_registration=first_registration,
        brand=raw.get("brand"),
        model=raw.get("model"),
        variant=raw.get("variant"),
        battery_kwh=_parse_decimal(raw.get("battery_kwh")),
        drive=raw.get("drive"),
        notes=raw.get("notes"),
    )


def _parse_decimal(value: Any) -> Decimal | None:
    if value is None:
        return None
    if isinstance(value, Decimal):
        return value
    if isinstance(value, (int, float)):
        return Decimal(str(value))
    if isinstance(value, str):
        cleaned = _clean_numeric(value)
        if not cleaned:
            return None
        normalized = cleaned.replace(",", ".")
        try:
            return Decimal(normalized)
        except InvalidOperation:
            return None
    return None
