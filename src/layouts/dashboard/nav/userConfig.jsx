// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const userConfig = [
  {
    title: 'User Dash',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Request Baptismal',
    path: '/client/baptismal',
    icon: icon('ic_cart'),
  },
  {
    title: 'Request Marriage',
    path: '/client/marriage',
    icon: icon('ic_cart'),
  },
  {
    title: 'Certificates',
    path: '/client/certificates',
    icon: icon('ic_cart'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default userConfig;
