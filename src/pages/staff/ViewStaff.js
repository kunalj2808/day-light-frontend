import "./style/view.scss";
import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
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
    TextField
} from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";

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
import AuthAxios from '../../config/AuthAxios';

const ViewStaff = () => {

    // change thse value dynamically
    const startSessionDate = new Date('2023-07-01'); // Set your desired start date
    const endSessionDate = new Date('2024-06-30'); // Set your desired end date


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
            month: new Date()
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

    }

    const getAttendanceData = async () => {
        // Fetch data from an API using Axios
        await api
            .get('staffattendance/' + id)
            .then(response => {
                const data = response.data; // Assuming the response contains the array of staff data

                // eslint-disable-next-line array-callback-return
                if (calendarRef.current) {
                    calendarRef.current.getApi().removeAllEvents()
                    data.map(event => {
                        calendarRef.current.getApi().addEvent({
                            id: event.id,
                            title: event.status,
                            start: event.day,
                            end: event.exit_time
                            //allDay:true
                        });
                    })
                }

                let events = data.map((item) => ({
                    id: item.id,
                    title: item.status,
                    start: combineDateTime(item.day, item.entrance_time),
                    end: combineDateTime(item.day, item.exit_time),
                    allDay: false
                }))
                setCurrentEvents(events); // Update the state with the fetched data
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }


    useEffect(() => {
        console.log("heaven");
        // Fetch data from an API using Axios
        api
            .get('staffs/' + id)
            .then(response => {
                const data = response.data; // Assuming the response contains the array of staff data
                console.log("staff data", data);
                setData(data); // Update the state with the fetched data

                console.log("image", data.staff_image);
                //setFilteredRows(data); // Set initial filtered rows

            })
            .catch(error => {
                console.error('Error fetching data:', error);
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
        const [dateYear, dateMonth, dateDay] = dateOnly.split('-').map(Number);
        const [timeHour, timeMinute, timeSecond] = timeOnly.split(':').map(Number);

        const combinedDate = new Date(dateYear, dateMonth - 1, dateDay, timeHour, timeMinute, timeSecond);
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
        console.log(date, jsEvent, view)
        setAddPopup(true);
        setSelectedDate(date.start)
        setPopupEntranceTime(null)
        setPopupExitTime(null)
    };

    const handleEventClick = (selected) => {
        console.log(selected.event.start);
        if (selected.event.start) {
            setDeletePopup(true);
            setSelectedDate(selected.event.start)
        } else {
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
            .post("/createstaffattendance", {
                staffId: id,
                day: selectedDate,
                entranceTime: popupEntranceTime,
                exitTime: popupExitTime
            })
            .then((response) => {
                // Handle success
                getAttendanceData(id);
                getStaffAnalyticsData();
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
            .post("/deletestaffattendance", {
                staffId: id,
                day: selectedDate,
            })
            .then((response) => {
                // Handle success
                getAttendanceData(id);
                getStaffAnalyticsData();
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
                                <p>STAFF DETAILS</p>
                            </div>
                        </div>


                        <div className="bottomContainer">
                            <div className="infoButtonContainer">
                                <Button className="infoButton" href={"update/" + id}>
                                    <EditOutlinedIcon style={{ fontSize: 14 }} />
                                    &nbsp;Edit
                                </Button>
                            </div>

                            <div className="infoButtonContainer">
                                <Button className="infoButton" href={"salarySlip/" + id}>
                                    {" "}
                                    <InfoOutlinedIcon style={{ fontSize: 14 }} />
                                    &nbsp;Salary Slip
                                </Button>
                            </div>
                        </div>


                        <div className="item">
                            <div className="details">
                                <div className="itemHead">
                                    <div className="itemImg">
                                        <img
                                            src={
                                                data?.staff_image_thumbnail ? 'data:image/png;base64,' + data?.staff_image_thumbnail : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                            }
                                            //src={'data:image/png;base64,' + data?.staff_image_thumbnail} 
                                            alt=""
                                            className="itemImg"
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
                                    <div className="details">

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
                                            <span className="itemKey">Aadhar No:</span>
                                            <span className="itemValue">{data?.aadhar_no}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Mobile No:</span>
                                            <span className="itemValue">{data?.mobile_no}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Email:</span>
                                            <span className="itemValue">{data?.email}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Blood Group:</span>
                                            <span className="itemValue">{data?.blood_group}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Emergency Contact:</span>
                                            <span className="itemValue">{data?.emergency_contact}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Department:</span>
                                            <span className="itemValue">{data?.department?.department_name}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Designation:</span>
                                            <span className="itemValue">{data?.designation?.designation_name}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Residential Address:</span>
                                            <span className="itemValue">{data?.r_address}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Residential City:</span>
                                            <span className="itemValue">{data?.r_city}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Residential State:</span>
                                            <span className="itemValue">{data?.r_state}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Residential Pincode:</span>
                                            <span className="itemValue">{data?.r_pincode}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Permanent Address:</span>
                                            <span className="itemValue">{data?.p_address}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Permanent City:</span>
                                            <span className="itemValue">{data?.p_city}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Permanent State:</span>
                                            <span className="itemValue">{data?.p_state}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Permanent Pincode:</span>
                                            <span className="itemValue">{data?.p_pincode}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Bank Name:</span>
                                            <span className="itemValue">{data?.bank_name}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Bank Branch:</span>
                                            <span className="itemValue">{data?.bank_branch}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Bank IFSC:</span>
                                            <span className="itemValue">{data?.bank_ifsc}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">Account No:</span>
                                            <span className="itemValue">{data?.acc_no}</span>
                                        </div>

                                        <div className="detailItem">
                                            <span className="itemKey">PF No:</span>
                                            <span className="itemValue">{data?.pf_no}</span>
                                        </div>
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
                                parseFloat(staffPercentageData?.staff_percentage)
                                    ?.toFixed(2)
                                    ?.toString() +
                                "%"
                            }
                            data={staffsSessionData}
                            style={{ color: "black" }}
                        />
                    </div>
                </div>
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
                                        <p className="amount">
                                            {monthlyData?.total_attendance}
                                        </p>

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
                                        }
                                    ]}
                                />
                            </Box>
                        </Box>
                    </Box>
                </div></div>
        </div>

    );
};

export default ViewStaff;
