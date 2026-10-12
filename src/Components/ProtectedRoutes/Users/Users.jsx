import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Form,
  Modal,
  Table,
} from "react-bootstrap";
import UserInvoices from "./UserInvoices";
import api from "../../../customhooks/axios";
import { setUser } from "../../../redux/Slices/LoginValuesSlice";

export default function Users() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.submitStore.user);
  const [detailUser, setDetailUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(null);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(0);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ username: "", email: "", FBRToken: "", Address: "", Province: "", NTNCNIC: "", role: "user" });
  const [editError, setEditError] = useState("");

  const openEditor = (user) => {
    setEditing(user);
    setDraft({ username: user.username || "", email: user.email || "", FBRToken: user.FBRToken || "", Address: user.Address || "", Province: user.Province || "", NTNCNIC: String(user.NTNCNIC ?? ""), role: user.role || "user" });
    setEditError("");
  };

  const saveUser = async (event) => {
    event.preventDefault();
    setBusy(editing._id);
    setEditError("");
    setNotice("");
    setError("");
    try {
      const { data } = await api.put(`admin/users/${editing._id}`, draft);
      setUsers((previous) => previous.map((user) => user._id === editing._id ? data.user : user));
      if (String(currentUser._id || currentUser.id) === editing._id) {
        dispatch(setUser({ ...currentUser, ...data.user }));
      }
      setNotice(data.message);
      setEditing(null);
    } catch (err) {
      setEditError(err.response?.data?.message || "Unable to update user. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    if (currentUser?.role !== "admin") return;
    let active = true;
    setLoading(true);
    setError("");
    api
      .get("admin/users")
      .then(({ data }) => {
        if (active) setUsers(data.users);
      })
      .catch((err) => {
        if (active)
          setError(
            err.response?.data?.message ||
              "Unable to load users. Please try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [currentUser?.role, reload]);

  if (currentUser?.role !== "admin") return <Navigate to="/home" replace />;

  const toggleBlocked = async (user) => {
    setBusy(user._id);
    setError("");
    setNotice("");
    try {
      const { data } = await api.patch(`admin/users/${user._id}/block`, {
        isBlocked: !user.isBlocked,
      });
      setUsers((previous) =>
        previous.map((item) => (item._id === user._id ? data.user : item)),
      );
      setNotice(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update user. Please try again.",
      );
    } finally {
      setBusy(null);
    }
  };

  const query = search.trim().toLowerCase();
  const filtered = users.filter((user) =>
    [user.username, user.email, user.BusinessName].some((value) =>
      value?.toLowerCase().includes(query),
    ),
  );
  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h2 style={{ color: "#0A5275" }}>Manage users</h2>
              <p className="text-muted mb-0">
                View registered accounts and control their access. Blocked users
                cannot sign in or use the application.
              </p>
            </div>
            <Button
              variant="outline-primary"
              disabled={loading || !!busy}
              onClick={() => setReload((value) => value + 1)}
            >
              Refresh
            </Button>
          </div>
          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}
          {notice && (
            <Alert variant="success" role="status">
              {notice}
            </Alert>
          )}
          <Form.Label htmlFor="user-search">Search users</Form.Label>
          <Form.Control
            id="user-search"
            className="mb-3"
            placeholder="Name, email or business"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {loading ? (
            <p role="status">Loading users…</p>
          ) : (
            <>
              <p className="text-muted">
                {filtered.length} of {users.length} users
              </p>
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Business</th>
                    <th>Seller details</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>FBR Token</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.username}</strong>
                        <div className="text-muted">{user.email}</div>
                      </td>
                      <td>{user.BusinessName}</td>
                      <td>
                        <div><strong>Address:</strong> {user.Address || "—"}</div>
                        <div><strong>Province:</strong> {user.Province || "—"}</div>
                        <div><strong>NTN/CNIC:</strong> {user.NTNCNIC ?? "—"}</div>
                      </td>
                      <td>{user.role || "user"}</td>
                      <td>
                        <Badge
                          bg={
                            user.isBlocked
                              ? "danger"
                              : user.paymentBlocked
                                ? "warning"
                                : "success"
                          }
                        >
                          {user.isBlocked
                            ? "Blocked"
                            : user.paymentBlocked
                              ? "Payment restricted"
                              : "Active"}
                        </Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-secondary" className="me-2" disabled={!!busy} onClick={() => setDetailUser(user)}>Detail</Button>
                        <Button size="sm" variant="outline-primary" className="me-2" disabled={!!busy} onClick={() => openEditor(user)}>
                          Edit
                        </Button>
                        {user.role === "admin" ? (
                          <span className="text-muted">
                            Protected administrator
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant={
                              user.isBlocked
                                ? "outline-success"
                                : "outline-danger"
                            }
                            disabled={!!busy}
                            onClick={() => toggleBlocked(user)}
                          >
                            {busy === user._id
                              ? "Saving…"
                              : user.isBlocked
                                ? "Unblock"
                                : "Block"}
                          </Button>
                        )}
                      </td>
                      <td>{user.FBRToken}</td>

                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        {query ? "No matching users." : "No users found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {users.some((user) => user.paymentBlocked) && (
                <p className="text-muted">
                  Payment restrictions are configured separately on the server.
                  Unblocking an account does not remove a payment restriction.
                </p>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      {detailUser && <UserInvoices user={detailUser} onClose={() => setDetailUser(null)} />}
      <Modal show={!!editing} onHide={() => !busy && setEditing(null)} backdrop={busy ? "static" : true} keyboard={!busy}>
        <Form onSubmit={saveUser}>
          <Modal.Header closeButton={!busy}>
            <Modal.Title>Edit user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <fieldset disabled={!!busy}>
              {[
                ["username", "User name", "text"],
                ["email", "Email", "email"],
                ["FBRToken", "FBR token", "text"],
                ["Address", "Seller address", "text"],
                ["Province", "Seller province", "text"],
                ["NTNCNIC", "Seller NTN/CNIC", "text"],
              ].map(([field, label, type]) => (
                <Form.Group className="mb-3" controlId={`edit-${field}`} key={field}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control type={type} required value={draft[field]} autoComplete="off" onChange={(event) => setDraft((previous) => ({ ...previous, [field]: event.target.value }))} />
                </Form.Group>
              ))}
              <Form.Group controlId="edit-role">
                <Form.Label>Role</Form.Label>
                <Form.Select value={draft.role} disabled={String(currentUser._id || currentUser.id) === editing?._id} onChange={(event) => setDraft((previous) => ({ ...previous, role: event.target.value }))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
                {String(currentUser._id || currentUser.id) === editing?._id && <Form.Text>You cannot remove your own administrator role.</Form.Text>}
              </Form.Group>
            </fieldset>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" disabled={!!busy} onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" disabled={!!busy}>{busy ? "Saving…" : "Save changes"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
