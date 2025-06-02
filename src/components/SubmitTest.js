// src/pages/SubmitTest.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

const SubmitTest = () => {
  const { courseID, testID } = useParams();
  const navigate = useNavigate();

  const createTestSub = useStoreActions(
    (a) => a.submissionStore.createTestSubmission
  );
  const fetchStudentTestGrades = useStoreActions(
    (a) => a.submissionStore.fetchStudentTestGrades
  );
  const studentTestGrades = useStoreState(
    (s) => s.submissionStore.studentTestGrades
  );
  const loading = useStoreState((s) => s.submissionStore.loading);
  const error   = useStoreState((s) => s.submissionStore.error);
  const studentId = useStoreState((s) => s.userStore.user.pk);
  const [file, setFile] = useState(null);
  const already = studentTestGrades.find((s) => s.test === parseInt(testID, 10));
    if (already && already.student_points == null) {
        return (
        <div className="text-center mt-5">
            <h4>You already submitted this test. Waiting for grading.</h4>
            <Button onClick={() => navigate(`/courses/${courseID}`)}>Back to Course</Button>
        </div>
        );
    }
    if (already && already.student_points != null) {
        return (
        <div className="text-center mt-5">
            <h4>You’ve already been graded: {already.student_points} / {already.test_max_points || "—"}</h4>
            <Button onClick={() => navigate(`/courses/${courseID}`)}>Back to Course</Button>
        </div>
        );
    }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("student_file", file);

    const result = await createTestSub({ testID, formData });

    if (result.success) {
      await fetchStudentTestGrades({ courseID, studentId });
      navigate(`/courses/${courseID}`);
    }
  };

  return (
    <div className="SubmitTest">
      <h2>Submit Test #{testID}</h2>
      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="fileUpload" className="mb-3">
          <Form.Label>Upload your test file</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading || !file}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Submitting…
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default SubmitTest;
