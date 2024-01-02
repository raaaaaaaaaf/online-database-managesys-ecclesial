import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import {
  Container,
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
import Loading from "../components/loading/Loading";
import { fCurrency } from "../utils/formatNumber";
import { Button } from "@mui/base";
import ReactToPrint from "react-to-print";
import Iconify from "../components/iconify";

const MemberPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const dataRef = doc(db, "data_members", id);
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

  const componentRef = useRef();

  return (
    <>
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
      {loading ? (
        <Loading />
      ) : (
        <Container ref={componentRef}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            mb={5}
          >
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h3" gutterBottom>
                Immaculate Conception Parish Church
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Dinagat Island
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {data.chapel}
              </Typography>
            </Grid>
          </Stack>

          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Pangalan:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.memberName}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Palayaw(Nickname):
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.nickName}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Petsa sa Kapanganakan:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {new Date(data.dob.seconds * 1000).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Edad:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.age}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Relihiyon:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.religion}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Nabinyagan:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.baptized}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Nakumpisalan:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.confirmation}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Tirahan:
                <span
                  style={{
                    paddingLeft: "100px",
                    paddingRight: "100px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.address}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Sariling Bahay:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.house}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Umuupa:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.renting}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Nakikitira:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.nakikitira}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Tel. #/Cell. #:
                <span
                  style={{
                    paddingLeft: "100px",
                    paddingRight: "100px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.cp}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Natapos na Pag-aaral:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.edu}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Kursong Natapos:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.course}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Kita sa Isang Linggo:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  ₱{fCurrency(data.income)}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Company Address:
                <span
                  style={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.caddress}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Iba pang trabaho:
                <span
                  style={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.work}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Kalagayang-Sibil:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.cstatus}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Pangalan ng Asawa:
                <span
                  style={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.asawa}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Hanap-buhay ng asawa:
                <span
                  style={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.work1}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Bilang ng mga anak (Lahat kasama ang namatay):
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.numberChild}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Ilan ang nabubuhay:
                <span
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    borderBottom: "1px solid",
                  }}
                >
                  {data.aliveChild}
                </span>
              </Typography>
            </Grid>

            <TableContainer component={Paper} style={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Work</TableCell>
                    <TableCell>Nabinyagan</TableCell>
                    <TableCell>Nakumpisalan</TableCell>
                    <TableCell>Nag-aaral</TableCell>
                    <TableCell>Kursong Pinag-aralan o Natapos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Body 1 */}
                  {data.children ? (
                    data.children.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.age}</TableCell>
                        <TableCell>{item.work}</TableCell>
                        <TableCell>{item.baptized}</TableCell>
                        <TableCell>{item.kumpisal}</TableCell>
                        <TableCell>{item.inSchool}</TableCell>
                        <TableCell>{item.schoolLevel}</TableCell>
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
          </Grid>
        </Container>
      )}
    </>
  );
};

export default MemberPage;
