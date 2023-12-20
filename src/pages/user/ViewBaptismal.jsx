import {
    Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import Loading from "../../components/loading/Loading";
import ReactToPrint from "react-to-print";
import Iconify from "../../components/iconify";

const ViewBaptismal = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const dataRef = doc(db, "data_certificates", id);
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
      <Helmet>
        <title> Baptismal Certificate </title>
      </Helmet>
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
            justifyContent="space-between"
            mb={5}
          >
            <img
              src="/assets/logo1.png"
              alt="logo"
              style={{ width: "150px", height: "150px" }}
            />
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
            </Grid>

            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ width: "150px", height: "150px" }}
            />
          </Stack>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" style={{ marginTop: "40px" }}>
              BAPTISMAL CERTIFICATE
            </Typography>
            <Typography
              variant="h3"
              style={{
                marginTop: "40px",
                textTransform: "uppercase",
                textDecoration: "underline",
              }}
            >
              {data.fullName}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Has been baptized "
              <span style={{ color: "red", fontStyle: "italic" }}>
                In the name of the Father and of the Son and of the Holy Spirit
              </span>
              " and in accordance with the{" "}
              <span style={{ color: "red", fontStyle: "italic" }}>
                ONE, HOLY, CATHOLIC CHURCH.
              </span>
            </Typography>

            <Grid container spacing={0.5}>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ margin: "5px", fontWeight: "bold" }}
                >
                  Date of Baptism:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {new Date(data.pob.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ margin: "5px", fontWeight: "bold" }}
                >
                  Date of Birth:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {new Date(data.dob.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ margin: "5px", fontWeight: "bold" }}
                >
                  Place of Birth:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {data.placeofbirth}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ margin: "5px", fontWeight: "bold" }}
                >
                  Nationality:{" "}
                  <span style={{ textDecoration: "underline" }}>Filipino</span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ margin: "5px", fontWeight: "bold" }}
                >
                  Name of Mother:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {data.motherName}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ margin: "5px", fontWeight: "bold" }}
                >
                  Name of Father:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {data.fatherName}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ margin: "5px", fontWeight: "bold" }}
                >
                  Sponsors:  &nbsp;
                  {data.sponsors.map((item, index) => (
                    <span key={index} style={{ textDecoration: "underline" }}>
                      {item.name}, &nbsp;
                    </span>
                  ))}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ marginTop: "20px", fontWeight: "bold" }}
                >
                  Officiant:{" "}
                  <span style={{ textDecoration: "underline" }}>
                    {data.rev}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  IN WITNESS WHEREOF, I hereby sign this certificate of baptism
                  this{"  "}
                  <span style={{ fontWeight: "bold" }}>
                    {new Date(data.timeStamp.seconds * 1000).toLocaleDateString(
                      "en-US",
                      { day: "numeric" }
                    )}
                  </span>
                  &nbsp; day of &nbsp;
                  <span style={{ fontWeight: "bold" }}>
                    {new Date(data.timeStamp.seconds * 1000).toLocaleDateString(
                      "en-US",
                      { month: "long" }
                    )}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ marginTop: "40px", marginRight: "50px", textAlign: "right" }}
                >
                  <span
                    style={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    {data.rev}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{  marginRight: "90px",textAlign: "right" }}
                >
                    BISHOP
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default ViewBaptismal;
