"""connect sql

Revision ID: 252ca86ddc70
Revises: 1cd72c670a04
Create Date: 2024-06-03 16:03:31.869621

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '252ca86ddc70'
down_revision = '1cd72c670a04'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('notifications')
    op.drop_table('categories')
    op.drop_table('accounts')
    op.drop_table('transactions')
    op.drop_table('users')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('username', sa.VARCHAR(length=20), nullable=False),
    sa.Column('email', sa.VARCHAR(length=255), nullable=False),
    sa.Column('is_active', sa.BOOLEAN(), nullable=True),
    sa.Column('role', sa.VARCHAR(length=255), nullable=False),
    sa.Column('account_type', sa.VARCHAR(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('transactions',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('amount', sa.INTEGER(), nullable=False),
    sa.Column('date', sa.DATETIME(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.Column('account_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['account_id'], ['accounts.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('accounts',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('number', sa.INTEGER(), nullable=False),
    sa.Column('balance', sa.INTEGER(), nullable=False),
    sa.Column('category_id', sa.INTEGER(), nullable=True),
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('categories',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('notifications',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('message', sa.VARCHAR(length=255), nullable=False),
    sa.Column('transaction_id', sa.INTEGER(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['transaction_id'], ['transactions.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
