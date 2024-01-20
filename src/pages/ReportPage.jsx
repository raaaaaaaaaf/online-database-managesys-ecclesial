import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import Label from "../components/label";
import { toast } from "react-toastify";
import ReactToPrint from "react-to-print";
import Iconify from "../components/iconify";
import { AppWidgetSummary } from "../sections/@dashboard/app";

const ReportPage = () => {
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const approvedData = [];
        const rejectedData = [];
        const pendingData = [];
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const approvedDocsRef = query(
          collection(db, "data_certificates"),
          where("isApproved", "==", true),
          where("timeStamp", ">=", oneWeekAgo)
        );

        const rejectedDocsRef = query(
          collection(db, "data_certificates"),
          where("isApproved", "==", false),
          where("timeStamp", ">=", oneWeekAgo)
        );

        const pendingDocsRef = query(
            collection(db, "data_certificates"),
            where("isApproved", "==", null),
            where("timeStamp", ">=", oneWeekAgo)
          );

        const approvedSnap = await getDocs(approvedDocsRef);

        const rejectedSnap = await getDocs(rejectedDocsRef);

        const pedningSnap = await getDocs(pendingDocsRef);

        approvedSnap.forEach((doc) => {
          approvedData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        rejectedSnap.forEach((doc) => {
          rejectedData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        pedningSnap.forEach((doc) => {
            pendingData.push({
              id: doc.id,
              ...doc.data(),
            });
          });

        setApproved(approvedData);
        setRejected(rejectedData);
        setPending(pendingData);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  console.log(approved);

  const handleApproved = async (index) => {
    try {
      const dataRef = doc(db, "data_events", id);

      // Retrieve the existing data from Firestore
      const docSnapshot = await getDoc(dataRef);
      const existingData = docSnapshot.data();

      // Ensure registerData exists and is an array
      if (
        !existingData.registerData ||
        !Array.isArray(existingData.registerData)
      ) {
        console.error("Invalid registerData:", existingData.registerData);
        return;
      }

      // Toggle the isApproved property without losing other properties
      const updatedData = {
        ...existingData,
        registerData: existingData.registerData.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              isApproved: !item.isApproved, // Toggle the boolean value
            };
          }
          return item;
        }),
      };

      // Perform the update
      await updateDoc(dataRef, updatedData);

      toast.success(
        `Registration ${
          updatedData.registerData[index].isApproved
            ? "Approved"
            : "Not Approved"
        }!`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        }
      );
      navigate(`/dashboard/event/view/${id}`);
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      console.error(err);
    }
  };

  const componentRef = useRef();

  return (
    <>
      <Helmet></Helmet>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        m={8}
      >
        {" "}
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Weekly Reports
        </Typography>
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return (
              <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="material-symbols:print-outline" />}
              >
                Print
              </Button>
            );
          }}
          content={() => componentRef.current}
        />
      </Stack>
      <Container ref={componentRef}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={4} style={{ marginTop: "20px" }}>
            <AppWidgetSummary
              title="Approved Certificate"
              color="success"
              total={approved.length}
              icon={"carbon:task-approved"}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} style={{ marginTop: "20px" }}>
            <AppWidgetSummary
              title="Rejected Certificate"
              color="error"
              total={rejected.length}
              icon={"fluent:document-error-20-regular"}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} style={{ marginTop: "20px" }}>
            <AppWidgetSummary
              title="Pending Certificate"
              color="warning"
              total={pending.length}
              icon={"ic:baseline-pending-actions"}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12} style={{ marginTop: "20px" }}>
          <>
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Approved Certificates
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Recipient name</TableCell>
                    <TableCell>Certificate Type</TableCell>
                    <TableCell>Date Issued</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Body 1 */}
                  {approved.length > 0 ? (
                    approved.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.fullName}</TableCell>
                        <TableCell>{item.docType}</TableCell>
                        <TableCell>
                          {item.timeStamp.toDate().toLocaleDateString("en-US")}
                        </TableCell>

                        <TableCell>
                          <Label
                            color={
                              item.isApproved
                                ? "success"
                                : item.isApproved === false
                                ? "error"
                                : "warning"
                            }
                          >
                            {item.isApproved
                              ? "Approved"
                              : item.isApproved === false
                              ? "Rejected"
                              : "Pending"}
                          </Label>
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
          </>
        </Grid>

        <Grid item xs={12} md={12} lg={12} style={{ marginTop: "20px" }}>
          <>
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Rejected Certificates
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Recipient name</TableCell>
                    <TableCell>Certificate Type</TableCell>
                    <TableCell>Date Issued</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Body 1 */}
                  {rejected.length > 0 ? (
                    rejected.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.fullName}</TableCell>
                        <TableCell>{item.docType}</TableCell>
                        <TableCell>
                          {item.timeStamp.toDate().toLocaleDateString("en-US")}
                        </TableCell>

                        <TableCell>
                          <Label
                            color={
                              item.isApproved
                                ? "success"
                                : item.isApproved === false
                                ? "error"
                                : "warning"
                            }
                          >
                            {item.isApproved
                              ? "Approved"
                              : item.isApproved === false
                              ? "Rejected"
                              : "Pending"}
                          </Label>
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
          </>
        </Grid>
        <Grid item xs={12} md={12} lg={12} style={{ marginTop: "20px" }}>
          <>
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Pending Certificates
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Recipient name</TableCell>
                    <TableCell>Certificate Type</TableCell>
                    <TableCell>Date Issued</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Body 1 */}
                  {pending.length > 0 ? (
                    pending.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.fullName}</TableCell>
                        <TableCell>{item.docType}</TableCell>
                        <TableCell>
                          {item.timeStamp.toDate().toLocaleDateString("en-US")}
                        </TableCell>

                        <TableCell>
                          <Label
                            color={
                              item.isApproved
                                ? "success"
                                : item.isApproved === false
                                ? "error"
                                : "warning"
                            }
                          >
                            {item.isApproved
                              ? "Approved"
                              : item.isApproved === false
                              ? "Rejected"
                              : "Pending"}
                          </Label>
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
          </>
        </Grid>
      </Container>
    </>
  );
};

export default ReportPage;
