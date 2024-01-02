// component
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const adminConfig = [
  {
    title: 'Home',
    path: '/dashboard/app',
    icon: <Iconify icon={'carbon:analytics'} />,
  },
  {
    title: 'Members',
    path: '/dashboard/user',
    icon: <Iconify icon={'lucide:users-round'} />,
  },
  {
    title: 'Certificates',
    path: '/dashboard/certificates',
    icon: <Iconify icon={'ph:certificate-thin'} />,
  },

  {
    title: 'Event Monitoring',
    path: '/dashboard/event',
    icon: <Iconify icon={'clarity:event-line'} />,
  },
  {
    title: 'Tithes Monitoring',
    path: '/dashboard/donation',
    icon: <Iconify icon={'formkit:dollar'} />,
  },
];

export default adminConfig;
