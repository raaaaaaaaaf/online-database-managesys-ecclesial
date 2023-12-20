import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock
import USERLIST from "../_mock/user";
import AddDonation from "../components/modal/AddDonation";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Loading from "../components/loading/Loading";
import { fCurrency } from "../utils/formatNumber";
import EditDonation from "../components/modal/EditDonation";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddEvent from "../components/modal/AddEvent";
import EditEvent from "../components/modal/EditEvent";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Event Name", alignRight: false },
  { id: "amount", label: "Location", alignRight: false },
  { id: "time", label: "Time", alignRight: false },
  { id: "date", label: "Date", alignRight: false },
  { id: "act", label: "Action", alignRight: false },
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
  return order === "desc"
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
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function EventPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openModal, setOpenModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [formID, setFormID] = useState("");

  const [editData, setEditData] = useState({});

  const [eventList, setEventList] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const dataRef = query(collection(db, "data_events"));
        const dataSnap = await getDocs(dataRef);
        dataSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setEventList(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleEditModal = (id, data) => {
    setFormID(id);
    setEditData(data);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const dataRef = doc(db, "data_events", id);
      await deleteDoc(dataRef);
      toast.success("Deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/dashboard/event");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = eventList.map((n) => n.name);
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
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
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
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - eventList.length) : 0;

  const filteredUsers = applySortFilter(
    eventList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Event Monitoring </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Events
          </Typography>
          <Button
            onClick={() => setOpenModal(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Event
          </Button>
          <AddEvent open={openModal} onClose={() => setOpenModal(false)} />
        </Stack>

        {loading ? (
          <Loading />
        ) : (
          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={eventList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const {
                          id,
                          eventName,
                          location,
                          startDay,
                          endDay,
                          startTime,
                          endTime,
                        } = row;
                        const selectedUser = selected.indexOf(eventName) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={selectedUser}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedUser}
                                onChange={(event) =>
                                  handleClick(event, memberName)
                                }
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {eventName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{location}</TableCell>

                            <TableCell align="left">
                              {new Date(
                                startTime.seconds * 1000
                              ).toLocaleTimeString("en-US")}{" "}
                              -{" "}
                              {new Date(
                                endTime.seconds * 1000
                              ).toLocaleTimeString("en-US")}
                            </TableCell>

                            <TableCell align="left">
                              {new Date(
                                startDay.seconds * 1000
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              -{" "}
                              {new Date(
                                endDay.seconds * 1000
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </TableCell>

                            <TableCell align="left">
                              <IconButton
                                onClick={() => handleEditModal(id, row)}
                              >
                                <Iconify
                                  icon={"material-symbols:edit-outline"}
                                />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(id)}>
                                <Iconify
                                  icon={"material-symbols:delete-outline"}
                                />
                              </IconButton>

                              <Link
                                to={`view/${id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "white",
                                }}
                              >
                                <IconButton>
                                  <Iconify icon={"carbon-view"} />
                                </IconButton>
                              </Link>
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

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete
                              words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
              <EditEvent
                open={editModal}
                onClose={() => setEditModal(false)}
                id={formID}
                data={editData}
              />
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={eventList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
      </Container>
    </>
  );
}
