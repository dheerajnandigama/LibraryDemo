import { Container, Grid, IconButton, Paper } from "@mui/material";
import SeeNotice from "../../components/SeeNotice";
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from "styled-components";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllSclasses,
  getClassStudents,
  getSubjectList,
} from "../../redux/sclassRelated/sclassHandle";
import { resetSubjects } from "../../redux/sclassRelated/sclassSlice";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";
import { deleteUser } from "../../redux/userRelated/userHandle";
import TableTemplate from "../../components/TableTemplate";
import { BlueButton } from "../../components/buttonStyles";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useNavigate, useParams } from "react-router-dom";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { subjectsList, sclassStudents } = useSelector((state) => state.sclass);

  const { currentUser } = useSelector((state) => state.user);

  const classID = params.id;

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList && studentsList.length;
  const numberOfClasses = sclassesList && sclassesList.length;
  const numberOfTeachers = teachersList && teachersList.length;

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
    dispatch(deleteUser(deleteID, address)).then(() => {
      window.location.reload();
    });
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = studentsList.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    };
  });
  console.log(sclassStudents);

  const facultycolumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "teachSubject", label: "Subject", minWidth: 100 },
    { id: "teachSclass", label: "Class", minWidth: 170 },
  ];

  const facultyrows = teachersList.map((teacher) => {
    return {
      name: teacher.name,
      teachSubject: teacher.teachSubject?.subName || null,
      teachSclass: teacher.teachSclass.sclassName,
      teachSclassID: teacher.teachSclass._id,
      id: teacher._id,
    };
  });

  const subjectColumns = [
    { id: "name", label: "Subject Name", minWidth: 170 },
    { id: "code", label: "Subject Code", minWidth: 100 },
  ];

  const subjectRows =
    subjectsList &&
    subjectsList.length > 0 &&
    subjectsList.map((subject) => {
      return {
        name: subject.subName,
        code: subject.subCode,
        id: subject._id,
      };
    });

  const StudentsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        {/* <PurpleButton
            variant="contained"
            onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}
          >
            Attendance
          </PurpleButton> */}
      </>
    );
  };

  const FacultyButtonHaver = ({ row }) => {
    return (
      <>
        {/* <IconButton onClick={() => deleteHandler(row.id, "Student")}>
            <PersonRemoveIcon color="error" />
          </IconButton> */}
        <BlueButton variant="contained" onClick={() => navigate("/Admin/teachers")}>
          View
        </BlueButton>
        {/* <PurpleButton
            variant="contained"
            onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}
          >
            Attendance
          </PurpleButton> */}
      </>
    );
  };

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => {
            navigate(`/Admin/class/subject/${classID}/${row.id}`);
          }}
        >
          View
        </BlueButton>
      </>
    );
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <StyledPaper sx={{ border: "1px solid #4CAF50", borderRadius: "8px" }}>
              <img src={Students} alt="Students" />
              <Title>Total Students</Title>
              <Data start={0} end={numberOfStudents} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <StyledPaper sx={{ border: "1px solid #4CAF50", borderRadius: "8px" }}>
              <img src={Classes} alt="Classes" />
              <Title>Total Semester</Title>
              <Data start={0} end={numberOfClasses} duration={5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <StyledPaper sx={{ border: "1px solid #4CAF50", borderRadius: "8px" }}>
              <img src={Teachers} alt="Teachers" />
              <Title>Total Faculty</Title>
              <Data start={0} end={numberOfTeachers} duration={2.5} />
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            {teachersList.length > 0 && (
              <TableTemplate
                buttonHaver={FacultyButtonHaver}
                columns={facultycolumns}
                rows={facultyrows}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            {studentsList.length > 0 && (
              <TableTemplate
                buttonHaver={StudentsButtonHaver}
                columns={studentColumns}
                rows={studentRows}
              />
            )}
          </Grid>
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

export default AdminHomePage;
