import "./InvoicePreview.css";

const symbol = (currency) => (currency === "NGN" ? "₦" : "$");

export default function InvoicePreview({ invoice, onClose, onDownload }) {
  if (!invoice) return null;

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-card" onClick={(e) => e.stopPropagation()}>
        <button className="preview-close" onClick={onClose}>×</button>

        <div className="preview-header">
          <div>
            <h2>{invoice.business_name}</h2>
            {invoice.business_email && <p className="dim">{invoice.business_email}</p>}
          </div>
          <div className="preview-invoice-num mono">INVOICE #{invoice.id}</div>
        </div>

        <div className="preview-meta">
          <div>
            <span className="mono label">BILLED TO</span>
            <p>{invoice.client_name}</p>
            {invoice.client_email && <p className="dim">{invoice.client_email}</p>}
          </div>
          <div className="preview-dates">
            <p><span className="mono label">ISSUED</span> {invoice.issue_date}</p>
            {invoice.due_date && <p><span className="mono label">DUE</span> {invoice.due_date}</p>}
          </div>
        </div>

        <table className="preview-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{symbol(invoice.currency)}{item.unit_price.toLocaleString()}</td>
                <td>{symbol(invoice.currency)}{item.line_total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="preview-total">
          <span>Total</span>
          <span className="preview-total-amount">{symbol(invoice.currency)}{invoice.total.toLocaleString()}</span>
        </div>

        {invoice.notes && <p className="preview-notes">{invoice.notes}</p>}

        <div className="preview-actions">
          <button className="btn-primary" onClick={() => onDownload(invoice.id)}>Download PDF →</button>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
