import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Loading from "../loading/Loading";

const ViewMember = ({ open, onClose, data }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if data is not yet loaded
    if (!data) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [data]);
  return (
    <Dialog maxWidth={"md"} open={open} onClose={onClose}>
      <DialogTitle>Member Information</DialogTitle>
      <DialogContent>
        {loading ? (
          <Loading />
        ) : (
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} style={{ marginTop: "5px" }}>
              <Divider>Personal Information</Divider>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Full Name:
                {data.fullName}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Date of Birth:
                {new Date(data.birthDate.seconds * 1000).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Civil Status:
                {data.cstatus}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Nakompirmahan?:
                {data.confirmation}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Nakumpisalan?:
                {data.confession}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Trabaho:
                {data.trabaho}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Education:
                {data.edu}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Father:
                {data.fatherFullName}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Address:
                {data.address}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Age:
                {data.age}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Birth Place:
                {data.birthplace}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Nabinyagan?:
                {data.baptized}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Monthly Income: ₱ {data.income}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Coourse:
                {data.course}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Mother:
                {data.motherFullName}
              </Typography>
            </Grid>

            {data.cstatus !== "Single" && (
              <>
                <Grid item xs={12} style={{ marginTop: "5px" }}>
                  <Divider>Husband/Wife Information</Divider>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" style={{ textAlign: "left" }}>
                    Husband/Wife Name:
                    {data.name2}
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: "left" }}>
                    Birth Date:
                    {new Date(
                      data.birthDate2.seconds * 1000
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" style={{ textAlign: "left" }}>
                    Place of Marriage:
                    {data.placeofmarriage}
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: "left" }}>
                    Date of Marriage:
                    {new Date(
                      data.dateofmarriage.seconds * 1000
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                </Grid>
              </>
            )}

            {data.cstatus !== "Single" &&
              data.children.map((record, index) => (
                <>
                  <Grid item xs={12} style={{ marginTop: "5px" }}>
                    <Divider>Children's Information</Divider>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1" style={{ textAlign: "left" }}>
                    {index + 1}. 
                      First Name:
                      {record.fname}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body1" style={{ textAlign: "left" }}>
                      Middle Name:
                      {record.mname}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1" style={{ textAlign: "left" }}>
                      Last Name:
                      {record.lname}
                    </Typography>
                  </Grid>

                </>
              ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMember;
