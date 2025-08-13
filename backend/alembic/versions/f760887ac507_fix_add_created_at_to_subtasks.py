"""fix_add_created_at_to_subtasks

Revision ID: f760887ac507
Revises: b0f70c7f38d1
Create Date: 2025-08-13 07:57:37.697421

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f760887ac507'
down_revision: Union[str, Sequence[str], None] = 'b0f70c7f38d1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
