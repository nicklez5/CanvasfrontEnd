// src/pages/StaffAssignmentSubmissions.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Table, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";

const StaffAssignmentSubmissions = () => {
  const { assignmentId } = useParams();

  const submissions = useStoreState((s) => s.submissionStore.assignmentSubmissions);
  const loading     = useStoreState((s) => s.submissionStore.loading);
  const error       = useStoreState((s) => s.submissionStore.error);

  const fetchSubs  = useStoreActions((a) => a.submissionStore.fetchAssignmentSubmissions);
  const gradeSub   = useStoreActions((a) => a.submissionStore.gradeAssignmentSubmission);

  // Grading modal state
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [score, setScore]         = useState("");
  const [feedback, setFeedback]   = useState("");

  useEffect(() => {
    fetchSubs(assignmentId);
  }, [assignmentId, fetchSubs]);

  const openGrade = (sub) => {
    setSelected(sub);
    setScore(sub.student_points || "");
    setFeedback(sub.feedback || "");
    setShowModal(true);
  };

  const handleGrade = async () => {
    if (!selected) return;
    const data = {
      student_points: parseInt(score, 10),
      feedback: feedback,
    };
    const result = await gradeSub({ submissionId: selected.id, data: data });
    if (result.success) {
      await fetchSubs(assignmentId);
      setShowModal(false);
      setSelected(null);
    }
  };

  if (loading) {
    return <div className="text-center my-5"><Spinner animation="border" /></div>;
  }
  if (error) {
    return <Alert variant="danger">{JSON.stringify(error)}</Alert>;
  }

  return (
    <div className="graded_assignments">
      <h2>Assignment #{assignmentId} Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <Table responsive="xl" hover bordered variant="dark">
          <thead>
            <tr>
              <th>Student</th>
              <th>Submitted At</th>
              <th>File</th>
              <th className="text-end">Score</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.student_username}</td>
                <td>{new Date(sub.submitted_at).toLocaleString()}</td>
                <td>
                  <a
                    href={`${sub.student_file}`}
                    target="_blank"
                    style={{color: "white"}}
                  >
                    Download
                  </a>
                </td>
                <td className="text-end">
                  {sub.student_points != null ? sub.student_points : "—"}
                </td>
                <td>{sub.feedback || "—"}</td>
                <td>
                  <Button size="sm" onClick={() => openGrade(sub)} variant="outline-primary">
                    {sub.student_points != null ? "Re-Grade" : "Grade"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Grade Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Grade Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <Form>
              <Form.Group controlId="gradeScore" className="mb-3">
                <Form.Label>
                  Points (0 – {selected.assignment_max_points || selected.assignment.max_points})
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={selected.assignment_max_points || selected.assignment.max_points}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="gradeFeedback" className="mb-3">
                <Form.Label>Feedback (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGrade}>
            Save Grade
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffAssignmentSubmissions;
