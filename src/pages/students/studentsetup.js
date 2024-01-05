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
    Paper,
    Box,
    Grid,
    Card
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import { ToastContainer,toast } from 'react-toastify';
import "./style/setup.scss";
import axios from "axios"

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';

const StudentSetup = () => {
    const [classRows, setClassRows] = useState([]);
    const [mediumRows, setMediumRows] = useState([]);
    const [classOrderCounter, setClassOrderCounter] = useState(1);
    const [mediumOrderCounter, setMediumOrderCounter] = useState(1);

    const [mediums, setMediums] = useState([]);
    const [classes, setClasses] = useState([]);

    const [initialClassOrder, setInitialClassOrder] = useState(0);
    const [initialMediumOrder, setInitialMediumOrder] = useState(0);

    useEffect(() => {
        api.get('mediums')
            .then((response) => {
                setMediums(response.data);
                setMediumRows(response.data.map((medium, index) => ({
                    order_no: medium.mid,
                    medium_name: medium.type,
                })));
                setMediumOrderCounter(response.data.length + 1);
                setInitialMediumOrder(response.data.length);

            })
            .catch((error) => {
                console.error('Error fetching mediums:', error);
            });

        api.get('standards')
            .then((response) => {
                setClasses(response.data);
                setClassRows(response.data.map((classItem, index) => ({
                    order_no: classItem.order,
                    class_name: classItem.class_name,
                })));
                setClassOrderCounter(response.data.length + 1)
                setInitialClassOrder(response.data.length);
            })
            .catch((error) => {
                console.error('Error fetching classes:', error);
            });
    }, []);

    const {userToken} = useAuth();
    const api = AuthAxios(userToken);

    const handleUpdateClasses = () => {
        // Call Axios function to update classes
        // For example:
        api.post('/standards', { 
            classes: classRows 
        })
            .then(response => {
                // Handle success
                console.log('Classes updated:', response.data);
                // toast.success('Classes updated successfully');
            })
            .catch(error => {
                // Handle error
                console.error('Error updating classes:', error);
                // toast.error('Error updating classes');
            });
    };
    
    const handleUpdateMediums = () => {
        // Call Axios function to update mediums
        // For example:
        api.post('/mediums', { mediums: mediumRows })
            .then(response => {
                // Handle success
                console.log('Mediums updated:', response.data);
                // toast.success('Mediums updated successfully');
            })
            .catch(error => {
                // Handle error
                console.error('Error updating mediums:', error);
                // toast.error('Error updating mediums');
            });
    };

    const handleAddClassRow = () => {
        const newClassRow = {
            order_no: classOrderCounter,
            class_name: '',
        };
        setClassOrderCounter(classOrderCounter + 1);
        setClassRows([...classRows, newClassRow]);
    };

    const handleAddMediumRow = () => {
        const newMediumRow = {
            order_no: mediumOrderCounter,
            medium_name: '',
        };
        setMediumOrderCounter(mediumOrderCounter + 1);
        setMediumRows([...mediumRows, newMediumRow]);
    };

    const handleDeleteRow = (orderNo, type) => {
        if (type === 'class') {
            // Check if the row is present in the initial classes data
            const initialClass = classes.find((classItem, index) => classItem.order === orderNo);
            if (initialClass) {
                console.log('Cannot delete initial class:', initialClass.class_name);
                // toast.error('Cannot delete initial class');
                return;
            }
            const updatedRows = classRows.filter((row) => row.order_no !== orderNo);
            // Adjust order numbers of remaining rows
            const updatedRowsWithAdjustedOrder = updatedRows.map((row, index) => ({
                ...row,
                order_no: index + 1,
            }));
            setClassRows(updatedRowsWithAdjustedOrder);

            setClassOrderCounter(classOrderCounter -1);
        } else if (type === 'medium') {
            // Check if the row is present in the initial mediums data
            const initialMedium = mediums.find((medium, index) => medium.mid === orderNo);
            if (initialMedium) {
                console.log('Cannot delete initial medium:', initialMedium.medium_name);
                // toast.error('Cannot delete initial medium');
                return;
            }
            const updatedRows = mediumRows.filter((row) => row.order_no !== orderNo);
            setMediumRows(updatedRows);
            setMediumOrderCounter(mediumOrderCounter-1);
        }
    };

    const handleCellValueChange = (orderNo, key, value, type) => {
        if (type === 'class') {
            const updatedRows = classRows.map((row) =>
                row.order_no === orderNo ? { ...row, [key]: value } : row
            );
            setClassRows(updatedRows);
        } else if (type === 'medium') {
            const updatedRows = mediumRows.map((row) =>
                row.order_no === orderNo ? { ...row, [key]: value } : row
            );
            setMediumRows(updatedRows);
        }
    };

    const [openWarning, setOpenWarning] = useState(false);
    const [popupType, setPopupType] = useState('');

    const handleOpenWarning = (e) => {
        console.log("e",e.target.getAttribute("btn-type"));
        setOpenWarning(true);
        setPopupType(e.target.getAttribute("btn-type"));
    };

    const handleCloseWarning = () => {
        setOpenWarning(false);
    };

    const handleProceedUpdate = () => {
        if (popupType === 'class') {
            handleUpdateClasses();
        } else if (popupType === 'medium') {
            handleUpdateMediums();
        }
        handleCloseWarning();
    };

    return (
        <div className="new">
            <div className="newContainer">
                {/* <ToastContainer /> */}
                <Dialog open={openWarning} onClose={handleCloseWarning}>
                    <DialogTitle>Warning</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Once you created classes or mediums, they cannot be deleted within the current session.
                            However, you can update and add new ones anytime.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleProceedUpdate()} color="primary">
                            Proceed
                        </Button>
                        <Button onClick={() => handleCloseWarning()} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid container>
                    <Grid item xs={6} className="section">
                    <Box m="20px">
                    <Card style={{ padding: '7px', backgroundColor: '#5175f8' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                        <h2 style={{ color: 'white', margin: 0 }}>Add Classes</h2>
                        <Button variant="outlined" color="error" onClick={handleAddClassRow}>
                            Add
                            </Button>
                        </Box>
                    </Card>
                 </Box>
                        <div className="bottom">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order No</TableCell>
                                            <TableCell>Class Name</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classRows.map((row) => (
                                            <TableRow key={row.order_no}>
                                                <TableCell >{row.order_no}</TableCell>
                                                <TableCell style={{ padding: '5px', fontSize: '2px',}}>
                                                    <TextField
                                                        value={row.class_name}
                                                        onChange={(e) =>
                                                            handleCellValueChange(
                                                                row.order_no,
                                                                'class_name',
                                                                e.target.value,
                                                                'class'
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                
                                                    <Button
                                                        disabled={row.order_no <= initialClassOrder}
                                                        variant="text"
                                                        color="error"
                                                        onClick={() => handleDeleteRow(row.order_no, 'class')}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="tableButtons">
                                    <Button btn-type="class" variant="outlined" color="primary" onClick={handleOpenWarning}>
                                        Update Classes
                                    </Button>
                                </div>

                            </TableContainer>
                        </div>
                    </Grid>

                    
                    <Grid item xs={6} className="section" >
                    <Box m="20px">
                    <Card style={{ padding: '7px', backgroundColor: '#5175f8' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                        <h2 style={{ color: 'white', margin: 0 }}>Add Medium</h2>
                        <Button variant="outlined" color="error" onClick={handleAddMediumRow}>
                            Add
                            </Button>
                        </Box>
                    </Card>
                 </Box>
                        <div className="bottom" style={{ marginLeft:'12px'}}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order No</TableCell>
                                            <TableCell>Medium Name</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mediumRows.map((row) => (
                                            <TableRow key={row.order_no}>
                                                <TableCell>{row.order_no}</TableCell>
                                                <TableCell style={{ padding: '4px', fontSize: '12px',}}>
                                                    <TextField
                                                        value={row.medium_name}
                                                        onChange={(e) =>
                                                            handleCellValueChange(
                                                                row.order_no,
                                                                'medium_name',
                                                                e.target.value,
                                                                'medium'
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                {/* {row.order_no > initialMediumOrder && ( */}
                                                    <Button
                                                        disabled={row.order_no <= initialMediumOrder}
                                                        variant="text"
                                                        color="error"
                                                        onClick={() => handleDeleteRow(row.order_no, 'medium')}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                {/* )} */}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="tableButtons">
                                <Button btn-type="medium" variant="outlined" color="primary" onClick={handleOpenWarning}>
                                    Update Mediums
                                </Button>
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
