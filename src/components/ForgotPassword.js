import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Assume your Easy Peasy store has a thunk called sendPasswordResetEmail
  // which calls POST /users/forgot-password/ { email: ... } on your backend.
  const forgotPassword = useStoreActions(
    (actions) => actions.userStore.forgotPassword
  );
  const { loading, error } = useStoreState((state) => state.userStore);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      console.error('Error sending reset email:', err);
    }
  };

  // If the user already clicked Submit and we got no error, show a confirmation message
  if (submitted && !error) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="alert alert-success text-center">
              If an account with <strong>{email}</strong> exists, you will receive an
              email with instructions to reset your password.
            </div>
            <div className="text-center">
              <Link to="/login" className="btn btn-link">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{paddingTop: "120px"}}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-3 text-center">Forgot Password</h2>
              <p className="text-center text-muted mb-4">
                Enter your email to receive a password reset link.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label" style={{left: "20px"}}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    style={{position: "relative", left: "150px"}}
                    className="btn btn-primary btn-reset"
                    disabled={loading}
                  >
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
