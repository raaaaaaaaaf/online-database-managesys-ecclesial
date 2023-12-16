import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useContext, useEffect, useState } from "react";
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
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import USERLIST from "../../_mock/user";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import EditBaptismal from "../../components/modal/EditBaptismal";
import EditMarriage from "../../components/modal/EditMarriage";
import Loading from "../../components/loading/Loading";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Recipient Name", alignRight: false },
  { id: "company", label: "Certificate Type", alignRight: false },
  { id: "date", label: "Date Issued", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
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

export default function CertificatesPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [certificates, setCertificates] = useState([]);

  const [openBaptismal, setOpenBaptismal] = useState(false);

  const [openMarriage, setOpenMarriage] = useState(false);

  const [idBaptismal, setIdBaptismal] = useState("");

  const [idMarriage, setIdMarriage] = useState("");

  const [dataBaptismal, setDataBaptismal] = useState(null);

  const [dataMarriage, setDataMarriage] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const docsQuery = query(
          collection(db, "data_certificates"),
          where("uid", "==", currentUser.uid)
        );
        const docsSnap = await getDocs(docsQuery);
        docsSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCertificates(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleEditMarriage = (id, data) => {
    setIdMarriage(id);
    setDataMarriage(data);
    setOpenMarriage(true);
  };

  const handleEditBaptismal = (id, data) => {
    setIdBaptismal(id);
    setDataBaptismal(data);
    setOpenBaptismal(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = certificates.map((n) => n.docType);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - certificates.length) : 0;

  const filteredUsers = applySortFilter(
    certificates,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Requested Documents
          </Typography>
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
                    rowCount={certificates.length}
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
                        const { id, userName, isApproved, docType, timeStamp } =
                          row;
                        const selectedUser = selected.indexOf(name) !== -1;

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
                                  handleClick(event, userName)
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
                                  alt={userName}
                                  src={`/assets/images/avatars/avatar_${
                                    index + 1
                                  }.jpg`}
                                />
                                <Typography variant="subtitle2" noWrap>
                                  {userName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{docType}</TableCell>

                            <TableCell align="left">
                              {timeStamp.toDate().toLocaleDateString("en-US")}
                            </TableCell>

                            <TableCell align="left">
                              <Label color={isApproved ? "success" : "error"}>
                                {isApproved ? "Approved" : "Pending"}
                              </Label>
                            </TableCell>

                            <TableCell align="left">
                              {docType === "Marriage" && (
                                <IconButton
                                  onClick={() => handleEditMarriage(id, row)}
                                  size="small"
                                >
                                  <Iconify icon={"carbon:edit"} />
                                </IconButton>
                              )}
                              {docType === "Baptismal" && (
                                <IconButton
                                  onClick={() => handleEditBaptismal(id, row)}
                                  size="small"
                                >
                                  <Iconify icon={"carbon:edit"} />
                                </IconButton>
                              )}
                              <IconButton size="small">
                                <Iconify icon={"carbon:delete"} />
                              </IconButton>

                              <Link
                                to={
                                  docType === "Baptismal"
                                    ? `baptismal/${id}`
                                    : docType === "Marriage"
                                    ? `marriage/${id}`
                                    : ""
                                }
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <IconButton size="small" disabled={!isApproved}>
                                  <Iconify icon={"carbon:view"} />
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
              <EditBaptismal
                open={openBaptismal}
                onClose={() => setOpenBaptismal(false)}
                id={idBaptismal}
                data={dataBaptismal}
              />
              <EditMarriage
                open={openMarriage}
                onClose={() => setOpenMarriage(false)}
                id={idMarriage}
                data={dataMarriage}
              />
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={certificates.length}
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
