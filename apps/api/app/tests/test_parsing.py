from datetime import date
from decimal import Decimal

from app.services.normalization import parse_mileage, parse_price, parse_registration


def test_parse_price_with_currency() -> None:
    money = parse_price("17 990 €")
    assert money is not None
    assert money.amount == Decimal("17990")


def test_parse_mileage_with_units() -> None:
    mileage = parse_mileage("125 348 km")
    assert mileage is not None
    assert mileage.km == 125_348


def test_parse_registration_month_year() -> None:
    registration = parse_registration("09/2021")
    assert registration == date(2021, 9, 1)
