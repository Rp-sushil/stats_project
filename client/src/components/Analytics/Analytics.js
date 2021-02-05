import React from "react";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";

function DatePickers({ startDate, setStartDate, endDate, setEndDate }) {
  return (
    <>
      <TextField
        id="startDate"
        label="Start-Date"
        name="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        required={true}
      />
      <TextField
        id="endDate"
        label="End-Date"
        name="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        required={true}
      />
    </>
  );
}

const initialState = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "forms",
      fill: false,
      lineTension: 0.5,
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
  ],
};
export default function Stats() {
  const [stats, setStats] = React.useState(initialState);
  const [startDate, setStartDate] = React.useState(undefined);
  const [endDate, setEndDate] = React.useState(undefined);
  const [isLoading, setisLoading] = React.useState(true);
  const [flag, fetchNewData] = React.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(true);
    console.log(startDate, endDate);
    fetchNewData((flag) => !flag);
  };

  React.useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/form/stats?startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        var tempLables = Array(data.length);
        var tempData = Array(data.length);
        data.forEach((t, i) => {
          tempLables[i] = t.date;
          tempData[i] = parseInt(t.count);
        });
        return { tempData, tempLables };
      })
      .then(({ tempData, tempLables }) => {
        console.log(tempData, tempLables, "data");
        setStats((stats) => {
          var tempStats = stats;
          console.log(tempStats);
          tempStats.labels = tempLables;
          tempStats.datasets[0].data = tempData;
          return tempStats;
        });
      })
      .then(() => {
        setisLoading(false);
      })
      .catch((err) => console.log(err));
  }, [flag]);
  return (
    <>
      <div style={{ margin: 20, marginLeft: 400 }}>
        <form style={formstyle} onSubmit={handleSubmit}>
          <DatePickers setStartDate={setStartDate} setEndDate={setEndDate} />
          <Button
            size="small"
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="secondary"
          >
            submit
          </Button>
        </form>
      </div>
      {!isLoading && (
        <div
          style={{
            marginTop: "10vh",
            marginLeft: "30vh",
            height: 400,
            width: 1000,
          }}
        >
          <Line
            data={stats}
            options={{
              maintainAspectRatio: false,
              title: {
                display: true,
                text: "Form submission",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
          />
        </div>
      )}
    </>
  );
}

const formstyle = {
  display: "flex",
  flexWrap: "wrap",
};
