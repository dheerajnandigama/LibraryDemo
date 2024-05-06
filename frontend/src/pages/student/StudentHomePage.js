import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import styled from "styled-components";
import SeeNotice from "../../components/SeeNotice";
import CountUp from "react-countup";
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import { getSubjectListByStudent } from "../../redux/sclassRelated/sclassHandle";
import { BlueButton, GreenButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";

const StudentHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);

  const [subjectAttendance, setSubjectAttendance] = useState([]);

  const classID = currentUser.sclassName._id;

  useEffect(() => {
    dispatch(getUserDetails(currentUser._id, "Student"));
    dispatch(getSubjectListByStudent(currentUser._id, "StudentSubjects"));
  }, [dispatch, currentUser._id, classID]);

  const numberOfSubjects = subjectsList && subjectsList.length;

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate(`/Student/subjects/${row.sclassID}/${row.id}`)}
        >
          View
        </BlueButton>
      </>
    );
  };

  const subjectColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
    { id: "subjectStatus", label: "Status", minWidth: 170 },
    { id: "grades", label: "Grades", minWidth: 170 },
  ];

  const subjectRows = subjectsList.map((subject) => {
    const grades =
      userDetails.examResult
        ?.filter((sub) => sub.subName._id === subject._id)
        ?.reduce((acc, curr) => acc + curr.marksObtained, 0) ?? 0;
    console.log(grades);
    return {
      subName: subject.subName,
      sessions: subject.sessions,
      sclassName: subject.sclassName.sclassName,
      sclassID: subject.sclassName._id,
      subjectStatus: subject.subjectStatus,
      id: subject._id,
      grades: grades ?? 0,
    };
  });

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
        </Paper>
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Subject} alt="Subjects" />
              <Title>Total Subjects</Title>
              <Data start={0} end={numberOfSubjects} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StyledPaper>
              <img src={Assignment} alt="Assignments" />
              <Title>Total Assignments</Title>
              <Data start={0} end={15} duration={4} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <ChartContainer>
              {response ? (
                <Typography variant="h6">No Attendance Found</Typography>
              ) : (
                <>
                  {loading ? (
                    <Typography variant="h6">Loading...</Typography>
                  ) : (
                    <>
                      {subjectAttendance &&
                      Array.isArray(subjectAttendance) &&
                      subjectAttendance.length > 0 ? (
                        <>
                          <CustomPieChart data={chartData} />
                        </>
                      ) : (
                        <Typography variant="h6">No Attendance Found</Typography>
                      )}
                    </>
                  )}
                </>
              )}
            </ChartContainer>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <SeeNotice />
            </Paper>
          </Grid>
        </Grid> */}
      </Container>
    </>
  );
};

const ChartContainer = styled.div`
  padding: 2px;
  display: flex;
  flex-direction: column;
  height: 240px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

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

export default StudentHomePage;
