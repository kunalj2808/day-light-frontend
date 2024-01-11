import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Box,
  Grid, 
} from "@mui/material"; 
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style/setup.scss";
import {  toast } from 'react-toastify';

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from "../../config/AuthAxios";

const StaffSetup = () => {
  const [designationRows, setDesignationRows] = useState([]);
  const [designationOrderCounter, setDesignationOrderCounter] = useState(1);

  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [initialDesignationOrder, setInitialDesignationOrder] = useState(0);

  useEffect(() => {
    api
      .get("departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  useEffect(() => {
    api
      .get("designations")
      .then((response) => {
        setDesignations(response.data);
        console.log(response.data);
        setDesignationRows(
          response.data.map((designation, index) => ({
            order_no: designation.des_id,
            designation_name: designation.designation_name,
            department_id: designation.department_id,
            entry_time: designation.entry_time,
            exit_time: designation.exit_time,
          }))
        );
        setDesignationOrderCounter(response.data.length + 1);
        setInitialDesignationOrder(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching designations:", error);
      });
  }, []);

  const { userToken } = useAuth();
  const api = AuthAxios(userToken);

  const handleUpdatedesignations = () => {
    const isValid = designationRows.every(
      (row) => row.entry_time < row.exit_time
    );
    if (!isValid) {
      toast.error("Start time must be less than end time for all rows");
      return;
    }

    api
      .post("/designations", { designations: designationRows })
      .then((response) => {
        console.log("Designations updated:", response.data);
        toast.success("Designations updated successfully");
      })
      .catch((error) => {
        console.error("Error updating designations:", error);
        toast.error("Error updating designations");
      });
  };

  const handleAddDesignationRow = () => {
    const newDesignationRow = {
      order_no: designationOrderCounter,
      designation_name: "",
      department_id: "",
      entry_time: "",
      exit_time: "",
    };
    setDesignationOrderCounter(designationOrderCounter + 1);
    setDesignationRows([...designationRows, newDesignationRow]);
  };

  const handleDeleteRow = (orderNo, type) => {
    if (type === "designation") {
      const initialDesignation = designations.find(
        (designation, index) => designation.des_id === orderNo
      );
      if (initialDesignation) {
        console.log(
          "Cannot delete initial designation:",
          initialDesignation.designation_name
        );
        toast.error("Cannot delete initial designation");
        return;
      }
      const updatedRows = designationRows.filter(
        (row) => row.order_no !== orderNo
      );
      setDesignationRows(updatedRows);
      setDesignationOrderCounter(designationOrderCounter - 1);
    }
  };

  const handleCellValueChange = (orderNo, key, value, type) => {
    if (type === "designation") {
      const updatedRows = designationRows.map((row) =>
        row.order_no === orderNo ? { ...row, [key]: value } : row
      );
      setDesignationRows(updatedRows);
    }
  };

  const [openWarning, setOpenWarning] = useState(false);

  const handleOpenWarning = () => {
    const isValid = designationRows.every(
      (row) => row.entry_time < row.exit_time
    );
    if (!isValid) {
      toast.error("Start time must be less than end time for all rows");
      return;
    }
    setOpenWarning(true);
  };

  const handleCloseWarning = () => {
    setOpenWarning(false);
  };

  const handleProceedUpdate = () => {
    handleUpdatedesignations();
    handleCloseWarning();
  };

  return (
    <div className="new">
      <div className="newContainer">
        <Dialog open={openWarning} onClose={handleCloseWarning}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Once you created designations, they cannot be deleted within the
              current session. However, you can update and add new ones anytime.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProceedUpdate} color="primary">
              Proceed
            </Button>
            <Button onClick={handleCloseWarning} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container>
          <Grid item xs={12} className="section">
            <Box m="20px">
              <h2>Add designations</h2>
              <Box display="flex" justifyContent="flex-start">
                <Button variant="outlined" onClick={handleAddDesignationRow}>
                  Add
                </Button>
              </Box>
            </Box>
            <div className="bottom">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order No</TableCell>
                      <TableCell>Designation Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {designationRows.map((row) => (
                      <TableRow key={row.order_no}>
                        <TableCell>{row.order_no}</TableCell>
                        <TableCell style={{ padding: "4px", fontSize: "12px" }}>
                          <TextField
                            value={row.designation_name}
                            onChange={(e) =>
                              handleCellValueChange(
                                row.order_no,
                                "designation_name",
                                e.target.value,
                                "designation"
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            label="Designation"
                            name="department_id"
                            value={
                              row?.department_id ? row?.department_id : "select"
                            }
                            onChange={(event) =>
                              handleCellValueChange(
                                row.order_no,
                                "department_id",
                                event.target.value,
                                "designation"
                              )
                            }
                          >
                            <MenuItem disabled value="select">
                              Select Department
                            </MenuItem>
                            {departments.map((item) => (
                              <MenuItem key={item?.id} value={item?.id}>
                                {item?.department_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            value={row.entry_time}
                            onChange={(e) =>
                              handleCellValueChange(
                                row.order_no,
                                "entry_time",
                                e.target.value,
                                "designation"
                              )
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            value={row.exit_time}
                            onChange={(e) =>
                              handleCellValueChange(
                                row.order_no,
                                "exit_time",
                                e.target.value,
                                "designation"
                              )
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            disabled={row.order_no <= initialDesignationOrder}
                            variant="text"
                            color="error"
                            onClick={() =>
                              handleDeleteRow(row.order_no, "designation")
                            }
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="tableButtons">
                  <Button
                    btn-type="designation"
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenWarning}
                  >
                    Update designations
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

export default StaffSetup;
