from decimal import Decimal

from app.domain.models import Listing, Money, Mileage, Source
from app.domain.scoring import score_listing


def test_score_listing_with_strong_details() -> None:
    listing = Listing(
        source=Source.AUTOSCOUT24,
        raw_payload={},
        title="Skoda Enyaq 60",
        price=Money(amount=Decimal("17990")),
        mileage=Mileage(km=50_000),
        battery_kwh=Decimal("62"),
        brand="Skoda",
        model="Enyaq",
    )

    score = score_listing(listing)

    assert 0 <= score.total_score <= 100
    assert score.breakdown["price_adjustment"] >= 0
    assert score.breakdown["battery_adjustment"] >= 0
