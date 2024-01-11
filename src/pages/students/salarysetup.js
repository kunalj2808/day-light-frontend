import React, { useState ,useEffect } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Select,
    Paper,
    Box,
    Grid,
    MenuItem
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import { toast } from 'react-toastify';
import "./style/setup.scss";
// import Header from "../../components/Header";

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';

const StudentSetup = () => {

    const [componentRows, setComponentRows] = useState([]);
    const [salary, setSalary] = useState([]);
    const [componentOrderCounter, setComponentOrderCounter] = useState(1);

    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');

    const getData =  () =>{
        api.get('salarycomponents')
        .then((response) => {
            setSalary(response.data);
        })
        .catch((error) => {
            console.error('Error fetching mediums:', error);
        });
    }

    useEffect(() => {
        getData();

    }, []);

    const {userToken} = useAuth();
    const api = AuthAxios(userToken);

    const UpdateSalary = () => {

        api.post('/salarycomponent', { 
            components: componentRows 
        })
            .then(response => {
                // Handle success
                console.log('Classes updated:', response.data);
                toast.success('Classes updated successfully');
            })
            .catch(error => {
                // Handle error
                console.error('Error updating classes:', error);
                toast.error('Error updating classes');
            });
    };

    const compTypes = [{id:1, name: "addition"},{id:2, name: "deduction"}]
    
   
    const AddSalaryComponent = () => {

        console.log("AddSalaryComponent", componentRows)
        api.post('salarycomponents', { 
            components: { min_range : minSalary , max_range : maxSalary , items : componentRows}
        })
            .then((response) => {
                console.log(response.data)
                setMinSalary('')
                setMaxSalary('')
                getData();
                toast.success('Salary Component added successfully');
            })
            .catch((error) => {
                toast.error('Error adding component: ' + error?.response?.data?.error);
                console.error('Error adding component:', console.error);
            });

    }

    const DeleteSalaryComponents = (id) => {
        api.post('deletesalarycomponents',{
            ids: [id]
        })
            .then((response) => {
                getData();
                toast.success('Salary Component deleted successfully');
            })
            .catch((error) => {
                console.error('Error fetching mediums:', error);
                toast.error('Error deleting component: ' + error?.response?.data?.error);
            });
    }
  


    const handleCellValueChange = (orderNo, key, value) => {
        const updatedRows = componentRows.map((row) =>
            row.order_no === orderNo ? { ...row, [key]: value } : row
        );
         setComponentRows(updatedRows);
    };

    const handleAddRowComponent = () => {
        const newCompoentRow = {
            order_no: componentOrderCounter,
            component_name: '',
            component_type: '',
            component_value: '',
        };
        setComponentOrderCounter(componentOrderCounter + 1);
        setComponentRows([...componentRows, newCompoentRow]);
    };

    const handleDeleteRowComponent = (orderNo) => {
        const updatedRows = componentRows.filter((row) => row.order_no !== orderNo);
        setComponentRows(updatedRows);
        //setComponentOrderCounter(componentRows - 1);
    };
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

    const handleCloseWarning = () => {
        setAddPopup(false);
        setDeletePopup(false);
        setSelectedDate(null);
    };

    const proceed = () => {
        if (popupEntranceTime >= popupExitTime) {
            alert('Entry time cannot be equal to or greater than exit time.');
            return;
        }
        api.post("/setTime", {
                entranceTime: popupEntranceTime,
                exitTime: popupExitTime
            })
            .then((response) => {
                console.log("Time Set:", response.data);
                // Proceed with other actions if the check passes
                setAddPopup(false);
                setDeletePopup(false);
                setSelectedDate(null);
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

    const openModal = () => {
        setAddPopup(true);
    };
    return (
        <div className="new">
             <Dialog open={addPopup} onClose={handleCloseWarning}>
                <DialogTitle>Warning</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to Set the Time?
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
                    <Button onClick={() => proceed()} color="primary">
                        Proceed
                    </Button>
                    <Button onClick={() => handleCloseWarning()} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {/* <Sidebar /> */}
            <div className="newContainer">
                

                <Grid container>
                    <Grid item xs={6} className="section">
                    <Box m="15px" display="flex" alignItems="center">
                        <h2 style={{ marginRight: '15px' }}>Add Component</h2>
                        <Button variant="outlined" size='small' onClick={AddSalaryComponent} sx={{ marginRight: '10px' }}>
                            Add Salary Component
                        </Button>
                        <Button variant="outlined" size='small' onClick={openModal}>
                            Set Entry Time
                        </Button>
                     </Box>
                        <div className="bottom">
                            <Box sx={{width: '100%' , backgroundColor: 'white'}}>
                                <Box sx={{ m:2}} >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Minimum Salary"
                                                type="number"
                                                value={minSalary}
                                                onChange={(e) => setMinSalary(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Maximum Salary"
                                                type="number"
                                                value={maxSalary}
                                                onChange={(e) => setMaxSalary(e.target.value)}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={12}>
                                        <Button variant="contained" color="primary" onClick={handleRangeSelection}>
                                            Select Range
                                        </Button>
                                    </Grid> */}
                                    </Grid>
                                </Box>

                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Component Name</TableCell>
                                                <TableCell>Component Type</TableCell>
                                                <TableCell>Value</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {componentRows.map((row) => (
                                                <TableRow key={row.order_no}>
                                                    <TableCell>
                                                        <TextField
                                                            type="text"
                                                            variant="outlined"
                                                            size="small"
                                                            value={row.component_name}
                                                            onChange={(event) => handleCellValueChange(row.order_no, 'component_name', event.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ padding: '4px', fontSize: '12px' }}>
                                                        <Select
                                                            label="Type"
                                                            name="component_type"
                                                            value={row?.component_type ? row?.component_type : 'select'}
                                                            onChange={(event) => handleCellValueChange(row.order_no, 'component_type', event.target.value)}
                                                            size="small"
                                                        >
                                                            <MenuItem disabled value="select">Select Component Type</MenuItem>
                                                            {compTypes.map(item => (
                                                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            variant="outlined"
                                                            size="small"
                                                            value={row.component_value}
                                                            onChange={(event) => handleCellValueChange(row.order_no, 'component_value', event.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="text"
                                                            color="error"
                                                            onClick={() => handleDeleteRowComponent(row.order_no)}
                                                            size="small"
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="tableButtons">
                                        <Button btn-type="class" variant="outlined" color="primary" onClick={handleAddRowComponent}>
                                            Add Component
                                        </Button>
                                    </div>
                                </TableContainer>

                            </Box>
                        </div>
                    </Grid>

                                    
                    <Grid item xs={6} className="section">
                        <Box m="20px">
                            <h2>Salary Components List</h2>
                        </Box>
                        <div className="bottom">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Min Range</TableCell>
                                            <TableCell>Max Range</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {salary.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.min_range}</TableCell>
                                                <TableCell>{row.max_range}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="text"
                                                        color="error"
                                                        onClick={() => DeleteSalaryComponents(row.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="tableButtons">
                                {/* <Button btn-type="medium" variant="outlined" color="primary" onClick={handleOpenWarning}>
                                    Update Salary Component
                                </Button> */}
                            </div>
                            </TableContainer>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default StudentSetup;
