// src/components/NewCourse.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import styles from "../modules/NewCourse.module.css"
import {Container,Form,Button,Spinner,Alert,Row,Col } from "react-bootstrap";
const NewCourse = () => {
  const navigate = useNavigate();

  // Local component state
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  // Easy-Peasy actions & state
  const createCourse = useStoreActions(
    (actions) => actions.courseStore.createCourse
  );
  const loading = useStoreState((state) => state.courseStore.loading);
  const error = useStoreState((state) => state.courseStore.error);

  // For showing a success banner (if you want one)
  const [successMsg, setSuccessMsg] = useState("");

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous success message
    setSuccessMsg("");
    const courseData = {name: courseName, description: description}
    // Dispatch the thunk with name, description, and imageFile
    const result = await createCourse(courseData);

    if (result.success) {
      // Optionally show a small “Created!” message before navigating
      setSuccessMsg("Course created successfully!");
      // Wait a moment, or navigate directly:
      setTimeout(() => {
        navigate("/courses");
      }, 500);
    }
    // If result.success is false, the `error` from the store will show below
  };

  return (
    <Container className="mt-5" style={{maxWidth: "600px"}} >
      <h1 className={styles.h1}>Create New Course</h1>

      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Form.Label htmlFor="courseName" className={styles.form_label}>
            Course Name <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            id="courseName"
            className="form-control"
            required
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter a short course name"
          />
        </div>

        <div className="mb-3">
          <Form.Label htmlFor="courseDescription" className={styles.form_label}>
            Description
          </Form.Label>
          <Form.Control
            as="textarea"
            id="courseDescription"
            className="form-control"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional: add a course description"
          />
        </div>


        {error && (
          <div className="alert alert-danger">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">{successMsg}</div>
        )}

        <Button
          type="submit"
          className="btn btn-success w-100 mx-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />{" "}
              Creating…
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default NewCourse;
