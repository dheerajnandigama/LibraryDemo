import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Paper, Box, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);
  const [filteredSubjectList, setFilteredSubjectLIst] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedSemesterFilter, setSelectedSemester] = useState("");
  const [selectedFacultyFilter, setSelectedFaculty] = useState("");

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);

  useEffect(() => {
    const facultyNames = [
      ...new Set(subjectsList.map((eachSubject) => eachSubject?.teacher?.name ?? "")),
    ];
    const semesterNames = [
      ...new Set(subjectsList.map((eachSubject) => eachSubject.sclassName.sclassName)),
    ];
    setSemesterList(semesterNames);
    setFacultyList(facultyNames);
    setFilteredSubjectLIst(subjectsList);
  }, [subjectsList]);

  useEffect(() => {
    let allFilteredSubList = [...subjectsList];
    if (selectedFacultyFilter) {
      allFilteredSubList = allFilteredSubList.filter(
        (eachSubject) => eachSubject?.teacher?.name === selectedFacultyFilter
      );
    }

    if (selectedSemesterFilter) {
      allFilteredSubList = allFilteredSubList.filter(
        (eachSubject) => eachSubject.sclassName.sclassName === selectedSemesterFilter
      );
    }
    setFilteredSubjectLIst(allFilteredSubList);
  }, [selectedSemesterFilter, selectedFacultyFilter]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.");
    // setShowPopup(true);

    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    });
  };

  const subjectColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
    { id: "subjectStatus", label: "Status", minWidth: 170 },
  ];

  const subjectRows = filteredSubjectList.map((subject) => {
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
        <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}
        >
          View
        </BlueButton>
      </>
    );
  };

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Add New Subject",
      action: () => navigate("/Admin/subjects/chooseclass"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(currentUser._id, "Subjects"),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/subjects/chooseclass")}
              >
                Add Subjects
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <div>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-filled-label">Select Semester</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={selectedSemesterFilter}
                    onChange={(e) => {
                      setSelectedSemester(e.target.value);
                    }}
                  >
                    {semesterList.map((eachSemester) => {
                      return <MenuItem value={eachSemester}>{eachSemester}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-filled-label">Select Faculty</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={selectedFacultyFilter}
                    onChange={(e) => {
                      setSelectedFaculty(e.target.value);
                    }}
                  >
                    {facultyList.map((eachFaculty) => {
                      return <MenuItem value={eachFaculty}>{eachFaculty}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <Button
                  style={{ marginTop: "20px" }}
                  variant="contained"
                  onClick={() => {
                    setSelectedSemester("");
                    setSelectedFaculty("");
                  }}
                >
                  Clear
                </Button>
              </div>
              {Array.isArray(filteredSubjectList) && filteredSubjectList.length > 0 ? (
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
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default ShowSubjects;
