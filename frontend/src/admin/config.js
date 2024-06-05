import SvgColor from './components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Bảng Điều Khiển',
    path: '/admin/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Tài Khoản',
    path: '/admin/tai-khoan',
    icon: icon('ic_user'),
  },
  {
    title: 'Giảng Viên',
    path: '/admin/giang-vien',
    icon: icon('ic_user'),
  },
  {
    title: 'Tin Tức',
    path: '/admin/tin-tuc',
    icon: icon('ic_blog'),
  },
  {
    title: 'Bộ Phận',
    path: '/admin/bo-phan',
    icon: icon('ic_category'),
  },
  {
    title: 'Tài Liệu',
    path: '/admin/tai-lieu',
    icon: icon('ic_bill'),
  }
  ,
  {
    title: 'Danh Mục Tài Liệu',
    path: '/admin/danh-muc-tai-lieu',
    icon: icon('ic_bill'),
  }
  ,
  {
    title: 'Hoạt Động Diễn Ra',
    path: '/admin/hoat-dong-dien-ra',
    icon: icon('ic_lock'),
  }
];

export default navConfig;
