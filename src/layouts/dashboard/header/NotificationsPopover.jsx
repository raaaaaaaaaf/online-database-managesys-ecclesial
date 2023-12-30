import PropTypes from "prop-types";
import { set, sub } from "date-fns";
import { noCase } from "change-case";
import { faker } from "@faker-js/faker";
import { useContext, useEffect, useState } from "react";
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";
// utils
import { fToNow } from "../../../utils/formatTime";
// components
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    id: faker.datatype.uuid(),
    title: "Your order is placed",
    description: "waiting for shipping",
    avatar: null,
    type: "order_placed",
    createdAt: set(new Date(), { hours: 10, minutes: 30 }),
    isUnRead: true,
  },
  {
    id: faker.datatype.uuid(),
    title: faker.name.fullName(),
    description: "answered to your comment on the Minimal",
    avatar: "/assets/images/avatars/avatar_2.jpg",
    type: "friend_interactive",
    createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
    isUnRead: true,
  },
  {
    id: faker.datatype.uuid(),
    title: "You have new message",
    description: "5 unread messages",
    avatar: null,
    type: "chat_message",
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
    isUnRead: false,
  },
  {
    id: faker.datatype.uuid(),
    title: "You have new mail",
    description: "sent from Guido Padberg",
    avatar: null,
    type: "mail",
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
    isUnRead: false,
  },
  {
    id: faker.datatype.uuid(),
    title: "Delivery processing",
    description: "Your order is being shipped",
    avatar: null,
    type: "order_shipped",
    createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
    isUnRead: false,
  },
];

export default function NotificationsPopover() {
  const [open, setOpen] = useState(null);

  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [totalNotification, setTotalNotification] = useState(0);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;

        // Check if user is not null before accessing its properties
        if (user) {
          const q = query(
            collection(db, "data_notifications"),
            where("recipientUserId", "==", user.uid)
          );

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const certificatesData = [];
            querySnapshot.forEach((doc) => {
              certificatesData.push({
                id: doc.id,
                ...doc.data(),
              });
            });

            console.log("Certificates: ", certificatesData.join(", "));
            console.log(certificates);
            // Update state with the new data
            setCertificates(certificatesData);
            setTotalNotification(certificatesData.length);
            setLoading(false);
          });

          // Cleanup function to unsubscribe when the component is unmounted
          return () => unsubscribe();
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [auth.currentUser]);

  const totalUnRead = certificates.filter(
    (item) => item.isRead === false
  ).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      {loading ? (
        <div>...</div>
      ) : (
        <>
          <IconButton
            color={open ? "primary" : "default"}
            onClick={handleOpen}
            sx={{ width: 40, height: 40 }}
          >
            <Badge badgeContent={totalUnRead} color="error">
              <Iconify icon="eva:bell-fill" />
            </Badge>
          </IconButton>

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1.5,
                ml: 0.75,
                width: 360,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">Notifications</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  You have {totalUnRead} unread messages
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
              <List
                disablePadding
                subheader={
                  <ListSubheader
                    disableSticky
                    sx={{ py: 1, px: 2.5, typography: "overline" }}
                  >
                    New
                  </ListSubheader>
                }
              >
                {certificates.slice(0, 2).map((notification, index) => (
                  <NotificationItem key={index} notification={notification} />
                ))}
              </List>

              {totalNotification > 2 && (
                <List
                  disablePadding
                  subheader={
                    <ListSubheader
                      disableSticky
                      sx={{ py: 1, px: 2.5, typography: "overline" }}
                    >
                      Before that
                    </ListSubheader>
                  }
                >
                  {certificates.slice(2, 5).map((notification, index) => (
                    <NotificationItem key={index} notification={notification} />
                  ))}
                </List>
              )}
            </Scrollbar>
          </Popover>
        </>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title, certificatesID } = renderContent(notification);

  const setIsUnRead = async (id) => {
    try {
      const notifRef = doc(db, "data_notifications", id);
      await updateDoc(notifRef, {
        isRead: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      to={
        notification.docType === "Baptismal"
          ? `certificates/baptismal/${notification.certificatesID}`
          : notification.docType === "Marriage"
          ? `certificates/marriage/${notification.certificatesID}`
          : ""
      }
      style={{ textDecoration: "none", color: "black" }}
    >
      <ListItemButton
        onClick={() => setIsUnRead(notification.id)}
        sx={{
          py: 1.5,
          px: 2.5,
          mt: "1px",
          ...(notification.isRead && {
            bgcolor: "action.selected",
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                color: "text.disabled",
              }}
            >
              <Iconify
                icon="eva:clock-outline"
                sx={{ mr: 0.5, width: 16, height: 16 }}
              />
              {
                notification.timestamp
                  ? fToNow(new Date(notification.timestamp.seconds * 1000))
                  : "N/A" // Or some default value if createdAt is not defined
              }
            </Typography>
          }
        />
      </ListItemButton>
    </Link>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.displayName}:
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp; {noCase("Your Certificate has been approved.")}
      </Typography>
    </Typography>
  );

  return {
    avatar: (
      <img
        alt={notification.displayName}
        src="/assets/icons/ic_notification_mail.svg"
      />
    ),
    title,
  };
}
