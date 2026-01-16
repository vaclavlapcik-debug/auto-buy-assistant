from fastapi.testclient import TestClient


def test_ingest_listing(client: TestClient) -> None:
    payload = {
        "source": "AUTOSCOUT24",
        "raw": {
            "price": "17 990 €",
            "km": "125 348 km",
            "first_registration": "09/2021",
            "title": "Skoda Enyaq 60 62kWh",
            "brand": "Skoda",
            "model": "Enyaq",
            "battery_kwh": "62",
        },
    }

    response = client.post("/listings/ingest", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["listing"]["source"] == "AUTOSCOUT24"
    assert data["listing"]["price"]["amount"] == "17990"
    assert data["score"]["total_score"] >= 0

    listing_id = data["listing"]["id"]
    follow_up = client.get(f"/listings/{listing_id}")
    assert follow_up.status_code == 200
