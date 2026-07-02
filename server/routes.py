from flask import Blueprint, request, jsonify, send_file
from models import db, Invoice, LineItem
from pdf_generator import generate_invoice_pdf

api = Blueprint("api", __name__)


@api.route("/invoices", methods=["POST"])
def create_invoice():
    data = request.get_json()

    required = ["business_name", "client_name", "items"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    if len(data["items"]) == 0:
        return jsonify({"error": "At least one line item is required"}), 400

    invoice = Invoice(
        business_name=data["business_name"],
        business_email=data.get("business_email"),
        client_name=data["client_name"],
        client_email=data.get("client_email"),
        due_date=data.get("due_date"),
        currency=data.get("currency", "NGN"),
        notes=data.get("notes"),
    )

    for item_data in data["items"]:
        item = LineItem(
            description=item_data.get("description", ""),
            quantity=float(item_data.get("quantity", 1)),
            unit_price=float(item_data.get("unit_price", 0)),
        )
        invoice.items.append(item)

    db.session.add(invoice)
    db.session.commit()

    return jsonify(invoice.to_dict()), 201


@api.route("/invoices", methods=["GET"])
def list_invoices():
    invoices = Invoice.query.order_by(Invoice.created_at.desc()).all()
    return jsonify([inv.to_dict() for inv in invoices])


@api.route("/invoices/<int:invoice_id>", methods=["GET"])
def get_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    return jsonify(invoice.to_dict())


@api.route("/invoices/<int:invoice_id>", methods=["DELETE"])
def delete_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    db.session.delete(invoice)
    db.session.commit()
    return jsonify({"success": True})


@api.route("/invoices/<int:invoice_id>/pdf", methods=["GET"])
def download_invoice_pdf(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    pdf_buffer = generate_invoice_pdf(invoice)
    return send_file(
        pdf_buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"invoice-{invoice.id}.pdf",
    )
