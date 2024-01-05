import { DataGrid,gridClasses } from "@mui/x-data-grid";
import { Box, TextField, MenuItem , IconButton, useTheme,Button} from '@mui/material';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from '../../theme';
import { alpha, styled } from '@mui/material/styles';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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

import { useAuth } from "../../providers/AuthProvider";
import AuthAxios from '../../config/AuthAxios';

const ListStudents = () => {

  const dataRef = useRef(null)
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [medium, setMediums] = useState([]);
  const [dataRow , setDataRow]= useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [selectedValue, setSelectedValue] = useState([]);

  const [classValue, setClassValue] = useState(null);
  const [mediumValue, setMediumValue] = useState(null);

  const {userToken} = useAuth();
  const api = AuthAxios(userToken);
  const [loading, setLoading] = useState(true);
  

  // const handleDelete = (id) => {
  //   setData(data.filter((item) => item.id !== id));
  // };

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
      field: 'admission_no',
      headerName: 'Admission No.',
     
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'standard',
      headerName: 'Class',
      
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'medium',
      headerName: 'Medium',
     
      flex: 1,
      cellClassName: 'name-column--cell',
      valueGetter: (params) => params.row?.medium?.type || '',
    },
    {
      field: 'parent_name',
      headerName: 'Parent Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'parent_phone',
      headerName: 'Parent Phone',
      flex: 1,
      cellClassName: 'name-column--cell',
      
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      cellClassName: 'name-column--cell',
      align: 'center',
      width: 200,
      renderCell: (params) => {
        var link = "/students/" + params.row.id;
        return (
          <div className="cellAction">
            <Button 
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
console.log("selectedValue",selectedValue);
  const PAGE_SIZE = [10,25,50,100];

  const [paginationModel, setPaginationModel] = useState({
    pageSize: PAGE_SIZE,
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
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event, value) =>
          apiRef.current.setPage(value - 1)
        }
      />
    );
  }
  useEffect(() => {
    setLoading(true);
    api.get('students')
  .then((students) => {
    console.log('Students:', students.data);
    const currentData = students.data.map((student, index) => ({
      ids:student.id,
      id: index + 1,
      first_name: student.first_name,
      last_name: student.last_name,
      admission_no: student.admission_no,
      standard: student?.class.class_name || "",
      medium: student.medium,
      parent_name: student.parent_name,
      parent_phone: student.parent_phone,
    }));

    setLoading(false);

    // Use setTimeout if you need a delay before setting the state
    setTimeout(() => {
      setDataRow(currentData);
      console.log("dataRow after mapping and setting state:", currentData);
    }, 100); // Adjust the delay time as needed
  })
  .catch((error) => {
    console.error('Error fetching students:', error);
    setLoading(false);
  });

  
    api.get('mediums')
      .then((mediums) => {
        console.log('Mediums:', mediums.data);
        setMediums(mediums.data);
      })
      .catch((error) => {
        console.error('Error fetching mediums:', error);
        setLoading(false);
      });
  
    api.get('standards')
      .then((standards) => {
        console.log('Standards:', standards.data);
        setClasses(standards.data);
      })
      .catch((error) => {
        console.error('Error fetching standards:', error);
        setLoading(false);
      });
  }, []);
  
  


   // Function to call the API and update class_id values
   const deleteStudents = async (ids) => {
    try {
      setLoading(true);
      const response = await api.post('deletestudents', { ids });
      console.log(response.data.message); // Output success message from the server
      
      await api.get('students').then((students) => {setData(students.data);setLoading(false);}).catch((error) => {console.error('Error fetching data:', error);setLoading(false);});
      setSelectedValue([])
      //dataRef.current.api.selectRows([6,3]);
      dataRef.current.refreshCells();
      
      // toast.success('Students Deleted successfully!', {
      //   position: toast.POSITION.TOP_CENTER,
      // });
    } catch (error) {
      console.error('Error deleting students:', error);
      // Show error toast message
      // toast.error('Error deleteing students!', {
      //   position: toast.POSITION.TOP_CENTER,
      // });
    }
  };

  // Function to call the API and update class_id values
  const promoteStudents = async (studentIds) => {
    try {
      setLoading(true);
      const response = await api.post('students/promote', { studentIds });
      console.log(response.data.message); // Output success message from the server
      
      await api.get('students').then((students) => {setData(students.data);setLoading(false);}).catch((error) => {console.error('Error fetching data:', error);setLoading(false);});
      setSelectedValue([])
      //dataRef.current.api.selectRows([6,3]);
      dataRef.current.refreshCells();
      
      // toast.success('Students Promoted successfully!', {
      //   position: toast.POSITION.TOP_CENTER,
      // });
    } catch (error) {
      console.error('Error updating class_id:', error);
      // Show error toast message
      // toast.error('Error promoting students!', {
      //   position: toast.POSITION.TOP_CENTER,
      // });
    }
  };


  const handleSearch = async event => {
    setLoading(true);

    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);

    const params = {
      classId: classValue,
      mediumId: mediumValue,
      //searchText: searchText,
      // start: start,
      // limit: limit,
    }

    if(searchText.length > 0) {
      params.searchText = searchText
    }

    await api.get('students', { params })
    .then(response => {
      const data = response.data; // Assuming the response contains the filtered data from the API
      console.log(data)
       const currentData = data.map((student, index) => ({
        id: index + 1,
        first_name: student.first_name,
        last_name: student.last_name,
        admission_no: student.admission_no,
        standard: student?.class.class_name || "",
        medium: student.medium,
        parent_name: student.parent_name,
        parent_phone: student.parent_phone,
      }));
  
      setLoading(false);
  
      // Use setTimeout if you need a delay before setting the state
      setTimeout(() => {
        setDataRow(currentData);
        console.log("dataRow after mapping and setting state:", currentData);
      }, 100); // Adjust the delay time as needed
    })
   .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);

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
    setLoading(true);

    const name = event.target.name;
    if(name === 'class_selector')
      setClassValue(event.target.value)

    if(name === 'medium_selector')
      setMediumValue(event.target.value)
    
    // const filterTerm = event.target.value;
    // setFilterValue(filterTerm);
    console.log("class",classValue)
    console.log("medium",mediumValue)
   // Send search term and filter term to API
    api
      .get('students', {
        params: {
          classId: event.target.value? (name === 'class_selector'? event.target.value :classValue): null,
          mediumId: event.target.value? (name === 'medium_selector'?event.target.value : mediumValue):null,
          searchText: searchText,
          // start: start,
          // limit: limit,
        },
      })
      .then(response => {
        const data = response.data; // Assuming the response contains the filtered data from the API
        console.log(data)
        const currentData = data.map((student, index) => ({
          id: index + 1,
          first_name: student.first_name,
          last_name: student.last_name,
          admission_no: student.admission_no,
          standard: student?.class.class_name || "",
          medium: student.medium,
          parent_name: student.parent_name,
          parent_phone: student.parent_phone,
        }));
    
        setLoading(false);
    
        // Use setTimeout if you need a delay before setting the state
        setTimeout(() => {
          setDataRow(currentData);
          console.log("dataRow after mapping and setting state:", currentData);
        }, 100); // Adjust the delay time as needed
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);

      });
  };


  return (
    <div className="list">
    
     
    <div className="listContainer">
      <Box m="20px">
      
       
 
      <Box display='flex' justifyContent="flex-end" >
        <Button 
          variant="contained" 
          startIcon={<PersonAddIcon />} 
          color = "primary" 
          href="/create"
          sx={{  mr:2}} 
          >
          Add
        </Button>
        
        <Button 
          variant="contained"
          disabled={selectedValue.length <= 0} 
          color="secondary"
          
          startIcon={<TrendingUpIcon />}
          sx={{ color: 'red', mr:2}} 
          onClick={() => promoteStudents(selectedValue)}
          >
            Promote
        </Button>

        <Button 
          variant="contained"
          disabled={selectedValue.length <= 0} 
          color="warning"
          
          startIcon={<DeleteOutlineOutlinedIcon />}
          sx={{ color: 'white', mr:2}} 
          onClick={() => deleteStudents(selectedValue)}
          >
            Delete
        </Button>

      </Box>


    <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
      
      <Box
        sx={{ mr: 2 }}
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" onChange={handleSearch} />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>

      </Box>

        <TextField
          select
          name = "class_selector"
          label="Class"
          variant="outlined"
          size="small"
          value={classValue}
          sx={{ width: '10%', mr:2}}
          onChange={handleFilterChange}
        >
          <MenuItem disabled value="">Select Class</MenuItem>
          <MenuItem key={-1} value="">All</MenuItem>

          {classes.map(item => (
            <MenuItem key={item.order} value={item.order}>{item.class_name}</MenuItem>
          ))}
        </TextField>


        <TextField
          select
          name = "medium_selector"
          label="Medium"
          variant="outlined"
          size="small"
          value={mediumValue}
          sx={{ width:'10%', mr: 2 }}
          onChange={handleFilterChange}
        >
          <MenuItem disabled value="">Select Medium</MenuItem>
         <MenuItem key={-1} value="">All</MenuItem>
          {
            medium.map(item => (
              <MenuItem key={item.id} value={item.id}>{item.type}</MenuItem>
            ))
          }
          {/* <MenuItem value="admin">Hindi</MenuItem>
          <MenuItem value="manager">English</MenuItem> */}
          
        </TextField>
    </Box>
      
    <Box
        m="20px 0px 20px 0px"
        height="600px"
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
            backgroundColor: "#F9D82A",
            borderBottom: '4',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '4',
            backgroundColor: "#F9D82A",
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
        theme={theme}
        ref = {dataRef}
        //className="datagrid"
        disableSelectionOnClick // Disable row selection on click

        key={data.length}
        rows={dataRow}
        columns={columns}
        //pageSize={10}
        rowsPerPageOptions={[10,25,50,100]}
        pageSize={10}
        checkboxSelection
        pageSizeOptions={PAGE_SIZE}
        // paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slots={{
          pagination: CustomPagination,
        }}
        disableRowSelectionOnClick
        onSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          let selectedArray = Array.from(selectedIDs);
          setSelectedValue(selectedArray);
        }}
        loading={loading}
      />
           

      </Box>
    </Box>
    </div>
    </div>
  );
};

export default ListStudents