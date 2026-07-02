import { useEffect, useState } from "react";
import "./InvoiceList.css";

const API_URL = "http://localhost:5000/api/invoices";
const symbol = (currency) => (currency === "NGN" ? "₦" : "$");

export default function InvoiceList({ refreshKey }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, [refreshKey]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this invoice? This can't be undone.")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const handleDownload = (id) => {
    window.open(`${API_URL}/${id}/pdf`, "_blank");
  };

  if (loading) return <p className="invoice-list-status">Loading invoices...</p>;
  if (invoices.length === 0) return <p className="invoice-list-status">No invoices yet — create your first one above.</p>;

  return (
    <div className="invoice-list">
      {invoices.map((inv) => (
        <div className="invoice-row" key={inv.id}>
          <div className="invoice-info">
            <span className="invoice-id mono">#{inv.id}</span>
            <span className="invoice-client">{inv.client_name}</span>
            <span className="invoice-date">{inv.issue_date}</span>
          </div>
          <div className="invoice-total mono">
            {symbol(inv.currency)}{inv.total.toLocaleString()}
          </div>
          <div className="invoice-actions">
            <button className="btn-ghost small" onClick={() => handleDownload(inv.id)}>
              Download PDF
            </button>
            <button className="delete-btn" onClick={() => handleDelete(inv.id)} title="Delete">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
