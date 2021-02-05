import React, { useState, useRef } from "react";
import { Button, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 300,
    },
  },
}));

function Login() {
  const classes = useStyles();
  const [err, setErr] = useState([]);
  const [submitText, setSubmitText] = useState("Login");
  const [isSubmitted, setisSubmitted] = useState(false);
  const [issubmitting, setisSubmitting] = useState(false);
  const reRef = useRef();

  const preventDefault = (event) => event.preventDefault();

  const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const validate = (data) => {
    setErr([]);
    let flag = true;
    if (data.password.value.length < 5) {
      setErr((err) =>
        err.concat("Password can not contain less than 5 character")
      );
    }
    if (!validateEmail(data.email.value)) {
      setErr((err) => err.concat("Email Not valid"));
      flag = false;
    }
    return flag;
  };
  const handleSubmit = async (e) => {
    preventDefault(e);
    setSubmitText("Logging...");
    setisSubmitted(false);
    setisSubmitting(true);
    if (validate(e.target)) {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();

      const data = {
        email: e.target.email.value,
        password: e.target.password.value,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        data: JSON.stringify({ data, token }),
        url: `http://localhost:5000/api/login`,
      };
      await axios(options)
        .then((res) => {
          if (res.status === 200) {
            setisSubmitted(true);
            console.log("Yes successfully submitted");
          } else {
            console.log("Falied to submit");
          }
          console.log(res);
        })
        .catch((err) => console.log(err.message));
      setSubmitText("Login");
      setisSubmitting(false);
    }
  };
  return (
    <div className="contactUs">
      <Typography variant="h6" color="secondary">
        Login
      </Typography>
      <ReCAPTCHA
        sitekey={"6LfX7EgaAAAAACjt3MNwHEX0hut4viSEWJWT4UQf"}
        size="invisible"
        ref={reRef}
      ></ReCAPTCHA>
      {err.map((er, i) => {
        return (
          <div style={{ width: 300, marginLeft: 300 }} key={i}>
            <Alert severity="error">{er}</Alert>
          </div>
        );
      })}
      <form onSubmit={handleSubmit} className={classes.root} autoComplete="off">
        <TextField
          id="email"
          type="email"
          label="Email"
          name="email"
          variant="outlined"
          size="small"
          required
          value="joedoe@gmail.com"
        ></TextField>
        <TextField
          id="password"
          type="password"
          label="Password"
          name="password"
          variant="outlined"
          size="small"
          required
          value="password"
        ></TextField>
        <br></br>
        <br></br>
        <Button
          variant="contained"
          color="primary"
          type="Login"
          disabled={issubmitting}
        >
          {submitText}
        </Button>
      </form>
    </div>
  );
}

export default Login;
