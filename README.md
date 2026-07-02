# Invoice Generator

Full-stack invoice tool. React frontend, Flask + SQLAlchemy backend, PDF export with reportlab.

## Stack

- React (Vite)
- Flask + SQLAlchemy (SQLite)
- reportlab for PDF generation

## Setup

Frontend:
```bash
npm install
npm run dev
```

Backend:
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## API

| Method | Route                     | Description            |
|--------|----------------------------|-------------------------|
| POST   | `/api/invoices`             | Create an invoice       |
| GET    | `/api/invoices`             | List all invoices       |
| GET    | `/api/invoices/<id>`        | Get one invoice         |
| GET    | `/api/invoices/<id>/pdf`    | Download invoice as PDF |
| DELETE | `/api/invoices/<id>`        | Delete an invoice       |

## Notes

- Each invoice stores its own currency (₦ or $).
- SQLite database (`invoices.db`) is created automatically on first run and is gitignored — every clone starts fresh.
