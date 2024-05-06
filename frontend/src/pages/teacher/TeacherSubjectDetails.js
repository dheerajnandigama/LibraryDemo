import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../../components/Popup";
import {
  getClassSubjectStudents,
  getSubjectDetails,
  updateSubjectSyllabus,
  updateSubjectAnnouncement,
} from "../../redux/sclassRelated/sclassHandle";
import {
  Paper,
  Box,
  Grid,
  Chip,
  Typography,
  ButtonGroup,
  TextField,
  Button,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp, Edit } from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import MUIRichTextEditor from "mui-rte";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { red } from "@mui/material/colors";
const dayjs = require("dayjs");

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function TeacherSubjectDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef(null);
  const assignmentRef = useRef(null);
  const announcementRef = useRef(null);
  const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { subjectDetails } = useSelector((state) => state.sclass);

  const { currentUser } = useSelector((state) => state.user);
  const classID = currentUser.teachSclass?._id;
  const subjectID = params.id;
  const [value, setValue] = React.useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [dateValue, setDateValue] = useState(null);

  const [assignmentTitile, setAssignmentTitle] = useState("");
  const [assignmentMarks, setAssignmentMarks] = useState(100);
  const [assignmentDueDate, setAssignmentDueDate] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    dispatch(getClassSubjectStudents(classID, subjectID));
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, classID, subjectID]);

  useEffect(() => {
    console.log(subjectDetails);
  }, [subjectDetails]);

  useEffect(() => {
    if (selectedAssignment) {
      setAssignmentTitle(selectedAssignment.title);
      setAssignmentDueDate(dayjs(dayjs.unix(selectedAssignment.deadline)));
      setAssignmentMarks(selectedAssignment.marks);
    }
  }, [selectedAssignment]);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    };
  });

  const StudentsButtonHaver = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`);
    };
    const handleMarks = () => {
      navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Teacher/class/student/" + row.id)}
        >
          View
        </BlueButton>
        {/* <React.Fragment>
          <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <BlackButton
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </BlackButton>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment> */}
      </>
    );
  };

  const editorTheme = createTheme({
    overrides: {
      MUIRichTextEditor: {
        editor: {
          padding: "20px",
          height: "450px",
          maxHeight: "450px",
          overflow: "auto",
        },
        toolbar: {
          borderBottom: "1px solid gray",
          backgroundColor: "#ebebeb",
        },
        placeHolder: {
          paddingLeft: 20,
          width: "inherit",
        },
        anchorLink: {
          color: "#333333",
          textDecoration: "underline",
        },
      },
    },
  });

  const announcementTheme = createTheme({
    overrides: {
      MUIRichTextEditor: {
        editor: {
          padding: "20px",
          height: "150px",
          overflow: "auto",
          border: "1px solid gray",
        },
        toolbar: {
          display: "none",
        },
      },
    },
  });

  const saveSyllabus = (data) => {
    console.log(data);
    dispatch(updateSubjectSyllabus(subjectID, data));
    setMessage("Done Successfully");
    setShowPopup(true);
  };

  const saveAnnouncement = (data) => {
    const newAssignment = {
      type: value === 3 ? "announcement" : "assignment",
      title: assignmentTitile,
      description: data,
      marks: assignmentMarks,
      deadline: value === 3 ? dayjs().unix() : dayjs(assignmentDueDate).unix(),
      postedOn: dayjs().unix(),
    };
    if (selectedAssignment) {
      const updatedList = subjectDetails?.announcements?.filter(
        (each) => each._id !== selectedAssignment._id
      );
      updatedList.push(newAssignment);
      dispatch(updateSubjectAnnouncement(subjectID, updatedList));
    } else {
      const allNewAnnouncement = [...(subjectDetails?.announcements ?? []), newAssignment];
      dispatch(updateSubjectAnnouncement(subjectID, allNewAnnouncement));
    }
    setAssignmentTitle("");
    setAssignmentDueDate(null);
    setAssignmentMarks(100);
    setSelectedAssignment(null);
    setMessage("Done Successfully");
    setShowPopup(true);
  };

  const handleDelete = (id) => {
    const updatedList = subjectDetails?.announcements?.filter((each) => each._id !== id);
    dispatch(updateSubjectAnnouncement(subjectID, updatedList));
    setSelectedAssignment(null);
    setAssignmentTitle("");
    setAssignmentDueDate(null);
    setMessage("Done Successfully");
    setShowPopup(true);
  };

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Syllabus" {...a11yProps(0)} />
          <Tab label="Students" {...a11yProps(1)} />
          <Tab label="Assignment" {...a11yProps(2)} />
          <Tab label="Announcement" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Paper sx={{ width: "50%", height: "100%", padding: "10px", mx: "auto" }}>
          <ThemeProvider theme={editorTheme}>
            <MUIRichTextEditor
              label="add your syllabus here....."
              ref={ref}
              onSave={saveSyllabus}
              defaultValue={subjectDetails?.syllabus}
            />
          </ThemeProvider>
        </Paper>
        <Box
          sx={{
            marginTop: "10px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              ref.current?.save();
            }}
          >
            Save
          </Button>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Paper sx={{ width: "50%", overflow: "hidden", mx: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Students List:
          </Typography>

          {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
            <TableTemplate
              buttonHaver={StudentsButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
          )}
        </Paper>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ height: "400px", padding: "10px", mx: "auto" }}>
              {subjectDetails?.announcements
                ?.filter((each) => each.type === "assignment")
                ?.sort((a, b) => parseInt(b.deadline) - parseInt(a.deadline))?.length > 0
                ? subjectDetails?.announcements
                    ?.filter((each) => each.type === "assignment")
                    ?.sort((a, b) => parseInt(a.deadline) - parseInt(b.deadline))
                    ?.map((each) => {
                      return (
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<KeyboardArrowDown />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={2}
                              width={"100%"}
                            >
                              {each.title}
                              <Chip
                                color={"error"}
                                label={`Due on ${dayjs.unix(each.deadline).format("MM/DD/YYYY")}`}
                              />
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails>
                            <ThemeProvider theme={announcementTheme}>
                              <MUIRichTextEditor
                                label="add assignment details here....."
                                defaultValue={each.description}
                                readOnly
                              />
                            </ThemeProvider>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={2}
                              width={"100%"}
                            >
                              <div
                                onClick={() => {
                                  setSelectedAssignment(each);
                                }}
                              >
                                <Typography
                                  variant="overline"
                                  display="block"
                                  gutterBottom
                                  color={"blue"}
                                  style={{ cursor: "pointer" }}
                                >
                                  Edit
                                </Typography>
                              </div>
                              <Typography variant="caption" display="block" gutterBottom>
                                Posted on: {dayjs.unix(each.postedOn).format("MM/DD/YYYY")}
                              </Typography>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                : "No Announcement"}
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="standard-basic"
                variant="standard"
                label="Assignment Title"
                InputLabelProps={{ shrink: true }}
                value={assignmentTitile}
                onChange={(e) => {
                  setAssignmentTitle(e.target.value);
                }}
              />
              <TextField
                id="standard-basic"
                variant="standard"
                label="Total Marks"
                type="number"
                value={assignmentMarks}
                onChange={(e) => {
                  setAssignmentMarks(e.target.value);
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select due date"
                  value={assignmentDueDate}
                  onChange={(newValue) => setAssignmentDueDate(newValue)}
                />
              </LocalizationProvider>
            </Box>
            <ThemeProvider theme={editorTheme}>
              <MUIRichTextEditor
                label="add assignment details here....."
                ref={assignmentRef}
                onSave={saveAnnouncement}
                defaultValue={selectedAssignment ? selectedAssignment.description : ""}
              />
            </ThemeProvider>
            <Box
              sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedAssignment && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleDelete(selectedAssignment._id);
                  }}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  assignmentRef.current?.save();
                }}
                sx={{ marginRight: "10px", marginLeft: "10px" }}
              >
                {selectedAssignment ? "Update assignment" : "Add new assignment"}
              </Button>
              {selectedAssignment && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setSelectedAssignment(null);
                    setAssignmentTitle("");
                    setAssignmentDueDate(null);
                    setAssignmentMarks(100);
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ height: "400px", padding: "10px", mx: "auto" }}>
              {subjectDetails?.announcements
                ?.filter((each) => each.type === "announcement")
                ?.sort((a, b) => parseInt(b.postedOn) - parseInt(a.postedOn))?.length > 0
                ? subjectDetails?.announcements
                    ?.filter((each) => each.type === "announcement")
                    ?.sort((a, b) => parseInt(b.postedOn) - parseInt(a.postedOn))
                    ?.map((each) => {
                      return (
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<KeyboardArrowDown />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={2}
                              width={"100%"}
                            >
                              {each.title}
                              <Chip
                                color={"primary"}
                                label={`Posted on ${dayjs
                                  .unix(each.postedOn)
                                  .format("MM/DD/YYYY")}`}
                              />
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails>
                            <ThemeProvider theme={announcementTheme}>
                              <MUIRichTextEditor
                                label="add announcement details here....."
                                defaultValue={each.description}
                                readOnly
                              />
                            </ThemeProvider>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={2}
                              width={"100%"}
                            >
                              <div
                                onClick={() => {
                                  setSelectedAssignment(each);
                                }}
                              >
                                <Typography
                                  variant="overline"
                                  display="block"
                                  gutterBottom
                                  color={"blue"}
                                  style={{ cursor: "pointer" }}
                                >
                                  Edit
                                </Typography>
                              </div>
                              <Typography variant="caption" display="block" gutterBottom>
                                Posted on: {dayjs.unix(each.postedOn).format("MM/DD/YYYY")}
                              </Typography>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                : "No Announcement"}
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="standard-basic"
                variant="standard"
                label="Announcement Title"
                InputLabelProps={{ shrink: true }}
                value={assignmentTitile}
                onChange={(e) => {
                  setAssignmentTitle(e.target.value);
                }}
              />
              {/* <TextField
                id="standard-basic"
                variant="standard"
                label="Total Marks"
                type="number"
                value={assignmentMarks}
                onChange={(e) => {
                  setAssignmentMarks(e.target.value);
                }}
              /> */}
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select due date"
                  value={assignmentDueDate}
                  onChange={(newValue) => setAssignmentDueDate(newValue)}
                />
              </LocalizationProvider> */}
            </Box>
            <ThemeProvider theme={editorTheme}>
              <MUIRichTextEditor
                label="add announcement details here....."
                ref={announcementRef}
                onSave={saveAnnouncement}
                defaultValue={selectedAssignment ? selectedAssignment.description : ""}
              />
            </ThemeProvider>
            <Box
              sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedAssignment && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleDelete(selectedAssignment._id);
                  }}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  announcementRef.current?.save();
                }}
                sx={{ marginRight: "10px", marginLeft: "10px" }}
              >
                {selectedAssignment ? "Update announcement" : "Add new announcement"}
              </Button>
              {selectedAssignment && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setSelectedAssignment(null);
                    setAssignmentTitle("");
                    setAssignmentDueDate(null);
                    setAssignmentMarks(100);
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CustomTabPanel>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
}
