import {
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
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

const ViewMarriage = () => {
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
        <title> Marriage Certificate </title>
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
            {/* <img
              src="/assets/logo.png"
              alt="logo"
              style={{ width: "150px", height: "150px" }}
            /> */}
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
              src="/assets/logo2.png"
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
              MARRIAGE CERTIFICATE
            </Typography>
            <Typography
              variant="body1"
              style={{
                marginTop: "40px",
                marginBottom: "20px",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              This is to certify that
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <span style={{ textDecoration: "underline" }}>
                {data.fullName}
              </span>{" "}
              &nbsp; and &nbsp;{" "}
              <span style={{ textDecoration: "underline" }}>
                {data.fullName2}
              </span>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Were Wed on the &nbsp;
              <span style={{ textDecoration: "underline" }}>
                {new Date(data.dateofmarriage.seconds * 1000).toLocaleDateString("en-US", {
                  day: "numeric",
                })}
              </span>{" "}
              &nbsp; Day of &nbsp;{" "}
              <span style={{ textDecoration: "underline" }}>
                {new Date(data.dateofmarriage.seconds * 1000).toLocaleDateString("en-US", {
                  month: "long",
                })}
              </span>
              &nbsp; In the year &nbsp;
              <span style={{ textDecoration: "underline" }}>
                {new Date(data.dateofmarriage.seconds * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                })}
              </span>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              At: &nbsp;
              <span style={{ textDecoration: "underline" }}>{data.place}</span>
            </Typography>

            <Grid container spacing={2}>
              {/* First column */}
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ marginTop: "40px", textAlign: "center" }}
                >
                  <span
                    style={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    {data.fullName}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ textAlign: "center" }}
                >
                  Groom
                </Typography>
              </Grid>

              {/* Second column */}
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ marginTop: "40px", textAlign: "center" }}
                >
                  <span
                    style={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    {data.fullName2}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ textAlign: "center" }}
                >
                  Bride
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ textAlign: "right", marginRight: "100px" }}
              >
                <TextField
                  variant="standard"
                  style={{
                    marginTop: "20px",
                    marginRight: "30px",
                    width: "300px",
                    maxWidth: "100%",
                    
                  }}
                />
                <Typography
                  variant="body1"
                  gutterBottom
                  style={{ textAlign: "right",
                  marginRight: "50px" }}
                >
                  Parish Priest/Secretary/Coordinator
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default ViewMarriage;
