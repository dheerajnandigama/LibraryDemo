import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import Popup from "../../../components/Popup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const SubjectForm = () => {
  const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;

  const sclassName = params.id;
  const adminID = currentUser._id;
  const address = "Subject";

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [subjectStatus, setSubjectStatus] = useState("published");

  const handleSubjectNameChange = (index) => (event) => {
    const newSubjects = [...subjects];
    newSubjects[index].subName = event.target.value;
    setSubjects(newSubjects);
  };

  const handleSubjectCodeChange = (index) => (event) => {
    const newSubjects = [...subjects];
    newSubjects[index].subCode = event.target.value;
    setSubjects(newSubjects);
  };

  const handleSessionsChange = (index) => (event) => {
    const newSubjects = [...subjects];
    newSubjects[index].sessions = event.target.value || 0;
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subName: "", subCode: "" }]);
  };

  const handleRemoveSubject = (index) => () => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const fields = {
    sclassName,
    subjects: subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions,
      subjectStatus,
    })),
    adminID,
  };

  const handleChange = (event) => {
    setSubjectStatus(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/subjects");
      dispatch(underControl());
      setLoader(false);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <form onSubmit={submitHandler}>
      <Box mb={2} sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}>
        <Typography variant="h4">Add Subjects</Typography>
      </Box>
      <Paper sx={{ width: "50%", height: "100%", padding: "10px", mx: "auto" }}>
        <Grid container spacing={2}>
          {subjects.map((subject, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Subject Name"
                  variant="outlined"
                  value={subject.subName}
                  onChange={handleSubjectNameChange(index)}
                  sx={styles.inputField}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Subject Code"
                  variant="outlined"
                  value={subject.subCode}
                  onChange={handleSubjectCodeChange(index)}
                  sx={styles.inputField}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sessions"
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={subject.sessions}
                  onChange={handleSessionsChange(index)}
                  sx={styles.inputField}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  sx={{ width: "100%" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={subjectStatus}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value={"published"}>Published</MenuItem>
                  <MenuItem value={"unpublished"}>Unpublished</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="flex-end">
                </Box>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit" disabled={loader}>
                {loader ? <CircularProgress size={24} color="inherit" /> : "Save"}
              </Button>
            </Box>
          </Grid>
          <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Grid>
      </Paper>
    </form>
  );
};

export default SubjectForm;

const styles = {
  inputField: {
    "& .MuiInputLabel-root": {
      color: "#838080",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#838080",
    },
  },
};
