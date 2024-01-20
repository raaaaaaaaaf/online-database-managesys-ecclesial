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

  const [approvedCert, setApprovedCert] = useState(0);

  const [pendingCert, setPendingCert] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        const docData = [];
        const reqDoc = query(
          collection(db, "data_certificates"),
          where("uid", "==", user.uid)
        );
        const approvedDocs = query(
          collection(db, "data_certificates"),
          where("isApproved", "==", true),
          where("uid", "==", user.uid)
        );

        const pendingDocs = query(
          collection(db, "data_certificates"),
          where("isApproved", "==", null),
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
        const approvedSnap = await getDocs(approvedDocs);

        const pedningSnap = await getDocs(pendingDocs);

        setEventCount(eventSnap.docs.length);
        setCertData(docData);
        setCertCount(reqSnap.docs.length);
        setApprovedCert(approvedSnap.docs.length);
        setPendingCert(pedningSnap.docs.length);
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
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Events"
                total={eventCount}
                icon={"ant-design:apple-filled"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Requested Certificates"
                total={certCount}
                icon={"fluent:document-error-20-regular"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Approved Certificate"
                total={approvedCert}
                icon={"carbon:task-approved"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Pending Certificate"
                total={pendingCert}
                icon={"ic:baseline-pending-actions"}
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
