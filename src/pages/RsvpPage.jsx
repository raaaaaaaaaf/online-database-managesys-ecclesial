import {
  Button,
  Card,
  Container,
  Divider,
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import Label from "../components/label";
import { toast } from "react-toastify";
import ReactToPrint from "react-to-print";
import Iconify from "../components/iconify";

const RsvpPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const dataRef = doc(db, "data_events", id);
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(dataRef);
          if (docSnap.exists()) {
            setData({ ...docSnap.data(), id: docSnap.id });
            setLoading(false);
          } else {
            setData({});
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          setData({});
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setData({});
    }
  }, [id]);

  console.log(data);

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
          {data.eventName}
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
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Registered Users
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Contact No.</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Body 1 */}
              {data.registerData ? (
                data.registerData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleApproved(index)}>
                        <Label color={item.isApproved ? "success" : "error"}>
                          {item.isApproved ? "Approved" : "Pending"}
                        </Label>
                      </Button>
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

        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "40px" }}
        >
          Attendance
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.attendanceData ? (
                data.attendanceData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>
                      {new Date(item.date.seconds * 1000).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(item.time.seconds * 1000).toLocaleTimeString(
                        "en-US"
                      )}
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
      </Container>
    </>
  );
};

export default RsvpPage;
