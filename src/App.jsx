import { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import InvoicePreview from "./components/InvoicePreview";
import "./App.css";

const API_URL = "http://localhost:5000/api/invoices";

export default function App() {
  const [newInvoice, setNewInvoice] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = (invoice) => {
    setNewInvoice(invoice);
    setRefreshKey((k) => k + 1);
  };

  const handleDownload = (id) => {
    window.open(`${API_URL}/${id}/pdf`, "_blank");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="wrap">
          <h1>Invoice Generator</h1>
          <p>Create a professional invoice, save it, and download it as a PDF.</p>
        </div>
      </header>

      <main className="wrap app-main">
        <section>
          <h2 className="section-title">New invoice</h2>
          <InvoiceForm onCreated={handleCreated} />
        </section>

        <section>
          <h2 className="section-title">Past invoices</h2>
          <InvoiceList refreshKey={refreshKey} />
        </section>
      </main>

      <InvoicePreview
        invoice={newInvoice}
        onClose={() => setNewInvoice(null)}
        onDownload={handleDownload}
      />
    </div>
  );
}
