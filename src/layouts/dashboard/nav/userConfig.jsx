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
    title: 'Request Certificates',
    path: '/client/certificates',
    icon: <Iconify icon={'ph:certificate-thin'} />,
  },
  {
    title: 'View Events',
    path: '/client/events',
    icon: <Iconify icon={'clarity:event-line'} />,
  },


];

export default userConfig;
