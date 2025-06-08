// src/components/CourseCard.jsx
import React,{useState} from "react";
import PropTypes from "prop-types";
import styles from "../modules/CourseCard.module.css";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Spinner } from "react-bootstrap";
const CourseCard = ({ course, bgVariant = "default", onClick , onViewGrades}) => {
  // Use one of the CSS module’s background-variants: default / primary / secondary / danger
  // If someone passes an unknown bgVariant, fall back to "default"
  const student_id = useStoreState((s) => s.userStore.user.pk)
  const userIsStaff = useStoreState((s) => s.userStore.user.is_staff);
  const updateCourse = useStoreActions((a) => a.courseStore.updateCourse)
  const loading = useStoreState((s) => s.courseStore.loading)
  const error = useStoreState((s) => s.courseStore.error)
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(course.name)
  const [tempDescription, setTempDescription] = useState(course.description || "")
  const enterEditMode = () => {
    setTempName(course.name);
    setTempDescription(course.description || "")
    setIsEditing(true)
  }
  const handleCancel = () => {
    setTempName(course.name)
    setTempDescription(course.description || "")
    setIsEditing(false)
  }
  const handleSave = async() => {
    const trimmedName = tempName.trim()
    const trimmedDesc = tempDescription.trim()
    if(trimmedName === course.name.trim() && trimmedDesc === (course.description || "").trim()
    ){
      setIsEditing(false)
      return
    }
    const result = await updateCourse({
      courseId: course.id,
      newName: trimmedName,
      newDescription: trimmedDesc,
    });
    if(result.success){
      setIsEditing(false)
    }else{
      console.error("Failed to update course:", result.error)
    }
  }
  const validVariants = ["default", "primary", "secondary", "danger"];
  const variantClass = validVariants.includes(bgVariant) ? bgVariant : "default";

  return (
    <div className={`card ${styles.courseCard} ${styles[variantClass]}`}>
      <div className={styles.cardHeader}>
        <div className={styles.titleWrapper}>
          {!isEditing ? (
            <h5 className={styles.cardTitle}>{course.name}</h5>
          ) : (
            <input 
              type="text"
              className={styles.titleInput}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              />
          )}
          {userIsStaff && !isEditing && (
            <span 
              className={styles.titleEditIcon}
              onClick={enterEditMode}
              title="Edit course name & description"
            > 
              ✏️
            </span>
          )}
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.descriptionWrapper}>
          {!isEditing ? (
            <p className={styles.descriptionText}>
              {course.description || "No description yet."} 
            </p>
          ): (
            <textarea
              className={styles.descriptionTextarea}
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              />
          )}
          {userIsStaff && !isEditing && (
            <span
              className={styles.descriptionEditIcon}
              onClick={enterEditMode}
              title="Edit course name & description"
            >  ✏️</span>
          )}
        </div>
        {isEditing && (
          <div className={styles.editButtons}>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={handleCancel}
              disabled={loading}
            > Cancel </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
               {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
        {!isEditing && error && (
          <div className="mt-2 text-danger" style={{ fontSize: "0.9rem" }}>
            {JSON.stringify(error)}
          </div>
        )}
         {!isEditing && (
          <div className="d-flex justify-content-between">
          <button
            className={`btn btn-outline-primary ${styles.viewButton}`}
            onClick={(e) => {
              e.stopPropagation()
              onClick(course.id)
            }}
          >
            View Course
          </button>
          <button
            className={`btn btn-outline-success ${styles.viewButton}`}
            onClick={(e) => {
                e.stopPropagation();
                onViewGrades(course.id);
              }}
              >
            View Grades
          </button>
          </div>
        )}
      </div>
    {/* <div
      className={`card ${styles.courseCard} ${styles[variantClass]}`}
      onClick={() => onClick && onClick(course.id)}
    >
      <h3 className={styles.title}>{course.name}</h3>
      <p className={styles.description}>
        {course.description || "No description provided."}
      </p>
    </div>
    </div> */}
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  bgVariant: PropTypes.oneOf(["default", "primary", "secondary", "danger"]),
  onClick: PropTypes.func, // Optional click handler
};

export default CourseCard;
