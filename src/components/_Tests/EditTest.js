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

const EditTest = () => {
    const { testID, courseID } = useParams();
    const navigate = useNavigate();

    const fetchTest = useStoreActions((a) => a.testStore.fetchTest);
    const updateTest = useStoreActions((a) => a.testStore.updateTest)
    const {updateTestInCourse} = useStoreActions((a) => a.courseStore)

    const test = useStoreState((s) => s.testStore.test)
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dateDue, setDateDue] = useState("");
    const [maxPoints, setMaxPoints] = useState("");
    const [fileObject, setFileObject] = useState(null);

    useEffect(() => {
        const load = async () => {
          setLoading(true);
          await fetchTest(testID);
          setLoading(false);
        };
        load();
    }, [fetchTest, testID]);

    useEffect(() => {
        if (test) {
          setName(test.name || "");
          setDescription(test.description || "");
    
          // Convert ISO timestamp to “YYYY-MM-DDThh:mm” for <input type="datetime-local">
          if (test.date_due) {
            const dt = new Date(test.date_due);
            const tzOffsetMs = dt.getTimezoneOffset() * 60 * 1000;
            const localISO = new Date(dt.getTime() - tzOffsetMs)
              .toISOString()
              .slice(0, 16);
            setDateDue(localISO);
          } else {
            setDateDue("");
          }
    
          setMaxPoints(test.max_points?.toString() || "");
          // We do NOT prefill <input type="file" />. Instead, we’ll show a link below.
        }
      }, [test]);
    const handleNameChange = (e) => setName(e.target.value);
    const handleDescChange = (e) => setDescription(e.target.value);
    const handleDateChange = (e) => setDateDue(e.target.value);
    const handleMaxChange = (e) => setMaxPoints(e.target.value);
    const handleFileChange = (e) => {
        setFileObject(e.target.files[0] || null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Basic validation
        if (!name.trim()) {
        setErrorMsg("Test name cannot be empty.");
        return;
        }
        if (!description.trim()) {
        setErrorMsg("Description cannot be empty.");
        return;
        }
        if (!dateDue) {
        setErrorMsg("Please pick a due date.");
        return;
        }
        if (!maxPoints || isNaN(maxPoints)) {
        setErrorMsg("Enter a valid number for max points.");
        return;
        }

        const updatedData = {
            id: testID,
            name: name.trim(),
            description: description.trim(),
            date_due: new Date(dateDue).toISOString(), // convert back to ISO
            max_points: parseInt(maxPoints, 10),
            test_file: fileObject, // either a File or null
        };

        const payload = {
            updatedData,
            courseID,
            courseStoreActions: { updateTestInCourse },
        };
        setLoading(true);
        const result = await updateTest(payload);
        setLoading(false);

        if (result.success) {
            navigate(`/courses/${courseID}`);
        } else {
            const err =
                typeof result.error === "string"
                ? result.error
                : JSON.stringify(result.error);
            setErrorMsg(err);
        }
    }
    return (
        <Container className="mt-4" style={{ maxWidth: "800px", padding: "120px", backgroundColor: "#DA6464" }}>
            <h2 style={{left: "150px"}}>Edit Test #{testID}</h2>
    
            {/* Show spinner if we’re loading the Test for the first time */}
            {loading && !test && (
            <div className="d-flex align-items-center my-3">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>Loading test…</span>
            </div>
            )}
    
            {/* Show error if update failed */}
            {errorMsg && (
            <Alert variant="danger" className="my-3">
                {errorMsg}
            </Alert>
            )}
    
            {/* Only show the form once we have `Test` in the store */}
            {test && (
            <Form onSubmit={handleSubmit} className="mt-3">
                {/* ─── Name ───────────────────────────────────────────────────────────── */}
                <Form.Group controlId="TestName" className="mb-3">
                <Form.Label>Test Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Test name"
                    value={name}
                    onChange={handleNameChange}
                    required
                />
                </Form.Group>
    
                {/* ─── Description ─────────────────────────────────────────────────────── */}
                <Form.Group controlId="TestDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter a brief description"
                    value={description}
                    onChange={handleDescChange}
                    required
                />
                </Form.Group>
    
                {/* ─── Date Due ────────────────────────────────────────────────────────── */}
                <Form.Group controlId="TestDueDate" className="mb-3">
                <Form.Label>Due Date &amp; Time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={dateDue}
                    onChange={handleDateChange}
                    required
                />
                </Form.Group>
    
                {/* ─── Max Points ──────────────────────────────────────────────────────── */}
                <Form.Group controlId="TestMaxPoints" className="mb-3">
                <Form.Label>Max Points</Form.Label>
                <Form.Control
                    type="number"
                    min="0"
                    placeholder="Total points possible"
                    value={maxPoints}
                    onChange={handleMaxChange}
                    required
                />
                </Form.Group>
    
            
                {/* ─── Current File Link (if any) ──────────────────────────────────────── */}
                {test.test_file && (
                <Form.Group className="mb-3">
                    <Form.Label>Current File</Form.Label>
                    <div>
                    <a
                        href={test.test_file}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download existing file
                    </a>
                    </div>
                </Form.Group>
                )}
    
                {/* ─── Replace File (optional) ─────────────────────────────────────────── */}
                <Form.Group controlId="testFile" className="mb-3">
                <Form.Label>Replace File (optional)</Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.zip"
                />
                <Form.Text className="text-muted">
                    If you don’t choose a new file, the old file stays in place.
                </Form.Text>
                </Form.Group>
    
                {/* ─── Submit Button ───────────────────────────────────────────────────── */}
                <Button variant="danger" type="submit" style={{position: "relative", top: "30px", left:"170px",padding: "15px",width: "200px", backgroundColor: "#DA6464", color: "white", fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"}} disabled={loading}>
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
    )
}
export default EditTest