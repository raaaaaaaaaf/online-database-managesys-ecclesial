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
    title: 'Chapel',
    path: '/dashboard/chapel',
    icon: <Iconify icon={'guidance:chapel'} />,
  },
  {
    title: 'View Request',
    path: '/dashboard/certificates',
    icon: <Iconify icon={'ph:certificate-thin'} />,
  },
  {
    title: 'Weekly Report',
    path: '/dashboard/report',
    icon: <Iconify icon={'tabler:file-report'} />,
  },

  {
    title: 'Event Monitoring',
    path: '/dashboard/event',
    icon: <Iconify icon={'clarity:event-line'} />,
  },
];

export default adminConfig;
