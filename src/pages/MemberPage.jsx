import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { Container, Stack, Typography } from "@mui/material";
import Loading from "../components/loading/Loading";

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
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              {data.memberName}
            </Typography>
          </Stack>
        </Container>
      )}
    </>
  );
};

export default MemberPage;
