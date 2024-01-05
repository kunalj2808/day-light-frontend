import "./style/view.scss";
import axios from "axios";
import React, { useRef } from 'react';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
// import { usePDF } from "react-to-pdf";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@mui/material";

import Chart from "../../components/material/Chart";

// import { ToastContainer, toast } from "react-toastify";

import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import styled from "@emotion/styled";

import {
  Box,
  Button,
  List as List1,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";

const ViewStudent = () => {
  // change thse value dynamically
  const calendarRef = useRef(null);
  const startSessionDate = new Date("2023-07-01"); // Set your desired start date
  const endSessionDate = new Date("2024-06-30"); // Set your desired end date

  const { id } = useParams();

  const [data, setData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [sessionAttendance, setSessionAttendance] = useState([]);

  const [studentPercentageData, setStudentPercentageData] = useState(null);
  const [studentsSessionData, setStudentSessionData] = useState([]);

  const [monthlyData, setMonthlyData] = useState();

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);

  // const { toPDF, targetRef } = usePDF({filename: 'salary.pdf'});

  const getStudentAnalyticsData = () => {

    api
    .get("studentspercentagebyid/" + id)
    .then((response) => {
      const data = response.data; // Assuming the response contains the array of student data
      console.log("percentage", data);
      setStudentPercentageData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  api
    .get("studentssessionpercentagebyid/" + id)
    .then(async (response) => {
      const data = response.data; // Assuming the response contains the array of student data
      console.log("session", data);
      let chartData = await Promise.all(
        data.map((value, i) => {
          return {
            name: value.monthName,
            Total: parseFloat(value.student_percentage).toFixed(2),
          };
        })
      );
      console.log("chartData", chartData);
      setStudentSessionData(chartData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  let params = {
    id: id,
    month: new Date(),
  };

  api
    .get("studentsmonthlypercentage", { params })
    .then(async (response) => {
      const data = response.data; // Assuming the response contains the array of student data
      console.log("monthly", data);
      setMonthlyData(data);
    })
    .catch((error) => {
      console.error("Error fetching monthly data:", error);
    });
  }

  useEffect(() => {
    // Fetch data from an API using Axios
    api
      .get("students/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of student data
        console.log(data);
        setData(data); // Update the state with the fetched data

        console.log("image", data.student_image);
        //setFilteredRows(data); // Set initial filtered rows
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

      getStudentAnalyticsData()
  }, [id]);


  const getAttendanceData = async (id) => {
    await api
      .get("attendance/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of student data

        // eslint-disable-next-line array-callback-return
        if (calendarRef.current) {
          calendarRef.current.getApi().removeAllEvents();
          data.map((event) => {
            calendarRef.current.getApi().addEvent({
              id: event.id,
              title: event.status,
              start: event.day,
              end: event.exit_time,
              //allDay:true
            });
          });
        }

        // let events = data?.map((item) => ({
        //   id: item.id,
        //   title: item.status,
        //   start: combineDateTime(item.day, item.entrance_time),
        //   end: combineDateTime(item.day, item.exit_time),
        //   allDay: false,
        // }));
        // setCurrentEvents(events); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Fetch data from an API using Axios
    getAttendanceData(id);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  function combineDateTime(dateOnly, timeOnly) {
    // Assuming dateOnly is in 'YYYY-MM-DD' format and timeOnly is in 'HH:mm:ss' format
    const [dateYear, dateMonth, dateDay] = dateOnly?.split("-")?.map(Number);
    const [timeHour, timeMinute, timeSecond] = timeOnly
      ?.split(":")
      ?.map(Number);

    const combinedDate = new Date(
      dateYear,
      dateMonth - 1,
      dateDay,
      timeHour,
      timeMinute,
      timeSecond
    );
    return combinedDate;
  }

  // if (  
    //   window.confirm(
    //     `Are you sure you want to delete the event '${date.start}'`
    //   )
    // ) {
    // }


    //const title = prompt("Please enter a new title for your event");
    // const calendarApi = selected.view.calendar;
    // calendarApi.unselect();
    // calendarApi.addEvent({
    //   id: `${selected.dateStr}-${title}`,
    //   title,
    //   start: selected.startStr,
    //   end: selected.endStr,
    //   allDay: selected.allDay,
    // });


  const [addPopup, setAddPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [popupEntranceTime , setPopupEntranceTime] = useState(null);
  const [popupExitTime , setPopupExitTime] = useState(null);

  const handleDateClick = (date, jsEvent, view) => {
    console.log(date, jsEvent, view)
    setAddPopup(true);
    setSelectedDate(date.start)
    setPopupEntranceTime(null)
    setPopupExitTime(null)
  };

  const handleEventClick = (selected) => {
    console.log(selected.event.start);
    if(selected.event.start){
      setDeletePopup(true);
      setSelectedDate(selected.event.start)
    }else{
      // toast.error("Error...");
    }
  };

  const handleCloseWarning = () => {
    setAddPopup(false);
    setDeletePopup(false);
    setSelectedDate(null);
  };

  const addAttendanceEvent = () => {

    console.log(selectedDate);

    api
      .post("/createattendance", {
        studentId: id,
        day: selectedDate,
        entranceTime: popupEntranceTime,
        exitTime: popupExitTime
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStudentAnalyticsData();
        console.log("Attendance added:", response.data);
        // toast.success("Attendance added successfully");
        handleCloseWarning();
      })
      .catch((error) => {
        // Handle error
        console.error("Error adding attendance:", error.response.data);
        // toast.error("Error Adding attendance: " + error.response.data.error);
        handleCloseWarning();
      });
  }

  const deleteAttendanceEvent = () => {

    console.log(selectedDate);

    api
      .post("/deleteattendance", {
        studentId: id,
        day: selectedDate,
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStudentAnalyticsData();
        console.log("Attendance deleted:", response.data);
        // toast.success("Attendance deleted successfully");
        handleCloseWarning();
      })
      .catch((error) => {
        // Handle error
        console.error("Error deleting attendance:", error.response.data);
        // toast.error("Error Deleting attendance: " + error.response.data.error);
        handleCloseWarning();
      });
  }

  
  const AddAttendancePopup = () => {
    return (
      <Dialog open={addPopup} onClose={handleCloseWarning}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You Sure you want to add the attendance.
          </DialogContentText>
          <TextField
          label="Entrance Time"
          type="time"
          value={popupEntranceTime}
          onChange={(e) => setPopupEntranceTime(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Exit Time"
          type="time"
          value={popupExitTime}
          onChange={(e) => setPopupExitTime(e.target.value)}
          fullWidth
          margin="normal"
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => addAttendanceEvent()} color="primary">
            Proceed
          </Button>
          <Button
            onClick={() => handleCloseWarning()}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const DeleteAttendancePopup = () => {
    return (
      <Dialog open={deletePopup} onClose={handleCloseWarning}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You Sure you want to Delete Attendance.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteAttendanceEvent()} color="primary">
            Proceed
          </Button>
          <Button
            onClick={() => handleCloseWarning()}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="single">
      <div className="singleContainer">
        <AddAttendancePopup />
        <DeleteAttendancePopup />

        <div className="top">
          <div className="left">
            <div className="header">
              <div className="title">
                <p>STUDENT DETAILS</p>
              </div>
            </div>

            <div className="bottomContainer">
              <div className="infoButtonContainer" >
                <Button className="infoButton" href={"update/" + id}>
                  <EditOutlinedIcon style={{ fontSize: 14 }} />
                  &nbsp;Edit 
                </Button>      
              </div>
    
              <div className="infoButtonContainer" >
                <Button className="infoButton" >
                  {" "}
                  <InfoOutlinedIcon style={{ fontSize: 14 }} />
                  &nbsp;Report  
                </Button>  
              </div>
            </div> 

            <div className="item">
              <div className="details">
                <div className="itemHead">
                  <div className="itemImg">
                    <img
                      src={
                        data?.student_image_thumbnail
                          ? "data:image/png;base64," +
                            data?.student_image_thumbnail
                          : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                      }  
                      alt=""
                      className="itemImg img"
                    />
                  </div>
                  <div className="itemTitle">
                    <h1>
                      {(data?.first_name ? data?.first_name : "") +
                        " " +
                        (data?.last_name ? data?.last_name : "")}
                    </h1>
                  </div>
                </div>

                <div className="detailsInfo">
                  <div className="detailItem">
                    <span className="itemKey">Standard:</span>
                    <span className="itemValue">{data?.class?.class_name}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Roll No:</span>
                    <span className="itemValue">{data?.roll_no}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Gender:</span>
                    <span className="itemValue">{data?.gender}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">DOB:</span>
                    <span className="itemValue">{data?.dob}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Joining Date:</span>
                    <span className="itemValue">{data?.joining_date}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Parent Name:</span>
                    <span className="itemValue">{data?.parent_name}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Parent Phone:</span>
                    <span className="itemValue">{data?.parent_phone}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Parent Email:</span>
                    <span className="itemValue">{data?.parent_email}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{data?.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart
              aspect={4 / 2}
              title={
                "Student Attendance ( This Session ): " +
                parseFloat(studentPercentageData?.student_percentage)
                  ?.toFixed(2)
                  ?.toString() +
                "%"
              }
              data={studentsSessionData}
              style={{ color: "black" }}
            />
          </div>
        </div>

        <div className="">
          <Box m="20px">
            <Box display="flex" justifyContent="space-between">
              <Box flex="1 1 15%">
                <div className="featured">
                  <div className="top">
                    <p className="title">Average Attendance</p>
                  </div>

                  <div className="feature-bottom">
                    <h2 className="desc">Monthly</h2>
                    <div className="featuredChart">
                      {" "}
                      <CircularProgressbar
                        value={monthlyData?.student_percentage}
                        text={
                          parseFloat(monthlyData?.student_percentage)
                            ?.toFixed(2)
                            ?.toString() + "%"
                        }
                        strokeWidth={5}
                      />{" "}
                    </div>
                    <p className="title">Attendance</p>
                    <p className="amount">{monthlyData?.total_attendance}</p>

                    <h2 className="desc">Anually</h2>
                    <div className="featuredChart">
                      {" "}
                      <CircularProgressbar
                        value={studentPercentageData?.student_percentage}
                        text={
                          parseFloat(studentPercentageData?.student_percentage)
                            ?.toFixed(2)
                            ?.toString() + "%"
                        }
                        strokeWidth={5}
                      />{" "}
                    </div>
                    <p className="title">Attendance</p>
                    <p className="amount">
                      {studentPercentageData?.total_attendance}
                    </p>
                  </div>
                </div>
              </Box> 

              {/* CALENDAR */}
              <Box flex="1 1 85%" ml="4vh" >
                {/* <StyleWrapper> */}
                <div className="calendar-container">
                  <FullCalendar
                    ref={calendarRef}
                    height="75vh"
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      listPlugin,
                    ]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                    }}
                    initialView="dayGridMonth"
                    // events={[{
                    //       id: "12344",
                    //       title: "Hello",
                    //       start: "2022-07-28",
                    //       end: "2022-07-28",
                    //       allDay: true,
                    //     }]}

                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select={handleDateClick}
                    eventClick={handleEventClick}
                    validRange={{
                      start: startSessionDate,
                      end: endSessionDate,
                    }}
                    eventsSet={(events) => setCurrentEvents(events)}
                    initialEvents={[
                      {
                        id: "12344",
                        title: "Hello",
                        start: "2022-07-28",
                        end: "2022-07-28",
                        allDay: true,
                      },
                    ]}
                  />
                </div>
                {/* </StyleWrapper> */}
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
