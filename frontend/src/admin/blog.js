import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import './css/blogs.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaX } from 'react-icons/fa6';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Popover,
  Grid,
  Checkbox,
  TableRow,
  MenuItem,
  InputLabel,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Dialog,
  TextField,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Label from './components/label';
import Iconify from './components/iconify';
import Scrollbar from './components/scrollbar';
import { UserListHead } from './sections/@dashboard/user';
import HeaderAdmin from './header';
import Nav from './menu';

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'content', label: 'Mô tả', alignRight: false },
  { id: 'status', label: 'Trạng Thái', alignRight: false },
  { id: '', label: 'Hoạt động', alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BlogsPage() {
  const [open, setOpen] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin'));
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedBlogIdToDelete, setSelectedBlogIdToDelete] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addBlogErrors, setAddBlogErrors] = useState({});
  const [blogData, setBlogData] = useState({ title: '', content: '', imageBlog: '' });

  const [editBlogData, setEditBlogData] = useState({ title: '', content: '', imageBlog: '' });
  const [editBlogErrors, setEditBlogErrors] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBlogIdToEdit, setSelectedBlogIdToEdit] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/get-blog')
      .then((response) => setBlogs(response.data.blogs))
      .catch((error) => console.error('Lỗi:', error));
  }, []);

  const handleOpenEditDialog = (blogId) => {
    setSelectedBlogIdToEdit(blogId);
    const selectedBlog = blogs.find((blog) => blog._id === blogId);
    if (selectedBlog) {
      const blocksFromHTML = convertFromHTML(selectedBlog.content);
      const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
      setEditorState(EditorState.createWithContent(state));
      setEditBlogData({
        title: selectedBlog.title,
        content: selectedBlog.content,
        imageBlog: selectedBlog.imageBlog,
      });
      setOpenEditDialog(true);
    }
  };

  const handleUpdateBlog = async () => {
    try {
      const errors = {};
      if (!editBlogData.title || editBlogData.title.trim() === '') errors.title = 'Vui lòng nhập tiêu đề.';
      if (!editBlogData.content || editBlogData.content.trim() === '') errors.content = 'Vui lòng nhập mô tả.';
      if (!editBlogData.imageBlog || editBlogData.imageBlog.trim() === '')
        errors.imageBlog = 'Vui lòng nhập URL hình ảnh.';
      if (Object.keys(errors).length > 0) {
        setEditBlogErrors(errors);
        return;
      }
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const contentHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      const response = await axios.put(
        `http://localhost:5000/update-blog/${selectedBlogIdToEdit}`,
        { ...editBlogData, content: contentHTML },
        { headers }
      );

      if (response.data.success) {
        setOpenEditDialog(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
    }
  };

  const handleDeleteButtonClick = (blogId) => {
    setSelectedBlogIdToDelete(blogId);
    setOpenConfirmDialog(true);
  };

  const deleteBlogById = async (blogId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      await axios.put(`http://localhost:5000/delete-blog/${blogId}`, null, { headers });
      window.location.reload();
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = blogs.map((blog) => blog.title);
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

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

  const handleBlogInputChange = (event) => {
    const { name, value } = event.target;
    setBlogData((prevBlogData) => ({ ...prevBlogData, [name]: value }));
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBlogData({ ...blogData, imageBlog: reader.result });
      reader.readAsDataURL(file);
    }
  };
  

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setBlogData({ title: '', content: '', imageBlog: '' });
    setEditorState(() => EditorState.createEmpty());
    setAddBlogErrors({});
  };

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    const contentState = newState.getCurrentContent();
    const html = draftToHtml(convertToRaw(contentState));
    setBlogData((prevBlogData) => ({ ...prevBlogData, content: html }));
  };
  

  const addBlog = async () => {
    try {
      const errors = {};
      if (!blogData.title || blogData.title.trim() === '') errors.title = 'Vui lòng nhập tiêu đề.';
      if (!blogData.content || blogData.content.trim() === '') errors.content = 'Vui lòng nhập mô tả.';
      if (!blogData.imageBlog || blogData.imageBlog.trim() === '') errors.imageBlog = 'Vui lòng nhập URL hình ảnh.';
      if (Object.keys(errors).length > 0) {
        setAddBlogErrors(errors);
        return;
      }
  
      const contentHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', contentHTML);
      formData.append('imageBlog', blogData.imageBlog);
  
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.post(
        'http://localhost:5000/add-blog',
        formData,
        { headers }
      );
  
      if (response.data.success) {
        setOpenAddDialog(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi thêm bài viết:', error);
    }
  };
  

  const isNotFound = !applySortFilter(blogs, getComparator(order, orderBy), filterName).length && Boolean(filterName);

  return (
    <>
      <Helmet>
        <title> Quản Lý Bài Viết </title>
      </Helmet>
      <HeaderAdmin />
      <Nav />

      <div className="blog-page-container">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Bài viết
            </Typography>
            <Button variant="contained" component={Link} to="http://localhost:3000/admin/dang-tai-tin-tuc" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm bài viết mới
            </Button>
          </Stack>

          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={blogs.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {applySortFilter(blogs, getComparator(order, orderBy), filterName)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((blog) => {
                        const { _id, title, content, status, imageBlog } = blog;
                        const isItemSelected = selected.indexOf(title) !== -1;

                        return (
                          <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={isItemSelected}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, title)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={title} src={imageBlog} />
                                <Typography variant="subtitle2" noWrap>
                                  {title}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">
                              <div dangerouslySetInnerHTML={{ __html: content }} />
                            </TableCell>

                            <TableCell align="left">
                              <Label color={(status === 'deleted' && 'error') || 'success'}>
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              {/* <Button onClick={() => handleOpenEditDialog(_id)} variant="contained" color="primary">
                                Sửa
                              </Button> */}
                              <Button
                                onClick={() => handleDeleteButtonClick(_id)}
                                variant="contained"
                                color="error"
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" paragraph>
                              Không tìm thấy
                            </Typography>
                            <Typography variant="body2">
                              Không tìm thấy kết quả cho từ khóa &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Hãy thử kiểm tra lỗi chính tả hoặc sử dụng các từ khóa đầy đủ.
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
              count={blogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
{/* 
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
          <DialogTitle>Thêm bài viết mới</DialogTitle>
          <DialogContent>
            <TextField
              label="Tiêu đề"
              name="title"
              value={blogData.title}
              onChange={handleBlogInputChange}
              error={!!addBlogErrors.title}
              helperText={addBlogErrors.title}
              fullWidth
              margin="normal"
            />
            <Editor 
              editorState={editorState}
              wrapperClassName="editor-wrapper"
              editorClassName="editor"
              onEditorStateChange={onEditorStateChange}
            />
            <InputLabel  error={!!addBlogErrors.content} style={{ marginTop: 10 }}>
              {addBlogErrors.content}
            </InputLabel>
            <TextField
              label="Hình ảnh"
              name="imageBlog"
              value={blogData.imageBlog}
              onChange={handleBlogInputChange}
              error={!!addBlogErrors.imageBlog}
              helperText={addBlogErrors.imageBlog}
              fullWidth
              margin="normal"
            />
            <InputLabel htmlFor="image-upload" style={{ marginTop: 10 }}>
              Tải lên hình ảnh
            </InputLabel>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: 5 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={addBlog} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog> */}

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={() => deleteBlogById(selectedBlogIdToDelete)} color="primary">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Sửa bài viết</DialogTitle>
          <DialogContent>
            <TextField
              label="Tiêu đề"
              name="title"
              value={editBlogData.title}
              onChange={(e) => setEditBlogData({ ...editBlogData, title: e.target.value })}
              error={!!editBlogErrors.title}
              helperText={editBlogErrors.title}
              fullWidth
              margin="normal"
            />
            <Editor
              editorState={editorState}
              wrapperClassName="editor-wrapper"
              editorClassName="editor"
              onEditorStateChange={onEditorStateChange}
            />
            <InputLabel error={!!editBlogErrors.content} style={{ marginTop: 10 }}>
              {editBlogErrors.content}
            </InputLabel>
            <TextField
              label="Hình ảnh"
              name="imageBlog"
              value={editBlogData.imageBlog}
              onChange={(e) => setEditBlogData({ ...editBlogData, imageBlog: e.target.value })}
              error={!!editBlogErrors.imageBlog}
              helperText={editBlogErrors.imageBlog}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={handleUpdateBlog} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Sửa bài viết</DialogTitle>
          <DialogContent>
            <TextField
              label="Tiêu đề"
              name="title"
              value={editBlogData.title}
              onChange={(e) => setEditBlogData({ ...editBlogData, title: e.target.value })}
              error={!!editBlogErrors.title}
              helperText={editBlogErrors.title}
              fullWidth
              margin="normal"
            />
            <Editor
              editorState={editorState}
              wrapperClassName="editor-wrapper"
              editorClassName="editor"
              onEditorStateChange={onEditorStateChange}
            />
            <InputLabel error={!!editBlogErrors.content} style={{ marginTop: 10 }}>
              {editBlogErrors.content}
            </InputLabel>
            <TextField
              label="Hình ảnh"
              name="imageBlog"
              value={editBlogData.imageBlog}
              onChange={(e) => setEditBlogData({ ...editBlogData, imageBlog: e.target.value })}
              error={!!editBlogErrors.imageBlog}
              helperText={editBlogErrors.imageBlog}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={handleUpdateBlog} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
