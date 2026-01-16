from __future__ import annotations

from decimal import Decimal

from app.domain.models import Listing, ScoringResult


def score_listing(listing: Listing) -> ScoringResult:
    score = 50
    breakdown: dict[str, int | str] = {}

    price_score = _score_price(listing)
    score += price_score
    breakdown["price_adjustment"] = price_score

    mileage_score = _score_mileage(listing)
    score += mileage_score
    breakdown["mileage_adjustment"] = mileage_score

    battery_score = _score_battery(listing)
    score += battery_score
    breakdown["battery_adjustment"] = battery_score

    missing_penalty = _missing_fields_penalty(listing)
    score += missing_penalty
    breakdown["missing_fields"] = missing_penalty

    score = max(0, min(100, score))

    return ScoringResult(
        listing_id=listing.id,
        total_score=score,
        breakdown=breakdown,
    )


def _score_price(listing: Listing) -> int:
    if not listing.price:
        return -5
    amount = listing.price.amount
    if amount <= Decimal("15000"):
        return 10
    if amount <= Decimal("20000"):
        return 5
    if amount <= Decimal("30000"):
        return 0
    if amount <= Decimal("40000"):
        return -5
    return -10


def _score_mileage(listing: Listing) -> int:
    if not listing.mileage:
        return -3
    km = listing.mileage.km
    if km > 160_000:
        return -12
    if km > 120_000:
        return -8
    if km > 80_000:
        return -4
    return 2


def _score_battery(listing: Listing) -> int:
    if listing.battery_kwh is None:
        return 0
    if listing.battery_kwh >= Decimal("80"):
        return 8
    if listing.battery_kwh >= Decimal("60"):
        return 5
    return 0


def _missing_fields_penalty(listing: Listing) -> int:
    missing = 0
    for field in (listing.title, listing.brand, listing.model):
        if not field:
            missing += 1
    if listing.price is None:
        missing += 1
    if listing.mileage is None:
        missing += 1
    if listing.first_registration is None:
        missing += 1
    return -2 * missing
