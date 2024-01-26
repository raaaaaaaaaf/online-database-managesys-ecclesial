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
  Grid,
} from "@mui/material";
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
// mock
import USERLIST from "../_mock/user";
import AddUser from "../components/modal/EditMember";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { fDate } from "../utils/formatTime";
import Loading from "../components/loading/Loading";
import EditUser from "../components/modal/EditMember";
import { toast } from "react-toastify";
import AddMember from "../components/modal/AddMember";
import EditMember from "../components/modal/EditMember";
import { Link, useParams } from "react-router-dom";
import { AppWidgetSummary } from "../sections/@dashboard/app";
import { fShortenNumber } from "../utils/formatNumber";
import ViewMember from "../components/modal/ViewMember";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "dob", label: "Date of Birth", alignRight: false },
  { id: "age", label: "Age", alignRight: false },
  { id: "cstatus", label: "Civil Status", alignRight: false },
  { id: "chapel", label: "Chapel", alignRight: false },
  { id: "", label: "", alignRight: false },
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
      (_user) =>
        _user.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MemberListPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalData, setModalData] = useState();

  const [modalID, setModalID] = useState();

  const [baptismal, setBaptismal] = useState(0);

  const [marriage, setMarriage] = useState(0);

  const [chapelName, setChapelName] = useState("");

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const dataRef = doc(db, "data_chapel", id);
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(dataRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const membersData = data.members || []; // Assuming members is an array
            setMembers(membersData);
            // You can include other fields in the state as needed
            setBaptismal(data.baptismal);
            setMarriage(data.marriage);
            setChapelName(data.name);
            // ...
            setLoading(false);
          } else {
            setMembers([]);
            // Set other fields to default values or empty as needed
            setBaptismal("");
            setMarriage("");
            // ...
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          setMembers([]);
          // Set other fields to default values or empty as needed
          setBaptismal("");
          setMarriage("");
          // ...
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setMembers([]);
      // Set other fields to default values or empty as needed
      setBaptismal("");
      setMarriage("");
      // ...
      // ...
    }
  }, [id]);

  const handleDelete = async (id) => {
    try {
      const userRef = doc(db, "users", id);
      await deleteDoc(userRef);
      toast.success("Member Information has been deleted.", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (data) => {
    setOpen(true);
    setModalData(data);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = members.map((n) => n.displayName);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - members.length) : 0;

  const filteredUsers = applySortFilter(
    members,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      <Container>
        <Grid container spacing={3}>
          <>
            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Requested Baptismal Certificate"
                color="info"
                total={baptismal}
                icon={"fluent:document-error-20-regular"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Requested Marriage Certificate"
                color="info"
                total={marriage}
                icon={"fluent:document-error-20-regular"}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
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
                          rowCount={members.length}
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
                                address,
                                age,
                                cstatus,
                                children,
                                fullName,
                                birthDate,
                                chapel,
                              } = row;
                              const selectedUser = selected.indexOf(id) !== -1;

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
                                        handleClick(event, id)
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
                                      <Avatar
                                        alt={fullName}
                                        src={`/assets/images/avatars/avatar_${
                                          index + 1
                                        }.jpg`}
                                      />
                                      <Typography variant="subtitle2" noWrap>
                                        {fullName}
                                      </Typography>
                                    </Stack>
                                  </TableCell>

                                  <TableCell align="left">{address}</TableCell>

                                  <TableCell align="left">
                                    {new Date(
                                      birthDate.seconds * 1000
                                    ).toLocaleDateString("en-US")}
                                  </TableCell>

                                  <TableCell align="left">{age}</TableCell>

                                  <TableCell align="left">{cstatus}</TableCell>

                                  <TableCell align="left">
                                    {chapelName}
                                  </TableCell>
                                  <TableCell align="left">
                                    <Button
                                      onClick={() => handleView(row)}
                                      variant="contained"
                                      size="large"
                                      color="inherit"
                                    >
                                      <Iconify icon={"carbon-view"} />
                                    </Button>
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
                              <TableCell
                                align="center"
                                colSpan={6}
                                sx={{ py: 3 }}
                              >
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
                                    <br /> Try checking for typos or using
                                    complete words.
                                  </Typography>
                                </Paper>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        )}
                      </Table>
                    </TableContainer>
                    <ViewMember
                      open={open}
                      onClose={() => setOpen(false)}
                      data={modalData}
                    />
                  </Scrollbar>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={members.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Card>
              )}
            </Grid>
          </>
        </Grid>
      </Container>
    </>
  );
}
