from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas import IngestRequest, ListingResponse
from app.db.models import ListingModel
from app.db.session import get_session
from app.domain.scoring import score_listing
from app.services.ingest import persist_listing, to_listing_domain, to_score_domain
from app.services.normalization import normalize_listing

router = APIRouter()


@router.post("/ingest", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def ingest_listing(
    payload: IngestRequest,
    session: Session = Depends(get_session),
) -> ListingResponse:
    listing = normalize_listing(payload.source, payload.raw)
    score = score_listing(listing)
    persist_listing(session, listing, score)
    return ListingResponse(listing=listing, score=score)


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: UUID,
    session: Session = Depends(get_session),
) -> ListingResponse:
    listing_record = session.get(ListingModel, listing_id)
    if not listing_record:
        raise HTTPException(status_code=404, detail="Listing not found")
    if not listing_record.score:
        raise HTTPException(status_code=404, detail="Score not found")
    listing = to_listing_domain(listing_record)
    score = to_score_domain(listing_record.score)
    return ListingResponse(listing=listing, score=score)
