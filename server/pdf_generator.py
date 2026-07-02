from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import io

CURRENCY_SYMBOLS = {"NGN": "₦", "USD": "$"}


def generate_invoice_pdf(invoice):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    symbol = CURRENCY_SYMBOLS.get(invoice.currency, invoice.currency)

    y = height - 30 * mm

    c.setFont("Helvetica-Bold", 20)
    c.drawString(20 * mm, y, invoice.business_name)
    y -= 8 * mm

    c.setFont("Helvetica", 10)
    if invoice.business_email:
        c.drawString(20 * mm, y, invoice.business_email)
        y -= 10 * mm

    c.setFont("Helvetica-Bold", 14)
    c.drawRightString(width - 20 * mm, height - 30 * mm, f"INVOICE #{invoice.id}")

    y -= 6 * mm
    c.setFont("Helvetica-Bold", 11)
    c.drawString(20 * mm, y, "Billed to:")
    y -= 6 * mm
    c.setFont("Helvetica", 10)
    c.drawString(20 * mm, y, invoice.client_name)
    y -= 5 * mm
    if invoice.client_email:
        c.drawString(20 * mm, y, invoice.client_email)
        y -= 5 * mm

    c.drawRightString(width - 20 * mm, y + 10 * mm, f"Issue date: {invoice.issue_date}")
    if invoice.due_date:
        c.drawRightString(width - 20 * mm, y + 5 * mm, f"Due date: {invoice.due_date}")

    y -= 12 * mm

    c.setFillColorRGB(0.1, 0.1, 0.1)
    c.rect(20 * mm, y - 2 * mm, width - 40 * mm, 8 * mm, fill=True, stroke=False)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(22 * mm, y, "DESCRIPTION")
    c.drawString(120 * mm, y, "QTY")
    c.drawString(140 * mm, y, "UNIT PRICE")
    c.drawRightString(width - 22 * mm, y, "TOTAL")
    y -= 10 * mm

    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica", 9)
    for item in invoice.items:
        c.drawString(22 * mm, y, item.description[:55])
        c.drawString(120 * mm, y, str(item.quantity))
        c.drawString(140 * mm, y, f"{symbol}{item.unit_price:,.2f}")
        line_total = item.quantity * item.unit_price
        c.drawRightString(width - 22 * mm, y, f"{symbol}{line_total:,.2f}")
        y -= 7 * mm

        if y < 40 * mm:
            c.showPage()
            y = height - 30 * mm

    y -= 6 * mm
    c.line(20 * mm, y, width - 20 * mm, y)
    y -= 8 * mm
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(width - 22 * mm, y, f"Total: {symbol}{invoice.total():,.2f}")

    if invoice.notes:
        y -= 15 * mm
        c.setFont("Helvetica-Oblique", 9)
        c.drawString(20 * mm, y, "Notes:")
        y -= 5 * mm
        c.setFont("Helvetica", 9)
        c.drawString(20 * mm, y, invoice.notes[:100])

    c.save()
    buffer.seek(0)
    return buffer
