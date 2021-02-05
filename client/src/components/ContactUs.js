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

function ContactUs() {
  const classes = useStyles();
  const [err, setErr] = useState([]);
  const [submitText, setSubmitText] = useState("Submit");
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
    if (!data.firstName || data.firstName.value.length < 3) {
      setErr((err) => err.concat("First Name can not be empty"));
      flag = false;
    }
    if (!data.lastName || data.lastName.value.length < 2) {
      setErr((err) => err.concat("Last Name can not be empty"));
      flag = false;
    }
    if (!data.message || data.message.value.length < 10) {
      setErr((err) => err.concat("Message can not be Empty"));
      flag = false;
    }
    if (!validateEmail(data.email.value)) {
      setErr((err) => err.concat("Email Not valid"));
      flag = false;
    }
    return flag;
  };
  const handleSubmit = async (e) => {
    preventDefault(e);
    setSubmitText("Submitting...");
    setisSubmitted(false);
    setisSubmitting(true);
    if (validate(e.target)) {
      const token = await reRef.current.executeAsync();
      reRef.current.reset();

      const data = {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        email: e.target.email.value,
        message: e.target.message.value,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        data: JSON.stringify({ data, token }),
        url: `http://localhost:5000/api/form/submit`,
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
      setSubmitText("Submit");
      setisSubmitting(false);
    }
  };
  return (
    <div className="contactUs">
      <Typography variant="h6" color="secondary">
        Contact Us Form
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
          id="firstName"
          label="First Name"
          name="fistName"
          variant="outlined"
          size="small"
          required
          value="John"
        />
        <TextField
          id="LastName"
          name="lastName"
          label="Last Name"
          variant="outlined"
          size="small"
          required
          value="Doe"
        ></TextField>
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
          id="message"
          label="Message"
          size="small"
          name="message"
          variant="outlined"
          required
          value="Hello everyone! How are you?"
        ></TextField>
        <br></br>
        <br></br>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={issubmitting}
        >
          {submitText}
        </Button>
      </form>
      <div style={{ margin: 10, marginLeft: "88vh", height: 10, width: 200 }}>
        {isSubmitted && <Alert severity="success">successfully submit!</Alert>}
      </div>
    </div>
  );
}

export default ContactUs;
