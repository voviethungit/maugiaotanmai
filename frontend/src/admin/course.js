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
  FormControl,
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
  IconButton,
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
  { id: 'title', label: 'Tên tài liệu', alignRight: false },
  { id: 'location', label: 'Tệp Tài Liệu', alignRight: false },
  { id: '', label: 'Hoạt động', alignRight: false },
];

// Helper functions
const descendingComparator = (a, b, orderBy) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0);

const getComparator = (order, orderBy) =>
  order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

const applySortFilter = (array, comparator, query) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (course) => course.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
};

export default function CoursesPage() {
  const [open, setOpen] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState('');
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0);
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [openDeletedCoursesModal, setOpenDeletedCoursesModal] = useState(false);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const isAdmin = localStorage.getItem('isAdmin');
  const [orderBy, setOrderBy] = useState('name');
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editCourse, setEditCourse] = useState(null);
  const [formErrors, setFormErrors] = useState({
    title: '',
    imageCourse: '',
    document: '',
  });
  const [addCourseErrors, setAddCourseErrors] = useState({
    title: '',
    imageCourse: '',
    document: '',
  });
  const [courseData, setCourseData] = useState({
    title: '',
    imageCourse: '',
    document: '',
    courseCateId: '',
  });
  const handleAddCourseFieldChange = (field, value) => {
    if (field === 'document') {
      setSelectedDocumentName(value.name);
    }
    setCourseData((prevCourseData) => ({
      ...prevCourseData,
      [field]: value,
    }));
    setAddCourseErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  const [courseCates, setCourseCates] = useState([]);
  useEffect(() => {
    fetchCourses();
    fetchCourseCates();
  }, []);

  const fetchCourseCates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/all-coursecate');
      setCourseCates(response.data.categories);
      console.log(response.data.categories);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách courseCate:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-all-course');
      setCourses(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  // Handle sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle selecting all items
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = courses.map((course) => course.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const [openAddDialog, setOpenAddDialog] = useState(false);
  // Handle individual item click
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

  // Filtering and sorting
  const filteredCourses = applySortFilter(courses, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredCourses.length && !!filterName;

  // Handle filter by name
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Handle adding new course
  const handleAddCourse = async () => {
    try {
      const errors = {};
      if (!courseData.title || courseData.title.trim() === '') {
        errors.title = 'Vui lòng nhập tên tài liệu.';
      }
      if (!courseData.document) {
        errors.document = 'Vui lòng chọn tài liệu.';
      }
      if (Object.keys(errors).length > 0) {
        setAddCourseErrors(errors);
        return;
      }

      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('courseCateId', courseData.courseCateId);
      formData.append('file', courseData.document);

      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.post('http://localhost:5000/upload-course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.status === 'ok') {
        console.log('Tài liệu đã được thêm thành công');
        setOpenAddDialog(false);
        fetchCourses();
      } else {
        console.error('Lỗi khi thêm tài liệu:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi thêm tài liệu:', error);
    }
  };

  // Handle editing course
  const handleEditCourse = async (courseId) => {
    try {
      const isError = Object.values(formErrors).some((error) => error !== '');
      if (isError) {
        console.error('Vui lòng nhập đúng thông tin tài liệu.');
        return;
      }

      const formData = new FormData();
      formData.append('title', editCourse.title);
      formData.append('location', editCourse.location);
      formData.append('description', editCourse.description);
      formData.append('imageCourse', editCourse.imageCourse);
      formData.append('document', editCourse.document);

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(`http://localhost:5000/update-course/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        console.log('Tài liệu đã được cập nhật:', response.data.course);
        setOpenEditDialog(false);
        fetchCourses();
      } else {
        console.error('Lỗi khi cập nhật tài liệu:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật tài liệu:', error);
    }
  };

  // Handle deleting course
  const handleConfirmDelete = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.delete(`http://localhost:5000/delete-course/${deleteCourseId}`, { headers });

      if (response.status === 200) {
        setCourses(courses.filter((course) => course.id !== deleteCourseId));
        setDeleteCourseId(null);
        setOpen(false);
        fetchCourses();
      } else {
        console.error('Lỗi khi xóa tài liệu');
      }
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error);
    }
  };

  // Handle form field changes for editing course
  const handleEditCourseFieldChange = (field, value) => {
    setEditCourse((prevEditCourse) => ({
      ...prevEditCourse,
      [field]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop();
    switch (fileExtension) {
      case 'doc':
      case 'docx':
        return 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Microsoft_Word_2013-2019_logo.svg';
      case 'xls':
      case 'xlsx':
        return 'https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg';
      case 'rar':
        return 'https://upload.wikimedia.org/wikipedia/fr/a/aa/WinRAR_logo_big.png';
      default:
        return 'default-icon.png';
    }
  };
  return (
    <>
      <Helmet>
        <title> Quản lý tài liệu </title>
      </Helmet>
      <HeaderAdmin />
      <Nav />
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {' '}
            Tài liệu{' '}
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setOpenAddDialog(true)}
            >
              Thêm tài liệu
            </Button>
          )}
        </Stack>
        <Card>
          <UserListToolbar selected={selected} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={courses.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => {
                    const { _id, title, imageCourse, document } = course;
                    const isItemSelected = selected.indexOf(title) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, title)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={title} src={getFileIcon(document)} />
                            <Typography
                              variant="subtitle2"
                              noWrap
                              sx={{ fontWeight: 'bold', color: '#3f51b5', fontSize: '15px' }}
                            >
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <a
                            href={`http://localhost:5000/files/${document}`}
                            download
                            style={{ textDecoration: 'none', color: '#3f51b5' }}
                          >
                            {document}
                          </a>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => setOpen(event.currentTarget)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                          <Menu
                            anchorEl={open}
                            open={Boolean(open)}
                            onClose={() => setOpen(null)}
                            PaperProps={{
                              sx: { width: 200, maxWidth: '100%' },
                            }}
                          >
                            {isAdmin && [
                              <MenuItem
                                key="edit"
                                onClick={() => {
                                  setEditCourse(course);
                                  setOpenEditDialog(true);
                                }}
                              >
                                <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                                Chỉnh sửa
                              </MenuItem>,
                              <MenuItem
                                key="delete"
                                onClick={() => {
                                  setDeleteCourseId(_id);
                                }}
                              >
                                <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                                Xóa
                              </MenuItem>,
                            ]}
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                            {' '}
                            Không tìm thấy{' '}
                          </Typography>
                          <Typography variant="body2">
                            Không tìm thấy kết quả cho <strong>{filterName}</strong>.<br /> Hãy thử kiểm tra lỗi chính
                            tả hoặc sử dụng các từ hoàn chỉnh.
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
            count={courses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Thêm Tài liệu</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Tên tài liệu"
                fullWidth
                value={courseData.title}
                onChange={(e) => handleAddCourseFieldChange('title', e.target.value)}
                error={!!addCourseErrors.title}
                helperText={addCourseErrors.title}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="course-cate-label">Danh mục</InputLabel>
                <Select
                  labelId="course-cate-label"
                  id="course-cate-select"
                  value={courseData.courseCateId}
                  onChange={(e) => handleAddCourseFieldChange('courseCateId', e.target.value)}
                >
                  {courseCates.map((courseCate) => (
                    <MenuItem key={courseCate._id} value={courseCate._id}>
                      {courseCate.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" component="label" fullWidth startIcon={<Iconify icon="eva:file-outline" />}>
                Chọn tài liệu
                <input type="file" hidden onChange={(e) => handleAddCourseFieldChange('document', e.target.files[0])} />
              </Button>
              <br />
              {selectedDocumentName && <p>{selectedDocumentName}</p>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button onClick={handleAddCourse} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa Tài liệu</DialogTitle>
        <DialogContent>
          {editCourse && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Tên tài liệu"
                  fullWidth
                  value={editCourse.title}
                  onChange={(e) => handleEditCourseFieldChange('title', e.target.value)}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Địa chỉ"
                  fullWidth
                  value={editCourse.location}
                  onChange={(e) => handleEditCourseFieldChange('location', e.target.value)}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả"
                  fullWidth
                  value={editCourse.description}
                  onChange={(e) => handleEditCourseFieldChange('description', e.target.value)}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  startIcon={<Iconify icon="eva:cloud-upload-outline" />}
                >
                  Chọn ảnh bìa
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleEditCourseFieldChange('imageCourse', e.target.files[0])}
                  />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" component="label" fullWidth startIcon={<Iconify icon="eva:file-outline" />}>
                  Chọn tài liệu
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleEditCourseFieldChange('document', e.target.files[0])}
                  />
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleEditCourse} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
