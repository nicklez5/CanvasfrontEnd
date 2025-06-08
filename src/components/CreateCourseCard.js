// src/components/CreateCourseCard.jsx
import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "../modules/CreateCourseCard.module.css"; // (we’ll define this below)

const CreateCourseCard = () => {
  const navigate = useNavigate();

  return (
    <Card
      className={`h-100 text-center ${styles.createCard}`}
      onClick={() => navigate("/postCourse")} 
      role="button"
    >
      <div className={styles.iconContainer}>
        <span className={styles.plusIcon}>＋</span>
      </div>
      <Card.Body>
        <Card.Title>Create New Course</Card.Title>
        <Card.Text className="text-muted">
          (Admins only)
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CreateCourseCard;
