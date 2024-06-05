import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { filter } from 'lodash';
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
  { id: 'title', label: 'Tên Sự Kiện', alignRight: false },
  { id: 'content', label: 'Mô Tả Sự Kiện', alignRight: false },
  { id: '', label: 'Hoạt động', alignRight: false },
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
    return filter(array, (event) => event.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function EventsPage() {
  const [open, setOpen] = useState(null);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [deletedEvents, setDeletedEvents] = useState([]);
  const [openDeletedEventsModal, setOpenDeletedEventsModal] = useState(false);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const isAdmin = localStorage.getItem('isAdmin');
  const [orderBy, setOrderBy] = useState('name');
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editEvent, setEditEvent] = useState(null);
  const [formErrors, setFormErrors] = useState({
    title: '',
    imageEvent: '',
    content: ''
  });

  const [addEventErrors, setAddEventErrors] = useState({
    title: '',
    imageEvent: '',
    content: ''
  });

  const [eventData, setEventData] = useState({
    title: '',
    imageEvent: '',
    content: ''
  });

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
      const newSelecteds = events.map((event) => event.title);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - events.length) : 0;

  const filteredEvents = applySortFilter(events, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredEvents.length && !!filterName;

  const handleFileInputChange = (event, fieldName) => {
    const file = event.target.files[0];
    setEditEvent((prevState) => ({
      ...prevState,
      [fieldName]: file,
    }));
  };

  const handleEventInputChange = (event) => {
    const { name, value } = event.target;
    setEventData((prevEventData) => ({
      ...prevEventData,
      [name]: value,
    }));
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getallEvent');
      const eventsData = response.data;
      setEvents(eventsData);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditEvent((prevEditEvent) => ({
      ...prevEditEvent,
      [name]: value,
    }));

    // Validation
    const errors = { ...formErrors };
    switch (name) {
      case 'title':
        errors.title = value.trim() === '' ? 'Vui lòng nhập tên sự kiện.' : '';
        break;
      case 'imageEvent':
        errors.imageEvent = value.trim() === '' ? 'Vui lòng nhập URL hình ảnh sự kiện.' : '';
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

      const response = await axios.delete(`http://localhost:5000/deleteEvent/${deleteEventId}`, {
        headers,
      });

      if (response.status === 200) {
        console.log('Xóa sự kiện thành công:', response.data);
        setDeleteEventId(null);
        setOpen(null);
        fetchEvents();
      }
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
    }
  };

  // HANDLE EDIT EVENT
  const handleEditEvent = async (eventId) => {
    const isError = Object.values(formErrors).some((error) => error !== '');
    if (isError) {
      console.error('Vui lòng nhập đúng thông tin sự kiện.');
      return;
    }
    try {
      const formData = new FormData();

      formData.append('title', editEvent.title);
      formData.append('imageEvent', editEvent.imageEvent);

      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.patch(`http://localhost:5000/editEvent/${eventId}`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setOpenEditDialog(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin sự kiện:', error);
    }
  };

  // HANDLE UPLOAD EVENT
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleAddEventInputChange = (event) => {
    const { name, value } = event.target;
    setEventData((prevEventData) => ({
      ...prevEventData,
      [name]: value,
    }));
  };

  const handleAddFileInputChange = (event, fieldName) => {
    const file = event.target.files[0];
    setEventData((prevEventData) => ({
      ...prevEventData,
      [fieldName]: file,
    }));
  };

  const handleAddEvent = async () => {
    const isError = Object.values(addEventErrors).some((error) => error !== '');
    if (isError) {
      console.error('Vui lòng nhập đúng thông tin sự kiện.');
      return;
    }
    try {
      const formData = new FormData();

      formData.append('title', eventData.title);
      formData.append('imageEvent', eventData.imageEvent);

      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.post('http://localhost:5000/addEvent', formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setOpenAddDialog(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Lỗi khi tải lên sự kiện:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenEditDialog = (event) => {
    setEditEvent(event);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditEvent(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setEventData({
      title: '',
      imageEvent: '',
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteEventId(id);
    setOpen(true);
  };

  const handleCloseDeletedEventsModal = () => {
    setOpenDeletedEventsModal(false);
  };

  return (
    <>
      <Helmet>
        <title> Hoạt Động Diễn Ra </title>
      </Helmet>
      <HeaderAdmin />
      <Nav />
      <Container>
        <h2 className='page-title'>Sự Kiện</h2>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={events.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => {
                    const { _id, title, imageEvent } = event;
                    const isItemSelected = selected.indexOf(title) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, title)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={title} src={event.image} />
                            <Typography variant="subtitle2" noWrap>
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          {event.content}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            onClick={() => handleOpenEditDialog(event)}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteClick(_id)}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={events.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Dialog open={open} onClose={handleCloseMenu}>
        <DialogTitle>Xác nhận xóa sự kiện</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa sự kiện này?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMenu}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Sửa sự kiện</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Sự Kiện"
            name="title"
            value={editEvent?.title || ''}
            onChange={handleInputChange}
            error={formErrors.title !== ''}
            helperText={formErrors.title}
            fullWidth
          />
          <InputLabel htmlFor="imageEvent">Ảnh Sự Kiện</InputLabel>
          <input type="file" id="imageEvent" name="imageEvent" onChange={(event) => handleFileInputChange(event, 'imageEvent')} />
          {formErrors.imageEvent && <Typography variant="caption" color="error">{formErrors.imageEvent}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={() => handleEditEvent(editEvent?._id)} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Thêm sự kiện mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Sự Kiện"
            name="title"
            value={eventData.title}
            onChange={handleAddEventInputChange}
            error={addEventErrors.title !== ''}
            helperText={addEventErrors.title}
            fullWidth
          />
          <InputLabel htmlFor="imageEvent">Ảnh Sự Kiện</InputLabel>
          <input type="file" id="imageEvent" name="imageEvent" onChange={(event) => handleAddFileInputChange(event, 'imageEvent')} />
          {addEventErrors.imageEvent && <Typography variant="caption" color="error">{addEventErrors.imageEvent}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Hủy</Button>
          <Button onClick={handleAddEvent} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
