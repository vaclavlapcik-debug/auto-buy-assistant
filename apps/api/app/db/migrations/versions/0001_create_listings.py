"""create listings and scoring_results tables

Revision ID: 0001_create_listings
Revises: 
Create Date: 2024-10-06 00:00:00

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0001_create_listings"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "listings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("source", sa.Enum("AUTOSCOUT24", "MOBILE_DE", "SAUTO", "OTHER", name="source"), nullable=False),
        sa.Column("raw_payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column("price_amount", sa.Numeric(12, 2), nullable=True),
        sa.Column("price_currency", sa.String(length=3), nullable=True),
        sa.Column("mileage_km", sa.Integer(), nullable=True),
        sa.Column("first_registration", sa.Date(), nullable=True),
        sa.Column("brand", sa.String(), nullable=True),
        sa.Column("model", sa.String(), nullable=True),
        sa.Column("variant", sa.String(), nullable=True),
        sa.Column("battery_kwh", sa.Numeric(6, 2), nullable=True),
        sa.Column("drive", sa.String(), nullable=True),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "scoring_results",
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("total_score", sa.Integer(), nullable=False),
        sa.Column("breakdown", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.ForeignKeyConstraint(["listing_id"], ["listings.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    op.drop_table("scoring_results")
    op.drop_table("listings")
    op.execute("DROP TYPE IF EXISTS source")
