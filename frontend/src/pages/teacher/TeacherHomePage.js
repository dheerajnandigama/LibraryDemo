import React, { useEffect, useState } from "react";
import { Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SeeNotice from "../../components/SeeNotice";
import CountUp from "react-countup";
import styled from "styled-components";
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import { getClassStudents, getSubjectDetails } from "../../redux/sclassRelated/sclassHandle";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, Box, Toolbar, List, Typography, Divider, IconButton } from "@mui/material";
import { getSubjectListByTeachers } from "../../redux/sclassRelated/sclassHandle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TeacherSideBar from "./TeacherSideBar";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import SpeedDialTemplate from "../../components/SpeedDialTemplate";
import { BlueButton, GreenButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";

// import Popup from "../../components/Popup";
import { Navigate, Route, Routes } from "react-router-dom";
import Logout from "../Logout";
import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";
import StudentAttendance from "../admin/studentRelated/StudentSubject";

const TeacherHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

  const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
    dispatch(getSubjectListByTeachers(currentUser._id, "AllSubjects"));
  }, [dispatch, subjectID, classID]);

  const numberOfStudents = sclassStudents && sclassStudents.length;
  const numberOfSessions = subjectDetails && subjectDetails.sessions;

  const subjectColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
    { id: "subjectStatus", label: "Status", minWidth: 170 },
  ];

  const subjectRows = subjectsList.map((subject) => {
    return {
      subName: subject.subName,
      sessions: subject.sessions,
      sclassName: subject.sclassName.sclassName,
      sclassID: subject.sclassName._id,
      subjectStatus: subject.subjectStatus,
      id: subject._id,
    };
  });

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton variant="contained" onClick={() => navigate(`/Teacher/subject/${row.id}`)}>
          View
        </BlueButton>
      </>
    );
  };

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Subject",
      action: () => {},
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Subjects",
      action: () => {},
    },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 4, display: "flex", flexDirection: "column" }}>
              Subjects your teaching
            </Paper>
          </Grid>
          <>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {response ? (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                    <GreenButton variant="contained" onClick={() => {}}>
                      Add Subjects
                    </GreenButton>
                  </Box>
                ) : (
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                      <TableTemplate
                        buttonHaver={SubjectsButtonHaver}
                        columns={subjectColumns}
                        rows={subjectRows}
                      />
                    ) : (
                      <h5>No Subject Found</h5>
                    )}
                    <SpeedDialTemplate actions={actions} />
                  </Paper>
                )}
              </>
            )}
          </>
          {/* <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Students} alt="Students" />
              <Title>Class Students</Title>
              <Data start={0} end={numberOfStudents} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Lessons} alt="Lessons" />
              <Title>Total Lessons</Title>
              <Data start={0} end={numberOfSessions} duration={5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Tests} alt="Tests" />
              <Title>Tests Taken</Title>
              <Data start={0} end={24} duration={4} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Time} alt="Time" />
              <Title>Total Hours</Title>
              <Data start={0} end={30} duration={4} suffix="hrs" />{" "}
            </StyledPaper>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + 0.6vw);
  color: green;
`;

export default TeacherHomePage;
