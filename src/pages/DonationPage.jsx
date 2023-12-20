import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AppWidgetSummary } from "../sections/@dashboard/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Loading from "../components/loading/Loading";
import Iconify from "../components/iconify";
import EditDonation from "../components/modal/EditDonation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fCurrency } from "../utils/formatNumber";
import AddDonation from "../components/modal/AddDonation";

const DonationPage = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [formID, setFormID] = useState("");

  const [editData, setEditData] = useState({});

  const [month, setMonth] = useState(0);

  const [year, setYear] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const docsQuery = query(collection(db, "data_donations"));
        const docsSnap = await getDocs(docsQuery);

        docsSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const today = new Date();
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const lastDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const lastDayOfYear = new Date(today.getFullYear() + 1, 0, 0);

        const monthRef = query(
          collection(db, "data_donations"),
          where("timeStamp", ">", firstDayOfMonth),
          where("timeStamp", "<=", lastDayOfMonth)
        );
        const yearRef = query(
          collection(db, "data_donations"),
          where("timeStamp", ">", firstDayOfYear),
          where("timeStamp", "<=", lastDayOfYear)
        );

        const monthSnap = await getDocs(monthRef);
        const yearSnap = await getDocs(yearRef);

        const monthDataArray = monthSnap.docs.map((doc) => doc.data());
        const monthTotal = monthDataArray.reduce(
          (acc, item) => acc + item.amount,
          0
        );

        const yearDataArray = yearSnap.docs.map((doc) => doc.data());
        const yearTotal = yearDataArray.reduce(
          (acc, item) => acc + item.amount,
          0
        );

        setMonth(monthTotal);
        setYear(yearTotal)
        setData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []); // Make sure to include any dependencies if needed

  console.log(month);

  const handleEditModal = (id, data) => {
    setFormID(id);
    setEditData(data);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const dataRef = doc(db, "data_donations", id);
      await deleteDoc(dataRef);
      toast.success("Deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      navigate("/dashboard/donation");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tithes Monitoring</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : (
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Tithes Monitoring
            </Typography>
            <Button
              onClick={() => setOpenModal(true)}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Donation
            </Button>
            <AddDonation open={openModal} onClose={() => setOpenModal(false)} />
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Monthly Record"
                total={`₱${fCurrency(month)}`}
                icon={"ant-design:android-filled"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Yearly Record"
                total={`₱${fCurrency(year)}`}
                icon={"ant-design:android-filled"}
              />
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} style={{ marginTop: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Body 1 */}
                    {data ? (
                      data.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.memberName}</TableCell>
                          <TableCell>₱{fCurrency(item.amount)}</TableCell>
                          <TableCell>
                            {" "}
                            {new Date(
                              item.donationDate.seconds * 1000
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell align="left">
                            <IconButton
                              onClick={() => handleEditModal(item.id, item)}
                            >
                              <Iconify icon={"material-symbols:edit-outline"} />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(item.id)}>
                              <Iconify
                                icon={"material-symbols:delete-outline"}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>No data available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <EditDonation
                open={editModal}
                onClose={() => setEditModal(false)}
                id={formID}
                data={editData}
              />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default DonationPage;
