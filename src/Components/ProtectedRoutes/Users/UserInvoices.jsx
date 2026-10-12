import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import api from "../../../customhooks/axios";

export default function UserInvoices({ user, onClose }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ invoiceDate: "", dcNo: "", invoiceNo: "", sellerAddress: "", sellerProvince: "", sellerNTNCNIC: "" });
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.get(`admin/users/${user._id}/invoices`)
      .then(({ data }) => { if (active) setInvoices(data.invoices); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load invoices. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user._id, reload]);

  const editInvoice = (invoice) => {
    setEditing(invoice._id);
    setDraft({ invoiceDate: invoice.invoiceDate?.slice(0, 10) || "", dcNo: invoice.dcNo || "", invoiceNo: invoice.invoiceNo || "", sellerAddress: invoice.sellerAddress || "", sellerProvince: invoice.sellerProvince || "", sellerNTNCNIC: invoice.sellerNTNCNIC || "" });
    setNotice("");
    setError("");
  };

  const saveInvoice = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.put(`admin/users/${user._id}/invoices/${editing}`, draft);
      setInvoices((previous) => previous.map((invoice) => invoice._id === editing ? data.invoice : invoice));
      setEditing(null);
      setNotice(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={() => !saving && onClose()} size="xl" backdrop={saving ? "static" : true} keyboard={!saving}>
      <Modal.Header closeButton={!saving}>
        <Modal.Title>Invoices — {user.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">{user.BusinessName} · {user.email}</p>
        {error && <Alert variant="danger">{error}</Alert>}
        {notice && <Alert variant="success" role="status">{notice}</Alert>}
        {editing && (
          <Form onSubmit={saveInvoice} className="border rounded p-3 mb-3">
            <h5>Edit invoice</h5>
            <fieldset disabled={saving}>
              <div className="row">
                {[["invoiceDate", "Invoice date", "date"], ["dcNo", "DC number", "text"], ["invoiceNo", "Invoice number", "text"], ["sellerAddress", "Seller address", "text"], ["sellerProvince", "Seller province", "text"], ["sellerNTNCNIC", "Seller NTN/CNIC", "text"]].map(([field, label, type]) => (
                  <Form.Group key={field} controlId={`invoice-${field}`} className="col-md-4 mb-3">
                    <Form.Label>{label}</Form.Label>
                    <Form.Control type={type} required={field === "invoiceDate" || field.startsWith("seller")} value={draft[field]} onChange={(event) => setDraft((previous) => ({ ...previous, [field]: event.target.value }))} />
                  </Form.Group>
                ))}
              </div>
              <Button type="submit" className="me-2">{saving ? "Saving…" : "Save changes"}</Button>
              <Button variant="secondary" onClick={() => { setEditing(null); setError(""); }}>Cancel</Button>
            </fieldset>
          </Form>
        )}
        {loading ? <p role="status">Loading invoices…</p> : (
          <>
            <p className="text-muted">{invoices.length} invoices</p>
            <Table responsive hover className="align-middle">
              <thead><tr><th>Invoice number</th><th>Invoice date</th><th>DC number</th><th>Seller address</th><th>Seller province</th><th>Seller NTN/CNIC</th><th>Buyer</th><th>Total</th><th>Action</th></tr></thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.invoiceNo || "—"}</td><td>{invoice.invoiceDate?.slice(0, 10) || "—"}</td><td>{invoice.dcNo || "—"}</td>
                    <td>{invoice.sellerAddress || "—"}</td><td>{invoice.sellerProvince || "—"}</td><td>{invoice.sellerNTNCNIC || "—"}</td>
                    <td>{invoice.buyerBusinessName}</td><td>{invoice.grandTotal?.toLocaleString() ?? "—"}</td>
                    <td><Button size="sm" variant="outline-primary" disabled={!!editing || saving} onClick={() => editInvoice(invoice)}>Edit</Button></td>
                  </tr>
                ))}
                {!invoices.length && !error && <tr><td colSpan={9} className="text-center py-4">No invoices found for this user.</td></tr>}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" disabled={loading || !!editing || saving} onClick={() => setReload((value) => value + 1)}>Refresh</Button>
        <Button variant="secondary" disabled={saving} onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
