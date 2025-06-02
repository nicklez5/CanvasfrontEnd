import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

const EditLecture = () => {
  const { lectureID, courseID } = useParams();
  const navigate = useNavigate();

  // 1️⃣ Pull in the Easy Peasy thunks & selectors
  const fetchLecture = useStoreActions(
    (actions) => actions.lectureStore.fetchLecture
  );
  const {updateLectureInCourse} = useStoreActions((actions) => actions.courseStore)
  const updateLecture = useStoreActions(
    (actions) => actions.lectureStore.updateLecture
  );
  const lecture = useStoreState((state) =>
    state.lectureStore.lecture
  );

  // 2️⃣ Local state for loaDing / error / form fields
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form fields: name, description, and file (File object)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileObject, setFileObject] = useState(null);

  //
  // ─── Step A: Fetch the lecture details on mount ──────────────────────────────
  //
  useEffect(() => {
    const loadLecture = async () => {
      setLoading(true);
      await fetchLecture(lectureID);
      setLoading(false);
    };
    loadLecture();
  }, [fetchLecture, lectureID]);

  //
  // ─── Step B: Once `lecture` is in the store, seed the form fields ─────────────
  //
  useEffect(() => {
    if (lecture) {
      setName(lecture.name || "");
      setDescription(lecture.description || "");
      // We do NOT pre-seed `fileObject`—file inputs are left blank.
      // Instead, we can display a link to the existing file below.
    }
  }, [lecture]);

  //
  // ─── Handle form‐field changes ───────────────────────────────────────────────
  //
  const handleNameChange = (e) => setName(e.target.value);
  const handleDescChange = (e) => setDescription(e.target.value);
  const handleFileChange = (e) => {
    // e.target.files is a FileList; we grab the first file if present
    setFileObject(e.target.files[0] || null);
  };

  //
  // ─── Form submission ─────────────────────────────────────────────────────────
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validation
    if (!name.trim()) {
      setErrorMsg("Lecture name cannot be empty.");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Lecture description cannot be empty.");
      return;
    }

    // Build FormData exactly how your thunk expects it:
    const updatedData = {
      id: lectureID,
      file: fileObject,
      name: name.trim(),
      description: description.trim(),
    };

    const payload = {
      updatedData,
      id: courseID, // The parent course’s ID
      courseStoreActions: { updateLectureInCourse },
    };

    setLoading(true);
    const result = await updateLecture(payload);
    setLoading(false);

    if (result.success) {
      // Navigate back to wherever you keep the course page
      navigate(`/courses/${courseID}`);
    } else {
      const err =
        typeof result.error === "string"
          ? result.error
          : JSON.stringify(result.error);
      setErrorMsg(err);
    }
  };


  //
  // ─── Render ─────────────────────────────────────────────────────────────────
  //
  return (
    <Container className="mt-4" style={{ maxWidth: "800px", padding: "120px", backgroundColor: "#5BC0BE" }}>
      <h2 style={{left: "150px"}}>Edit Lecture #{lectureID}</h2>

      {/* Show a spinner while we’re fetching the existing lecture */}
      {loading && !lecture && (
        <div className="d-flex align-items-center my-3">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading lecture details…</span>
        </div>
      )}

      {/* If there was an error from a previous update, show it here */}
      {errorMsg && (
        <Alert variant="danger" className="my-3">
          {errorMsg}
        </Alert>
      )}

      {/* Only render the form once we have the lecture data in the store */}
      {lecture && (
        <Form onSubmit={handleSubmit} className="mt-3">
          {/* 1️⃣ Lecture Name */}
          <Form.Group controlId="lectureName" className="mb-3">
            <Form.Label>Lecture Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter lecture name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </Form.Group>

          {/* 2️⃣ Lecture Description */}
          <Form.Group controlId="lectureDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter a short description of this lecture"
              value={description}
              onChange={handleDescChange}
              required
            />
          </Form.Group>

          {/* 3️⃣ Current File Link (if any) */}
          {lecture.file && (
            <Form.Group className="mb-3">
              <Form.Label>Current File</Form.Label>
              <div>
                <a
                  href={lecture.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download existing file
                </a>
              </div>
            </Form.Group>
          )}

          {/* 4️⃣ Upload a New File (optional) */}
          <Form.Group controlId="lectureFile" className="mb-3">
            <Form.Label>Replace File (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.ppt,.mp4,.zip" 
              // Change "accept" to whatever file types you allow
            />
            <Form.Text className="text-muted">
              If you don’t choose a file, the old file will remain unchanged.
            </Form.Text>
          </Form.Group>

          {/* 5️⃣ Submit Button */}
          <Button variant="primary" type="submit" style={{width: "200px", backgroundColor: "white", color: "black", fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"}}disabled={loading}>
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
      )}
    </Container>
  );
};

export default EditLecture;