import React , {useState,useEffect} from 'react'
import api from '../api/courses'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useNavigate } from 'react-router-dom'
import {Container,Form,Button,Spinner,Alert,Row,Col } from "react-bootstrap";
const UserSettings = () => {
  const user = useStoreState((state) => state.userStore.user)
  const setUser = useStoreActions((s) => s.userStore.setUser)
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
   useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
  }, [user]);
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess("");
    if (!username.trim() || !email.trim()) {
      setProfileError("Username and email cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const resp = await api.patch("/users/detail/", {
        username: username.trim(),
        email: email.trim(),
      });
      setUser(resp.data)
      // Update store’s user with the fresh data
      // (you’ll need a store action like userStore.setUser(resp.data))
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      const msg = err.response?.data || err.message;
      setProfileError(msg);
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess("");

    if (newPassword !== confirmNewPassword) {
      setPwdError("New password and confirmation must match.");
      return;
    }
    if (!currentPassword || !newPassword) {
      setPwdError("Please fill out both password fields.");
      return;
    }

    setPwdLoading(true);
    try {
      const resp = await api.post("/users/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      setPwdSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      const msg = err.response?.data || err.message;
      setPwdError(msg);
    } finally {
      setPwdLoading(false);
    }
  };
  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">User Settings</h2>

      {/* ────────── PROFILE SECTION ────────── */}
      <Form onSubmit={handleProfileSubmit} className="mb-5">
        <h4>Edit Profile</h4>

        {profileError && (
          <Alert variant="danger" className="mb-3">
            {typeof profileError === "string"
              ? profileError
              : JSON.stringify(profileError)}
          </Alert>
        )}
        {profileSuccess && (
          <Alert variant="success" className="mb-3">
            {profileSuccess}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Form.Group controlId="pk" className="mb-3">
              <Form.Label>PK (User ID)</Form.Label>
              <Form.Control type="text" readOnly defaultValue={user.pk} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="role" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                readOnly
                defaultValue={user.is_staff ? "Staff" : "Student"}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{width: "200px"}} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Form>

      {/* ────────── PASSWORD SECTION ────────── */}
      <Form onSubmit={handlePasswordSubmit}>
        <h4>Change Password</h4>

        {pwdError && (
          <Alert variant="danger" className="mb-3">
            {typeof pwdError === "string" ? pwdError : JSON.stringify(pwdError)}
          </Alert>
        )}
        {pwdSuccess && (
          <Alert variant="success" className="mb-3">
            {pwdSuccess}
          </Alert>
        )}

        <Form.Group controlId="currentPassword" className="mb-3">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="newPassword" className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmNewPassword" className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="outline-primary" type="submit" style={{width: "200px"}} disabled={pwdLoading}>
          {pwdLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Changing…
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default UserSettings