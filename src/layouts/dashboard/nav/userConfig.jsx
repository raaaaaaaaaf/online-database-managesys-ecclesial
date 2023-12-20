// component
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const userConfig = [
  {
    title: 'Home',
    path: '/client/userApp',
    icon: <Iconify icon={'carbon:analytics'} />,
  },

  {
    title: 'Events',
    path: '/client/events',
    icon: <Iconify icon={'clarity:event-line'} />,
  },
  {
    title: 'Request Baptismal',
    path: '/client/baptismal',
    icon: <Iconify icon={'healthicons:i-certificate-paper-outline'} />,
  },
  {
    title: 'Request Marriage',
    path: '/client/marriage',
    icon: <Iconify icon={'healthicons:i-certificate-paper-outline'} />,
  },
  {
    title: 'Certificates',
    path: '/client/certificates',
    icon: <Iconify icon={'ph:certificate-thin'} />,
  },

];

export default userConfig;
