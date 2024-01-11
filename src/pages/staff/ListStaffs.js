import ReactDOM from 'react-dom';

import { DataGrid,gridClasses } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField, MenuItem , IconButton,DialogActions ,useTheme,Button, Dialog, DialogContent, DialogTitle} from '@mui/material';
import { Grid } from '@mui/material'; // Or appropriate import for your Material-UI version
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from '../../theme';
import { alpha, styled } from '@mui/material/styles';
import DownloadingIcon from '@mui/icons-material/Downloading';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { toast  } from 'react-toastify';

import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
//import { useDemoData } from '@mui/x-data-grid-generator';
import { Theme } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';


import { useState,useEffect,useRef } from "react";
import axios from 'axios';

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';

const ListStaffs = () => {
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState('0'); // State to manage the input value
  const dataRef = useRef(null)
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [dataRow , setDataRow]= useState([]);

  const [departmentValue, setDepartmentValue] = useState(null);
  const [designationValue, setDesignationValue] = useState(null);

  const [filteredRows, setFilteredRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [selectedValue, setSelectedValue] = useState([]);
  const [loading, setLoading] = useState(true);

  const {userToken} = useAuth();
  const api = AuthAxios(userToken);
  const [salaryDate, setSalaryDate] = useState(null);
  const [basicSalary, setBasicSalary] = useState('');
  const [bonus, setBonus] = useState('');

  const [monthlyData, setMonthlyData] = useState(null);
  const [salaryComponents, setSalaryComponents] = useState([]);

  const user =  localStorage.getItem("user");
  const userObject = JSON.parse(user);
  const logo = userObject?.logo


  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  const handleProceed = () => {
    // Perform actions when the "Proceed" button is clicked
    // This function should handle what happens when the user proceeds after selecting a date
    console.log("Proceed with date:", salaryDate);
    const formattedDate = salaryDate?.toISOString().slice(0, 7);
  console.log('formattedDate :>> ', formattedDate);
  navigate(`downloadReport/${formattedDate}`);
    // Add logic to proceed after selecting the date
    handleCloseModal(); // Close the modal if needed
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    // { field: 'id', headerName: 'ID' },
    {
      field: 'first_name',
      headerName: 'First Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'employee_id',
      headerName: 'Employee No.',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
        field: 'mobile_no',
        headerName: 'Mobile No.',
        flex: 1,
        cellClassName: 'name-column--cell',
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        cellClassName: 'name-column--cell',
      },
    {
      field: 'department',
      headerName: 'Department',
      
      flex: 1,
      cellClassName: 'name-column--cell',
      valueGetter: (params) => params.row?.department?.department_name || '',
    },
    {
      field: 'designation',
      headerName: 'Designation',
      
      flex: 1,
      cellClassName: 'name-column--cell',
      valueGetter: (params) => params.row?.designation?.designation_name || '',
    },
    
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      cellClassName: 'name-column--cell',
      align: 'center',
      width: 200,
      renderCell: (params) => {
        var link = "/staff/" + params.row.ids;
        return (
          <div className="cellAction">
            <Button 
            size="small"
              variant="contained" 
              //sx={{  backgroundColor: '#e2e2e2', borderColor: 'white' }}
              color="primary"
              startIcon = {<VisibilityIcon />} 
              href={link}
              >
              View
            </Button>
           
          </div>
        );
      },
    },
    {
      field: "Paid Leaves",
      headerName: "PL",
      flex: 1,
      cellClassName: 'name-column--cell',
      align: 'center',
      width: 200,
      renderCell: (params) => {
        // var link = "/staffs/" + params.row.id;
        return (
          <div className="cellAction">
            <TextField
            placeholder="0"
              // value={0}
              // onChange={handleChange}
              type="number"
              inputProps={{ min: '0', step: '1' }}
      />
          </div>
        );
      },
    },
  ];


  const ODD_OPACITY = 0.2;
  const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: "white",
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
      '&.Mui-selected': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity,
        ),
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
              theme.palette.action.selectedOpacity +
              theme.palette.action.hoverOpacity,
          ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
          },
        },
      },
    },
  }));

  const PAGE_SIZE = [10,25,50,100];

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        page={page + 1}
        count={pageCount}
        // @ts-expect-error
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event, value) =>
          apiRef.current.setPage(value - 1)
        }
      />
    );
  }
  
  // useEffect(() => {
  //   console.log("Fetching staffs...");
  //   api.get('staffs')
  //     .then((staffs) => {
  //       const currentData = staffs.data.map((staff, index) => ({
  //         ids:staff.id,
  //         id: index + 1,
  //         first_name: staff.first_name,
  //         last_name: staff.last_name,
  //         employee_id: staff.employee_id,
  //         mobile_no: staff.mobile_no,
  //         email: staff.email,
  //         department: staff.email,
  //         designation: staff.email,
  //         // standard: student?.class.class_name || "",
  //         // medium: student.medium,
  //         // parent_name: student.parent_name,
  //         // parent_phone: student.parent_phone,
  //       }));
    
  //       setLoading(false);
    
  //       // Use setTimeout if you need a delay before setting the state
  //       setTimeout(() => {
  //         setDataRow(currentData);
  //         console.log("dataRow after mapping and setting state:", dataRow);
  //       }, 10); 
        
        
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching staffs:', error);
  //     });
  
  //   console.log("Fetching departments...");
  //   api.get('departments')
  //     .then((department) => {
  //       console.log("Departments data:", department.data);
  //       setDepartments(department.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching departments:', error);
  //     });
  
  //   console.log("Fetching designations...");
  //   api.get('designations')
  //     .then((designation) => {
  //       console.log("Designations data:", designation.data);
  //       setDesignations(designation.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching designations:', error);
  //     });
  // }, []);
  
 

//   // Function to call the API and update class_id values
//   const promoteStudents = async (studentIds) => {
//     try {
//       const response = await api.post('students/promote', { studentIds });
//       console.log(response.data.message); // Output success message from the server
//       setSelectedValue([])
//       api.get('students').then((students) => {setData(students.data)}).catch((error) => {console.error('Error fetching data:', error);});
//       dataRef.current.refreshCells();
//       toast.success('Students updated successfully!', {
//         position: toast.POSITION.TOP_CENTER,
//       });
//     } catch (error) {
//       console.error('Error updating class_id:', error);
//       // Show error toast message
//       toast.error('Error updating students!', {
//         position: toast.POSITION.TOP_CENTER,
//       });
//     }
//   };

useEffect(() => {

  api.get('staffs').then((staffs) => {setData(staffs.data)}).catch((error) => {console.error('Error fetching data:', error);});
  api.get('departments').then((department) => {setDepartments(department.data)}).catch((error) => {console.error('Error fetching data:', error);});
  api.get('designations').then((designation) => {setDesignations(designation.data)}).catch((error) => {console.error('Error fetching data:', error);});

}, []);
  // Function to call the API and update class_id values
  const deleteStaffs = async (ids) => {
    try {
      setLoading(true);
      const response = await api.post('deletestaffss', { ids });
      console.log(response.data.message); // Output success message from the server
      
      await api.get('staffs').then((students) => {setData(students.data);setLoading(false);}).catch((error) => {console.error('Error fetching data:', error);setLoading(false);});
      setSelectedValue([])
      //dataRef.current.api.selectRows([6,3]);
      dataRef.current.refreshCells();
      
      toast.success('Staffs Deleted successfully!', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error('Error deleting staffs:', error);
      // Show error toast message
      toast.error('Error deleteing students!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const navigate = useNavigate();

  const mine = async (ids) => {
    setLoading(true);
    console.log(ids);

    // Pass the ids to another page/component
    navigate(`staffReport/${ids.join(',')}`);
    // navigate(`staffSalary/${ids.join(',')}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  const handleSearch = event => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);

    api
    .get('staffs', {
      params: {
        departmentId: departmentValue,
        searchText: searchText,
        // start: start,
        // limit: limit,
      },
    })
    .then(response => {
      const data = response.data; // Assuming the response contains the filtered data from the API
      console.log(data)
      setData(data); // Update the state with the filtered data from the API
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    // const filteredData = data.filter(row =>
    //   row.name.toLowerCase().includes(searchTerm) ||
    //   row.roll_no.toString().includes(searchTerm) ||
    //   row.parent_name.toLowerCase().includes(searchTerm) ||
    //   row.parent_phone.includes(searchTerm)
    // );
    // setFilteredRows(filteredData);
  };


  
  const handleFilterChange = event => {
   
    if(event.target.name === 'Department')
      setDepartmentValue(event.target.value)

    if(event.target.name === 'Designation')
      setDesignationValue(event.target.value)

    console.log("departmentValue",departmentValue)
    console.log("designationValue",designationValue)

   // Send search term and filter term to API
    api
      .get('staffs', {
        params: {
          departmentId: event.target.value,
          designationId: event.target.value,
          searchText: searchText,
          // start: start,
          // limit: limit,
        },
      })
      .then(response => {
        const data = response.data; // Assuming the response contains the filtered data from the API
        console.log(data)
        setData(data); // Update the state with the filtered data from the API
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };


  return (
    <div className="list">
    
    <div className="listContainer">
      <Box m="5px">
      <Grid container spacing={0}>
  {/* Left side */}
 
  <Grid item xs={6}>
  <Box display='flex' justifyContent="left" >
        

        <Button 
          variant="contained" 
          size='small'
          startIcon={<PersonAddIcon />} 
          color = "primary" 
          href="/staffs/create"
          sx={{  mr:2}} 
          >
          Add New Staff
        </Button>

        <Button 
          variant="contained"
          disabled={selectedValue.length <= 0} 
          color="warning"
          size='small'
          startIcon={<DeleteOutlineOutlinedIcon />}
          sx={{ color: 'white', mr:2}} 
          onClick={() => deleteStaffs(selectedValue)}
          >
            Delete
        </Button>
        {/* <Button 
          variant="contained"
          disabled={selectedValue.length <= 0} 
          color="warning"
          
          startIcon={<FilePresentIcon />}
          sx={{ color: 'white', mr:2}} 
          // onClick={() => salarystaffs(selectedValue)}
          >
            Salary Slips
        </Button> */}
        {/* <Button 
          variant="contained"
          disabled={selectedValue.length <= 0} 
          color="warning"
          
          startIcon={<FilePresentIcon />}
          sx={{ color: 'white', mr:2}} 
          onClick={() => mine(selectedValue)}
          >
            Staff Report
        </Button> */}
        <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        size='small'
        sx={{ mr: 2 }}
      >
        Download Reports
      </Button>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Download Reports</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="yyyy-MM"
              views={["year", "month"]}
              label="Year and Month"
              minDate={new Date("2012-03-01")}
              maxDate={new Date("2024-06-01")}
              value={salaryDate}
              onChange={setSalaryDate}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button onClick={handleProceed} variant="contained" color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
  </Grid>
  {/* Right side */}
  <Grid item xs={6}>
  <Box display="flex" alignItems="" justifyContent="left" mb={2}>
      
      <Box
        sx={{ mr: 2 }}
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
        
      >
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" onChange={handleSearch} />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>

      </Box>

        <TextField
          select
          name = "department_selector"
          label="Department"
          variant="outlined"
          size="small"
          style={{ width: '130px' }}
          value={departmentValue}
          sx={{ width: '10%', mr:2}}
          onChange={handleFilterChange}
        >
          <MenuItem disabled value="">Select Department</MenuItem>
          <MenuItem key={-1} value="">All</MenuItem>

          {departments.map(item => (
            <MenuItem key={item.id} value={item.id}>{item.department_name}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          name = "designation_selector"
          label="Designation"
          variant="outlined"
          size="small"
          style={{ width: '125px' }}
          value={designationValue}
          sx={{ width: '10%', mr:2}}
          onChange={handleFilterChange}
        >
          <MenuItem disabled value="">Select Designation</MenuItem>
          <MenuItem key={-1} value="">All</MenuItem>

          {designations.map(item => (
            <MenuItem key={item.id} value={item.id}>{item.designation_name}</MenuItem>
          ))}
        </TextField>

    </Box>
  </Grid>
</Grid>
      
    <Box
        m="20px 0px 20px 0px"
        height="518px"
        //height="70vh" to make datatable non scrolling
        
        sx={{
          '& .MuiDataGrid-root': {
            border: '4',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1',
          },
          
          '& .name-column--cell': {
            color: colors.primary[100],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: "#1890ff",
            borderBottom: '4',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '4',
            backgroundColor: "",
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[300]} !important`,
          },
          '& .MuiDataGrid-row': {
            backgroundColor: colors.primary[400],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-row.odd': {
            backgroundColor: "white",
            borderBottom: 'none',
          },
          
        }}
      >
        <DataGrid
       getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      disableSelectionOnClick // Disable row selection on click
        theme={theme}
        ref = {dataRef}
        //className="datagrid"
        key={data.length}
        rows={data}
        columns={columns}
        //pageSize={10}
        rowsPerPageOptions={[10,25,50,100]}
        pageSize={10}
        checkboxSelection
        pageSizeOptions={PAGE_SIZE}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slots={{
          pagination: CustomPagination,
        }}
        onSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          console.log(selectedIDs)
          let selectedArray = Array.from(selectedIDs);
          setSelectedValue(selectedArray);
          //selectedArray.map(value=> console.log(value))
          // const selectedRowData = selectedIDs.filter(row => selectedIDs.has(row.id.toString()));
          // console.log(selectedRowData)
        }}
      />
      </Box>
    </Box>
    </div>
    </div>
  );
};

export default ListStaffs