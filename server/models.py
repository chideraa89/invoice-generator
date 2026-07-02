from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)

    business_name = db.Column(db.String(120), nullable=False)
    business_email = db.Column(db.String(120))

    client_name = db.Column(db.String(120), nullable=False)
    client_email = db.Column(db.String(120))

    issue_date = db.Column(db.String(20), default=lambda: datetime.now().strftime("%Y-%m-%d"))
    due_date = db.Column(db.String(20))

    currency = db.Column(db.String(3), default="NGN")
    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.now)

    items = db.relationship("LineItem", backref="invoice", cascade="all, delete-orphan")

    def total(self):
        return sum(item.quantity * item.unit_price for item in self.items)

    def to_dict(self):
        return {
            "id": self.id,
            "business_name": self.business_name,
            "business_email": self.business_email,
            "client_name": self.client_name,
            "client_email": self.client_email,
            "issue_date": self.issue_date,
            "due_date": self.due_date,
            "currency": self.currency,
            "notes": self.notes,
            "total": self.total(),
            "items": [item.to_dict() for item in self.items],
        }


class LineItem(db.Model):
    __tablename__ = "line_items"

    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey("invoices.id"), nullable=False)

    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Float, default=1)
    unit_price = db.Column(db.Float, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "line_total": self.quantity * self.unit_price,
        }
