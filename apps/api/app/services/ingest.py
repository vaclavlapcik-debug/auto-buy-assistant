from __future__ import annotations

from sqlalchemy.orm import Session

from app.db.models import ListingModel, ScoringResultModel
from app.domain.models import Listing, ScoringResult


def persist_listing(session: Session, listing: Listing, score: ScoringResult) -> None:
    listing_record = ListingModel(
        id=listing.id,
        source=listing.source,
        raw_payload=listing.raw_payload,
        title=listing.title,
        price_amount=listing.price.amount if listing.price else None,
        price_currency=listing.price.currency if listing.price else None,
        mileage_km=listing.mileage.km if listing.mileage else None,
        first_registration=listing.first_registration,
        brand=listing.brand,
        model=listing.model,
        variant=listing.variant,
        battery_kwh=listing.battery_kwh,
        drive=listing.drive,
        notes=listing.notes,
        created_at=listing.created_at,
    )
    score_record = ScoringResultModel(
        listing_id=listing.id,
        total_score=score.total_score,
        breakdown=score.breakdown,
    )
    listing_record.score = score_record
    session.add(listing_record)


def to_listing_domain(model: ListingModel) -> Listing:
    return Listing(
        id=model.id,
        source=model.source,
        raw_payload=model.raw_payload,
        title=model.title,
        price=(
            None
            if model.price_amount is None
            else {
                "amount": model.price_amount,
                "currency": model.price_currency or "EUR",
            }
        ),
        mileage=(None if model.mileage_km is None else {"km": model.mileage_km}),
        first_registration=model.first_registration,
        brand=model.brand,
        model=model.model,
        variant=model.variant,
        battery_kwh=model.battery_kwh,
        drive=model.drive,
        notes=model.notes,
        created_at=model.created_at,
    )


def to_score_domain(model: ScoringResultModel) -> ScoringResult:
    return ScoringResult(
        listing_id=model.listing_id,
        total_score=model.total_score,
        breakdown=model.breakdown,
    )
