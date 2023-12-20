import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
import Iconify from "../../components/iconify";
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
} from "../../sections/@dashboard/app";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import _ from "lodash";
import { fShortenNumber } from "../../utils/formatNumber";
import Loading from "../../components/loading/Loading";

// ----------------------------------------------------------------------

export default function UserDashboardAppPage() {
  const theme = useTheme();
  const [certData, setCertData] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        const docData = [];
        const reqDoc = query(
          collection(db, "data_certificates"),
          where("uid", "==", user.uid)
        );
        const reqSnap = await getDocs(reqDoc);
        reqSnap.forEach((doc) => {
          docData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        const eventRef = query(collection(db, "data_events"));
        const eventSnap = await getDocs(eventRef);

        setEventCount(eventSnap.docs.length);
        setCertData(docData);
        setCertCount(reqSnap.docs.length);
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

  return (
    <>
      <Helmet>
        <title>
          Online Database Management System for Basic Ecclesial Community
        </title>
      </Helmet>

      {loading ? (
        <Loading />
      ) : (
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Online Database Management System for Basic Ecclesial Community
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Requested Certificates"
                total={`${fShortenNumber(certCount)}`}
                icon={"ant-design:android-filled"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Events"
                total={`${fShortenNumber(eventCount)}`}
                icon={"ant-design:apple-filled"}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
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
