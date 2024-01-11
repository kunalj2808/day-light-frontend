import "./style/view.scss";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Chart from "../../components/material/Chart";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import { usePDF } from "react-to-pdf";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import {  toast } from "react-toastify";

import {
  Box,
  List as List1,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  Card,
  Col,
  Row,
  Tooltip,
  Avatar,
  Progress,
  Upload,
  message,
  Timeline,
  Typography,
  Radio,
  Button,
} from "antd";
import { tokens } from "../../theme";
import LineChart from "../components/chart/LineChart";
import profilavatar from "../../../src/assets/images/face-1.jpg";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";

const ViewStaff = () => {
  // change thse value dynamically
  const startSessionDate = new Date("2023-07-01"); // Set your desired start date
  const endSessionDate = new Date("2024-06-30"); // Set your desired end date
  const { Title, Paragraph } = Typography;

  const { id } = useParams();

  const [data, setData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const calendarRef = useRef();
  const [sessionAttendance, setSessionAttendance] = useState([]);

  const [staffPercentageData, setStaffPercentageData] = useState(null);
  const [staffsSessionData, setStaffSessionData] = useState([]);
  const [monthlyData, setMonthlyData] = useState();

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);
  // const { toPDF, targetRef } = usePDF({ filename: "salaryslip.pdf" });
  const deletebtn = [
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2C8.62123 2 8.27497 2.214 8.10557 2.55279L7.38197 4H4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6L4 16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H12.618L11.8944 2.55279C11.725 2.214 11.3788 2 11 2H9ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V8ZM12 7C11.4477 7 11 7.44772 11 8V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V8C13 7.44772 12.5523 7 12 7Z"
        fill="#111827"
        className="fill-danger"
      ></path>
    </svg>,
  ];
  const pencil = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path
        d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
        className="fill-gray-7"
      ></path>
    </svg>,
  ];

  const getStaffAnalyticsData = () => {
    api
      .get("staffspercentagebyid/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("percentage", data);
        setStaffPercentageData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    api
      .get("staffssessionpercentagebyid/" + id)
      .then(async (response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("session", data);
        let chartData = await Promise.all(
          data.map((value, i) => {
            return {
              name: value.monthName,
              Total: parseFloat(value.staff_percentage).toFixed(2),
            };
          })
        );
        console.log("chartData", chartData);
        setStaffSessionData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    let params = {
      id: id,
      month: new Date(),
    };

    api
      .get("staffsmonthlypercentage", { params })
      .then(async (response) => {
        const data = response.data; // Assuming the response contains the array of student data
        console.log("monthly", data);
        setMonthlyData(data);
      })
      .catch((error) => {
        console.error("Error fetching monthly data:", error);
      });
  };

  const getAttendanceData = async () => {
    // Fetch data from an API using Axios
    await api
      .get("staffattendance/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data

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

        let events = data.map((item) => ({
          id: item.id,
          title: item.status,
          start: combineDateTime(item.day, item.entrance_time),
          end: combineDateTime(item.day, item.exit_time),
          allDay: false,
        }));
        setCurrentEvents(events); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    console.log("heaven");
    // Fetch data from an API using Axios
    api
      .get("staffs/" + id)
      .then((response) => {
        const data = response.data; // Assuming the response contains the array of staff data
        console.log("staff data", data);
        setData(data); // Update the state with the fetched data

        console.log("image", data.staff_image);
        //setFilteredRows(data); // Set initial filtered rows
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    getStaffAnalyticsData();
  }, [id]);

  useEffect(() => {
    const temp = [
      { name: "July", Total: 1200 },
      { name: "Aug", Total: 2100 },
      { name: "Sep", Total: 800 },
      { name: "Oct", Total: 1600 },
      { name: "Nov", Total: 900 },
      { name: "Dec", Total: 1700 },
      { name: "Jan", Total: 1200 },
      { name: "Feb", Total: 2100 },
      { name: "March", Total: 800 },
      { name: "April", Total: 1600 },
      { name: "May", Total: 900 },
      { name: "June", Total: 1700 },
    ];

    setSessionAttendance(temp);
    getAttendanceData();
  }, [id]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  function combineDateTime(dateOnly, timeOnly) {
    // Assuming dateOnly is in 'YYYY-MM-DD' format and timeOnly is in 'HH:mm:ss' format
    const [dateYear, dateMonth, dateDay] = dateOnly.split("-").map(Number);
    const [timeHour, timeMinute, timeSecond] = timeOnly.split(":").map(Number);

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

  // const handleDateClick = (selected) => {
  //     const title = prompt("Please enter a new title for your event");
  //     const calendarApi = selected.view.calendar;
  //     calendarApi.unselect();

  //     if (title) {
  //         calendarApi.addEvent({
  //             id: `${selected.dateStr}-${title}`,
  //             title,
  //             start: selected.startStr,
  //             end: selected.endStr,
  //             allDay: selected.allDay,
  //         });
  //     }
  // };

  // const handleEventClick = (selected) => {
  //     if (
  //         window.confirm(
  //             `Are you sure you want to delete the event '${selected.event.title}'`
  //         )
  //     ) {
  //         selected.event.remove();
  //     }
  // };

  const [addPopup, setAddPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [popupEntranceTime, setPopupEntranceTime] = useState(null);
  const [popupExitTime, setPopupExitTime] = useState(null);

  const handleDateClick = (date, jsEvent, view) => {
    console.log(date, jsEvent, view);
    setAddPopup(true);
    setSelectedDate(date.start);
    setPopupEntranceTime(null);
    setPopupExitTime(null);
  };

  const handleEventClick = (selected) => {
    console.log(selected.event.start);
    if (selected.event.start) {
      setDeletePopup(true);
      setSelectedDate(selected.event.start);
    } else {
      toast.error("Error...");
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
      .post("/createstaffattendance", {
        staffId: id,
        day: selectedDate,
        entranceTime: popupEntranceTime,
        exitTime: popupExitTime,
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStaffAnalyticsData();
        console.log("Attendance added:", response.data);
        toast.success("Attendance added successfully");
        handleCloseWarning();
      })
      .catch((error) => {
        // Handle error
        console.error("Error adding attendance:", error.response.data);
        toast.error("Error Adding attendance: " + error.response.data.error);
        handleCloseWarning();
      });
  };

  const deleteAttendanceEvent = () => {
    console.log(selectedDate);

    api
      .post("/deletestaffattendance", {
        staffId: id,
        day: selectedDate,
      })
      .then((response) => {
        // Handle success
        getAttendanceData(id);
        getStaffAnalyticsData();
        console.log("Attendance deleted:", response.data);
        toast.success("Attendance deleted successfully");
        handleCloseWarning();
      })
      .catch((error) => {
        // Handle error
        console.error("Error deleting attendance:", error.response.data);
        toast.error("Error Deleting attendance: " + error.response.data.error);
        handleCloseWarning();
      });
  };

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
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Row gutter={[24, 0]}>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={14}
                  className="mb-24"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar.Group>
                    <Avatar size={74} shape="square" src={profilavatar} />
                  </Avatar.Group>
                  <Title
                    level={4}
                    style={{ marginLeft: "10px", marginBottom: "0" }}
                  >
                    {(data?.first_name ? data?.first_name : "") +
                      " " +
                      (data?.last_name ? data?.last_name : "")}
                  </Title>
                </Col>
              </Row>
              <div className="detailsInfos">
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
              <div className="col-action">
                <Button type="link" href={"update/" + id}>
                  {pencil} EDIT
                </Button>
                <Button className="infoButton" type="link">
                  {deletebtn} Report
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart data={staffsSessionData} />
            </Card>
          </Col>
        </Row>
        <div className="bottom">
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
                        value={monthlyData?.staff_percentage}
                        text={
                          parseFloat(monthlyData?.staff_percentage)
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
                        value={staffPercentageData?.staff_percentage}
                        text={
                          parseFloat(staffPercentageData?.staff_percentage)
                            ?.toFixed(2)
                            ?.toString() + "%"
                        }
                        strokeWidth={5}
                      />{" "}
                    </div>
                    <p className="title">Attendance</p>
                    <p className="amount">
                      {staffPercentageData?.total_attendance}
                    </p>
                  </div>
                </div>
              </Box>

              {/* CALENDAR */}
              <Box flex="1 1 85%" ml="4vh">
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
                  validRange={{ start: startSessionDate, end: endSessionDate }}
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
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ViewStaff;
