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
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [certData, setCertData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docData = [];
        const reqDoc = query(collection(db, "data_certificates"));
        const reqSnap = await getDocs(reqDoc);
        reqSnap.forEach((doc) => {
          docData.push({
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

        const monthRef = query(
          collection(db, "data_donations"),
          where("timeStamp", ">", firstDayOfMonth),
          where("timeStamp", "<=", lastDayOfMonth)
        );

        const monthSnap = await getDocs(monthRef);

        const monthDataArray = monthSnap.docs.map((doc) => doc.data());
        const monthTotal = monthDataArray.reduce(
          (acc, item) => acc + item.amount,
          0
        );
        setCertData(docData);
        setEventData(eventData);
        setUserCount(userSnap.docs.length);
        setEventCount(eventSnap.docs.length);
        setMonthly(monthTotal);
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
            <Grid item xs={12} sm={6} md={4}>
              <AppWidgetSummary
                title="Users"
                color="info"
                total={`${fShortenNumber(userCount)}`}
                icon={"lucide:users-round"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AppWidgetSummary
                title="Event"
                total={`${fShortenNumber(eventCount)}`}
                color="info"
                icon={"clarity:event-line"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <AppWidgetSummary
                title="Montly Donations"
                total={`₱${fCurrency(monthly)}`}
                color="info"
                icon={"formkit:dollar"}
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
