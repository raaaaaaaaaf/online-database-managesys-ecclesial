import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
import Iconify from "../components/iconify";
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from "../sections/@dashboard/app";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { fCurrency, fShortenNumber } from "../utils/formatNumber";
import _ from "lodash";
import Loading from "../components/loading/Loading";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [eventCount, setEventCount] = useState(0);
  const [certData, setCertData] = useState([]);

  const [totalCert, setTotalCert] = useState(0)
  
  const [approvedCert, setApprovedCert] = useState(0)

  const [pendingCert, setPendingCert] = useState(0)

  const [eventData, setEventData] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalData = [];

        const totalDoc = query(collection(db, "data_certificates"));

        const approvedDocs = query(
          collection(db, "data_certificates"),
          where("isApproved", "==", true)
        );

        const pendingDocs = query(
          collection(db, "data_certificates"),
          where("isApproved", "==", null)
        );

        const totalSnap = await getDocs(totalDoc);

        const approvedSnap = await getDocs(approvedDocs);

        const pedningSnap = await getDocs(pendingDocs);

        totalSnap.forEach((doc) => {
          totalData.push({
            id: doc.id,
            ...doc.data(),
          });
        });



        const eventData = [];
        const eventRef = query(collection(db, "data_events"));
        const eventSnap = await getDocs(eventRef);
        eventSnap.forEach((doc) => {
          eventData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const userRef = query(collection(db, "users"));
        const userSnap = await getDocs(userRef);

        setCertData(totalData);
        setEventData(eventData);
        setEventCount(eventSnap.docs.length);
        setTotalCert(totalSnap.docs.length)
        setApprovedCert(approvedSnap.docs.length)
        setPendingCert(pedningSnap.docs.length)
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const sortedDocData = _.sortBy(
    certData,
    (data) => data.timeStamp.seconds
  ).reverse();

  console.log(certData);
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      {loading ? (
        <Loading />
      ) : (
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Online Database Management System for Basic Ecclesial Community
          </Typography>

          <Grid container spacing={3}>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Event"
                total={eventCount}
                color="info"
                icon={"clarity:event-line"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Requested Certificate"
                total={totalCert}
                color="info"
                icon={"fluent:document-error-20-regular"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Approved Certificate"
                total={approvedCert}
                color="info"
                icon={"carbon:task-approved"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Pending Certificate"
                total={pendingCert}
                color="info"
                icon={"ic:baseline-pending-actions"}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AppNewsUpdate title="Events" list={eventData} />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppOrderTimeline
                title="Certificate Request Timeline"
                list={sortedDocData.slice(0, 5).map((data, index) => ({
                  id: `${data.id}`,
                  title: `${data.fullName} - (${data.docType})`,
                  type: `order${index + 1}`,
                  time: `${new Date(
                    data.timeStamp.seconds * 1000
                  ).toLocaleString("en-US")}`,
                }))}
              />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}
