import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { filter } from 'lodash';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/productspage.css';
// @mui
import {
  Card,
  Table,
  InputLabel,
  Stack,
  Paper,
  Avatar,
  Popover,
  Grid,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  Select,
  TableContainer,
  Dialog,
  TextField,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  TablePagination,
  Menu,
} from '@mui/material';
// components
import Label from './components/label';
import Iconify from './components/iconify';
import Scrollbar from './components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from './sections/@dashboard/user';
import HeaderAdmin from './header';
import Nav from './menu';

const TABLE_HEAD = [
  { id: 'title', label: 'Tên giáo viên', alignRight: false },
  { id: 'location', label: 'Địa chỉ', alignRight: false },
  { id: '', label: 'Giới Tính', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (car) => car.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductsPage() {
  const [open, setOpen] = useState(null);
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0);
  const [deletedCars, setDeletedCars] = useState([]);
  const [openDeletedCarsModal, setOpenDeletedCarsModal] = useState(false);
  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const isAdmin = localStorage.getItem('isAdmin');
  const [orderBy, setOrderBy] = useState('name');
  const [deleteCarId, setDeleteCarId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editCar, setEditCar] = useState(null);
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = cars.map((car) => car.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cars.length) : 0;

  const filteredCars = applySortFilter(cars, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredCars.length && !!filterName;

  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imagePath: '',
    image1: '',
    image2: '',
    categoryID: '',
    image3: '',
    fuel: '',
    chair: '',
  });

  const [addCarErrors, setAddCarErrors] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imagePath: '',
    image1: '',
    image2: '',
    categoryID: '',
    image3: '',
    fuel: '',
    chair: '',
  });

  const [carData, setCarData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imagePath: '',
    image1: '',
    image2: '',
    categoryID: '',
    image3: '',
    fuel: '',
    chair: '',
  });
  const handleFileInputChange = (event, fieldName) => {
    const file = event.target.files[0];
    setEditCar((prevState) => ({
      ...prevState,
      [fieldName]: file,
    }));
  };

  const handleCarInputChange = (event) => {
    const { name, value } = event.target;
    setCarData((prevCarData) => ({
      ...prevCarData,
      [name]: value,
    }));
  };
  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-car');
      const carsData = response.data.cars;
      setCars(carsData);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditCar((prevEditCar) => ({
      ...prevEditCar,
      [name]: value,
    }));

    // Validation
    const errors = { ...formErrors };
    switch (name) {
      case 'title':
        errors.title = value.trim() === '' ? 'Vui lòng nhập tên giáo viên.' : '';
        break;
      case 'categoryID':
        errors.categoryID = value.trim() === '' ? 'Vui lòng nhập danh mục.' : '';
        break;
      case 'description':
        errors.description = value.trim() === '' ? 'Vui lòng nhập mô tả.' : '';
        break;
      case 'price':
        errors.price = value.trim() === '' ? 'Giá tiền phải là số.' : '';
        break;
      case 'location':
        errors.location = value.trim() === '' ? 'Vui lòng nhập địa chỉ.' : '';
        break;
      case 'imagePath':
        errors.imagePath = value.trim() === '' ? 'Vui lòng nhập URL hình ảnh chính.' : '';
        break;
      case 'image1':
        errors.image1 = value.trim() === '' ? 'Vui lòng nhập URL hình ảnh phụ 1.' : '';
        break;
      case 'image2':
        errors.image2 = value.trim() === '' ? 'Vui lòng nhập URL hình ảnh phụ 2.' : '';
        break;
      case 'image3':
        errors.image3 = value.trim() === '' ? 'Vui lòng nhập URL hình ảnh phụ 3.' : '';
        break;
      case 'fuel':
        errors.fuel = value.trim() === '' ? 'Vui lòng nhập nguyên liệu.' : '';
        break;
      case 'chair':
        errors.chair = value.trim() === '' ? 'Số ghế phải là số.' : '';
        break;
      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleConfirmDelete = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.put(`http://localhost:5000/delete-car/${deleteCarId}`, null, {
        headers,
      });

      if (response.data.success) {
        console.log('Xóa xe thành công:', response.data.car);
        setDeleteCarId(null);
        setOpen(null);
        fetchCars();
      }
    } catch (error) {
      console.error('Lỗi khi xóa xe:', error);
    }
  };

  // HANDLE EDIT XE
  const handleEditCar = async (carId) => {
    const isError = Object.values(formErrors).some((error) => error !== '');
    if (isError) {
      console.error('Vui lòng nhập đúng thông tin xe.');
      return;
    }
    try {
      const formData = new FormData();

      formData.append('title', editCar.title);
      formData.append('categoryID', editCar.categoryID);
      formData.append('price', editCar.price);
      formData.append('description', editCar.description);
      formData.append('location', editCar.location);
      formData.append('imagePath', editCar.imagePath);
      formData.append('image1', editCar.image1);
      formData.append('image2', editCar.image2);
      formData.append('image3', editCar.image3);
      formData.append('fuel', editCar.fuel);
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.put(`http://localhost:5000/update-car/${carId}`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setOpenEditDialog(false);
        fetchCars();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin xe:', error);
    }
  };

  // HANDLE UPLOAD XE
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const fetchDeletedCars = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get('http://localhost:5000/get-deleted-cars', {
        headers,
      });
      const deletedCarsData = response.data.deletedCars;
      setDeletedCars(deletedCarsData);
    } catch (error) {
      console.error('Error fetching deleted cars:', error);
    }
  };
  const handleOpenDeletedCarsModal = () => {
    setOpenDeletedCarsModal(true);
    fetchDeletedCars();
  };

  const handleCloseDeletedCarsModal = () => {
    setOpenDeletedCarsModal(false);
  };
  useEffect(() => {
    fetchCars();
  }, []);
  const handleAddCar = async () => {
    try {
      const errors = {};
      if (!carData.title || carData.title.trim() === '') {
        errors.title = 'Vui lòng nhập tên xe.';
      }

      if (!carData.location || carData.location.trim() === '') {
        errors.location = 'Vui lòng nhập địa chỉ.';
      }

      if (!carData.description || carData.description.trim() === '') {
        errors.description = 'Vui lòng nhập mô tả.';
      }

      if (!carData.price || carData.price.trim() === '') {
        errors.price = 'Vui lòng nhập giá tiền.';
      }
      if (!carData.categoryID || carData.categoryID.trim() === '') {
        errors.categoryID = 'Vui lòng nhập ID của danh mục';
      }
      if (!carData.chair || carData.chair.trim() === '') {
        errors.chair = 'Vui lòng nhập số ghế.';
      }
      if (!carData.fuel || carData.fuel.trim() === '') {
        errors.fuel = 'Vui lòng nhập nguyên liệu.';
      }
      if (Object.keys(errors).length > 0) {
        setAddCarErrors(errors);
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('title', carData.title);
      formData.append('categoryID', carData.categoryID);
      formData.append('description', carData.description);
      formData.append('location', carData.location);
      formData.append('price', carData.price);
      formData.append('chair', carData.chair);
      formData.append('fuel', carData.fuel);
      formData.append('imagePath', carData.imagePathFile);
      formData.append('image1', carData.image1File);
      formData.append('image2', carData.image2File);
      formData.append('image3', carData.image3File);
      const response = await axios.post('http://localhost:5000/upload-car', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        console.log('Xe đã được thêm thành công:', response.data.car);
        handleCloseAddDialog();
        fetchCars();
      } else {
        console.error('Lỗi khi thêm xe:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi thêm xe:', error);
    }
  };
  const handleRestoreCar = async (carId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.put(`http://localhost:5000/restore-car/${carId}`, null, {
        headers,
      });

      if (response.data.success) {
        const updatedDeletedCars = deletedCars.filter((deletedCar) => deletedCar._id !== carId);
        setDeletedCars(updatedDeletedCars);
        fetchCars();
      } else {
        console.error('Lỗi khi khôi phục xe:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu khôi phục xe:', error);
    }
  };
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  if (!isAdmin) {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Bạn không phải là Quản trị viên.</h1>
        <p style={{ textAlign: 'center' }}>Nếu là Quản trị viên vui lòng đăng nhập để tiếp tục.</p>
        <a href="/login-admin" style={{ textAlign: 'center', textDecoration: 'none' }}>
          Đăng Nhập
        </a>
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title> Quản Lý Giáo Viên </title>
      </Helmet>
    <HeaderAdmin/>
    <Nav/>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quản Lý Giáo Viên
          </Typography>

          <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
            Thêm Giáo Viên
          </Button>
        </Stack>
        <Button variant="contained" color="primary" onClick={handleOpenDeletedCarsModal}>
        Giáo Viên Đã Xóa
        </Button>
        <Dialog open={openDeletedCarsModal} onClose={handleCloseDeletedCarsModal}>
          <DialogTitle>Giáo Viên Đã Xóa</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableBody>
                  {deletedCars.map((deletedCar) => (
                    <TableRow key={deletedCar._id}>
                      <InputLabel htmlFor="title">Tên Giáo Viên</InputLabel>
                      <TableCell>{deletedCar.title}</TableCell>
                      <InputLabel htmlFor="imagePath">Ảnh Giáo Viên</InputLabel>
                      <Avatar src={deletedCar.imagePath} />
                      <TableCell>
                        <Button onClick={() => handleRestoreCar(deletedCar._id)} variant="contained" color="primary">
                          Khôi Phục
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeletedCarsModal} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Thêm Giáo Viên</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên Giáo Viên"
                  name="title"
                  value={carData.title}
                  onChange={handleCarInputChange}
                  error={!!addCarErrors.title}
                  helperText={addCarErrors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  name="categoryID"
                  value={carData.categoryID}
                  onChange={handleCarInputChange}
                  error={!!addCarErrors.categoryID}
                  helperText={addCarErrors.categoryID}
                >
                   <MenuItem value="66379b38eaf950ae3f560698">Hiệu Trưởng</MenuItem>
                   <MenuItem value="66379b5aeaf950ae3f56069e">Hiệu Trưởng</MenuItem>
                  <MenuItem value="663742bdeaf950ae3f56055e">Giáo Viên</MenuItem>
                  
                </Select>
              </Grid>
            
              <Grid item xs={12}>
                <InputLabel htmlFor="imagePath">Hình ảnh chính</InputLabel>
                <input
                  type="file"
                  id="imagePath"
                  name="imagePath"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setCarData((prevCarData) => ({
                      ...prevCarData,
                      imagePath: file,
                      imagePathFile: file,
                    }));
                  }}
                />
                <Typography color="error">{addCarErrors.imagePath}</Typography>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="imagePath">Hình ảnh thêm</InputLabel>
                <input
                  type="file"
                  id="image1"
                  name="image1"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setCarData((prevCarData) => ({
                      ...prevCarData,
                      image1: file,
                      image1File: file,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="imagePath">Hình ảnh thêm</InputLabel>
                <input
                  type="file"
                  id="image2"
                  name="image2"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setCarData((prevCarData) => ({
                      ...prevCarData,
                      image2: file,
                      image2File: file,
                    }));
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa Chỉ Giáo Viên"
                  name="location"
                  value={carData.location}
                  onChange={handleCarInputChange}
                  error={!!addCarErrors.location}
                  helperText={addCarErrors.location}
                />
              </Grid>
            
              <Grid item xs={12}>
                <InputLabel id="date-label">Giới tính</InputLabel>
                <Select
                  fullWidth
                  name="fuel"
                  value={carData.fuel}
                  onChange={handleCarInputChange}
                  error={!!addCarErrors.fuel}
                  helperText={addCarErrors.fuel}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Hủy</Button>
            <Button onClick={handleAddCar} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={cars.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((car) => (
                    <TableRow hover key={car._id} tabIndex={-1} role="checkbox">
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(car.fullName)}
                          onChange={(event) => handleClick(event, car.fullName)}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={car.title} src={car.imagePath} />
                          <Typography variant="subtitle2" noWrap>
                            {car.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{car.location}</TableCell>
                      <TableCell align="left">{car.fuel}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <MenuItem
                            onClick={() => {
                              setEditCar(car);
                              setOpenEditDialog(true);
                            }}
                          >
                            <Stack direction="column" alignItems="center">
                              <Iconify icon={'eva:edit-fill'} sx={{ mb: 1 }} />
                              <Typography variant="body2" noWrap>
                                Edit
                              </Typography>
                            </Stack>
                          </MenuItem>

                          <MenuItem
                            sx={{ color: 'error.main' }}
                            onClick={() => {
                              setDeleteCarId(car._id);
                              setOpen(true);
                            }}
                          >
                            <Stack direction="column" alignItems="center">
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mb: 1 }} />
                              <Typography variant="body2" noWrap>
                                Xóa
                              </Typography>
                            </Stack>
                          </MenuItem>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cars.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {/* <MenuItem>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Banned
          </MenuItem> */}
      </Popover>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Chỉnh sửa thông tin giáo vi</DialogTitle>
        <br />
        <DialogContent>
          {editCar && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên Giáo Viên"
                  name="title"
                  value={editCar.title}
                  onChange={handleInputChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  name="categoryID"
                  value={carData.categoryID}
                  onChange={handleCarInputChange}
                  error={!!formErrors.categoryID}
                  helperText={formErrors.categoryID}
                >
                  <MenuItem value="66379b38eaf950ae3f560698">Hiệu Trưởng</MenuItem>
                   <MenuItem value="66379b5aeaf950ae3f56069e">Hiệu Trưởng</MenuItem>
                  <MenuItem value="663742bdeaf950ae3f56055e">Giáo Viên</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <input type="file" accept="image/*" onChange={(e) => handleFileInputChange(e, 'imagePath')} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa Chỉ Nhận Xe"
                  name="location"
                  value={editCar.location}
                  onChange={handleInputChange}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Giá Xe/Ngày"
                  name="price"
                  value={editCar.price}
                  onChange={handleInputChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô Tả Xe"
                  name="description"
                  value={editCar.description}
                  onChange={handleInputChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số Ghế"
                  name="chair"
                  value={editCar.chair}
                  onChange={handleInputChange}
                  error={!!formErrors.chair}
                  helperText={formErrors.chair}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="date-label">Nhiên Liệu Sử Dụng</InputLabel>
                <Select
                  fullWidth
                  name="fuel"
                  value={editCar.fuel}
                  onChange={handleCarInputChange}
                  error={!!formErrors.fuel}
                  helperText={formErrors.fuel}
                >
                  <MenuItem value="Xăng">Xăng</MenuItem>
                  <MenuItem value="Điện">Điện</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                {/* Input để chọn file ảnh cho 'image1' */}
                <input type="file" accept="image/*" onChange={(e) => handleFileInputChange(e, 'image1')} />
              </Grid>
              <Grid item xs={12}>
                {/* Input để chọn file ảnh cho 'image2' */}
                <input type="file" accept="image/*" onChange={(e) => handleFileInputChange(e, 'image2')} />
              </Grid>
              <Grid item xs={12}>
                {/* Input để chọn file ảnh cho 'image3' */}
                <input type="file" accept="image/*" onChange={(e) => handleFileInputChange(e, 'image3')} />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={() => handleEditCar(editCar._id, editCar)} color="primary">
                  Lưu thay đổi
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(open)} onClose={handleCloseMenu}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Bạn có chắc chắn muốn xóa xe này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMenu}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
