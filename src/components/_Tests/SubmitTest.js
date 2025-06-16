// src/pages/SubmitTest.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Form, Button, Spinner, Alert,Container } from "react-bootstrap";

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
  const [loading,setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')
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
    const test_id = parseInt(testID, 10)
    setLoading(true)
    const result = await createTestSub({ testId: test_id, formData: formData });
    setLoading(false)
    if (result.success) {
      await fetchStudentTestGrades({ courseId: courseID, studentId });
      navigate(`/courses/${courseID}`);
    }else{
      const err = typeof result.error === "string" ? result.error : JSON.stringify(result.error);
      setErrorMsg(err)
    }
  };

  return (
    <Container className="mt-4" style={{position: "relative", top: "80px", maxWidth: "800px", padding: "120px",backgroundColor: "#18181B", color: "white", marginBottom:"54vh"}}>
      <h2 style={{left: "150px", bottom:"40px"}}>Submit Test</h2>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="fileUpload" className="mb-3">
          <Form.Label>Upload your test file</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{position: "relative", width: "200px", backgroundColor: "white", color: "black",top: "30px",left: "170px", fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif", padding: "15px"}}disabled={loading || !file}>
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
    </Container>
  );
};

export default SubmitTest;
