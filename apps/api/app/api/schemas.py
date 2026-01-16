from __future__ import annotations

from typing import Any

from pydantic import BaseModel

from app.domain.models import Listing, ScoringResult, Source


class IngestRequest(BaseModel):
    source: Source
    raw: dict[str, Any]


class ListingResponse(BaseModel):
    listing: Listing
    score: ScoringResult
