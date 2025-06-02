// src/pages/GradeAssignment.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";

const GradeAssignment = () => {
  const { assignmentID, courseID } = useParams();
  const navigate = useNavigate();

  // ─── Easy Peasy actions & thunks ───────────────────────────────────────────
  const fetchAssignment = useStoreActions(
    (actions) => actions.assignmentStore.fetchAssignment
  );
  const gradeAssignment = useStoreActions(
    (actions) => actions.assignmentStore.gradeAssignment
  );
  const { updateAssignmentInCourse } = useStoreActions(
    (actions) => actions.courseStore
  );

  // ─── Selector for reading the assignment from store ─────────────────────────
  const assignment = useStoreState((state) =>
    state.assignmentStore.assignment
  );

  // ─── Local component state ─────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [studentPoints, setStudentPoints] = useState("");
  const [saving, setSaving] = useState(false);

  // ─── Fetch assignment on mount ───────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchAssignment(assignmentID);
      setLoading(false);
    };
    load();
  }, [fetchAssignment, assignmentID]);

  // ─── Once assignment is loaded, prefill `studentPoints` ──────────────────────
  useEffect(() => {
    if (assignment && assignment.student_points != null) {
      setStudentPoints(assignment.student_points.toString());
    }
  }, [assignment]);

  // ─── Handler for changing the grade input ────────────────────────────────────
  const handlePointsChange = (e) => setStudentPoints(e.target.value);

  // ─── Form submission (send updated points) ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validation: must be a number, ≤ max_points
    const pts = parseInt(studentPoints, 10);
    if (isNaN(pts) || pts < 0) {
      setErrorMsg("Please enter a valid non‐negative number for points.");
      return;
    }
    if (assignment && pts > assignment.max_points) {
      setErrorMsg(`Points cannot exceed max points (${assignment.max_points}).`);
      return;
    }

   const payload = {
    studentData: { student_points: pts },
    course_id: courseID,
    assignmentID,
    courseStoreActions: { updateAssignmentInCourse }
    }

    setSaving(true);
    const result = await gradeAssignment(payload);
    setSaving(false);

    if (result.success) {
      navigate(`/courses/${courseID}`);
    } else {
      const err =
        typeof result.error === "string"
          ? result.error
          : JSON.stringify(result.error);
      setErrorMsg(err);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container className="mt-4" style={{ maxWidth: "800px", padding: "120px", backgroundColor: "#DA6464", height: "100vh" }}>
      <h2 style={{left: "150px"}}>Grade Assignment</h2>

      {/* Loading spinner while fetching assignment data */}
      {loading && !assignment && (
        <div className="d-flex align-items-center my-3">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading assignment details…</span>
        </div>
      )}

      {/* If load error (assume fetchAssignment logs to console) */}
      {/* Show assignment info once loaded */}
      {assignment && (
        <>
          <Alert variant="info" className="mt-3">
            Assignment Name: <strong>{assignment.name}</strong>
            <br />
            Description: {assignment.description}
            <br />
            Submitter: {assignment.submitter || "(Not yet submitted)"}
            <br />
            Max Points: {assignment.max_points}
            <br />
            {assignment.student_file ? (
              <>
                <a
                  href={assignment.student_file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Submitted File
                </a>
              </>
            ) : (
              <span style={{ color: "#888" }}>(No file submitted yet)</span>
            )}
          </Alert>
        </>
      )}

      {/* Error while saving grade */}
      {errorMsg && (
        <Alert variant="danger" className="my-3">
          {errorMsg}
        </Alert>
      )}

      {/* Grade form (only visible if assignment is loaded and has a submitter) */}
      {assignment && assignment.submitter && (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="studentPoints" className="mb-3">
            <Form.Label>Student Points (out of {assignment.max_points})</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max={assignment.max_points}
              value={studentPoints}
              onChange={handlePointsChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" style={{width: "200px", backgroundColor: "white", color: "black", fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"}} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving…
              </>
            ) : (
              "Save Grade"
            )}
          </Button>
        </Form>
      )}

      {/* If no submitter yet, disable grading */}
      {assignment && !assignment.submitter && (
        <p className="text-muted mt-3">
          Student has not submitted this assignment yet.
        </p>
      )}
    </Container>
  );
};

export default GradeAssignment;
