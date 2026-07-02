import { useState } from "react";
import "./InvoiceForm.css";

const API_URL = "http://localhost:5000/api/invoices";

const emptyItem = () => ({ description: "", quantity: 1, unit_price: 0 });

export default function InvoiceForm({ onCreated }) {
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([emptyItem()]);
  const [status, setStatus] = useState("idle");

  const addItem = () => setItems([...items, emptyItem()]);

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0
  );

  const symbol = currency === "NGN" ? "₦" : "$";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName,
          business_email: businessEmail,
          client_name: clientName,
          client_email: clientEmail,
          due_date: dueDate,
          currency,
          notes,
          items,
        }),
      });

      if (!res.ok) throw new Error("Failed to save invoice");
      const invoice = await res.json();

      setStatus("idle");
      onCreated(invoice);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-section">
          <h3>Your business</h3>
          <input
            type="text" placeholder="Business name"
            value={businessName} onChange={(e) => setBusinessName(e.target.value)} required
          />
          <input
            type="email" placeholder="Business email (optional)"
            value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)}
          />
        </div>

        <div className="form-section">
          <h3>Bill to</h3>
          <input
            type="text" placeholder="Client name"
            value={clientName} onChange={(e) => setClientName(e.target.value)} required
          />
          <input
            type="email" placeholder="Client email (optional)"
            value={clientEmail} onChange={(e) => setClientEmail(e.target.value)}
          />
        </div>

        <div className="form-section">
          <h3>Details</h3>
          <label className="field-label mono">DUE DATE</label>
          <input
            type="date"
            value={dueDate} onChange={(e) => setDueDate(e.target.value)}
          />
          <label className="field-label mono">CURRENCY</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="NGN">₦ Naira</option>
            <option value="USD">$ Dollar</option>
          </select>
        </div>
      </div>

      <div className="items-section">
        <h3>Line items</h3>
        <div className="items-header">
          <span>Description</span>
          <span>Qty</span>
          <span>Unit price</span>
          <span>Total</span>
          <span></span>
        </div>

        {items.map((item, i) => (
          <div className="item-row" key={i}>
            <input
              type="text" placeholder="What are you charging for?"
              value={item.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              required
            />
            <input
              type="number" min="0" step="1"
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", e.target.value)}
            />
            <input
              type="number" min="0" step="0.01"
              value={item.unit_price}
              onChange={(e) => updateItem(i, "unit_price", e.target.value)}
            />
            <span className="line-total mono">
              {symbol}{((Number(item.quantity) || 0) * (Number(item.unit_price) || 0)).toLocaleString()}
            </span>
            <button
              type="button" className="remove-btn"
              onClick={() => removeItem(i)}
              disabled={items.length === 1}
              title="Remove this line"
            >
              ×
            </button>
          </div>
        ))}

        <button type="button" className="btn-ghost add-item-btn" onClick={addItem}>
          + Add line item
        </button>
      </div>

      <textarea
        className="notes-input"
        placeholder="Notes (optional) — payment terms, thank you message, etc."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows="3"
      />

      <div className="form-footer">
        <div className="total-display">
          <span className="mono">TOTAL</span>
          <span className="total-amount">{symbol}{total.toLocaleString()}</span>
        </div>
        <button type="submit" className="btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Generate invoice →"}
        </button>
      </div>

      {status === "error" && (
        <p className="form-error">
          Couldn't reach the server. Make sure the Flask backend is running (`python app.py` in /server).
        </p>
      )}
    </form>
  );
}
