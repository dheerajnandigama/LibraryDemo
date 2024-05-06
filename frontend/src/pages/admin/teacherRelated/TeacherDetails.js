import React, { useEffect } from "react";
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

  const teacherID = params.id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

  if (error) {
    console.log(error);
  }

  const isSubjectNamePresent = teacherDetails?.teachSubject?.length > 0;

  const handleAddSubject = () => {
    navigate(
      `/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Teacher Details
          </Typography>
          <Typography variant="h6" gutterBottom>
            Teacher Name: {teacherDetails?.name}
          </Typography>
          {/* <Typography variant="h6" gutterBottom>
                        Class Name: {teacherDetails?.teachSclass?.sclassName}
                    </Typography> */}
          {isSubjectNamePresent ? (
            teacherDetails?.teachSubject.map((each) => {
              return (
                <div style={{ margin: "10px" }}>
                  <Divider sx={{ margin: "10px" }}></Divider>
                  <Typography variant="h6" gutterBottom>
                    Subject : {each?.subName}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Semester : {each?.sclassName.sclassName}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Subject Sessions: {each?.sessions}
                  </Typography>
                </div>
              );
            })
          ) : (
            <Button variant="contained" onClick={handleAddSubject}>
              Add Subject
            </Button>
          )}
        </Container>
      )}
    </>
  );
};

export default TeacherDetails;
