const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/b618d5e155";
  const options = {
    method: "POST",
    auth: "jinwook:efc44db3ce4e6646f04ff98c7cb8233d-us14"
  };

  const request = https.request(url, options, function(resp) {

    const statusCode = resp.statusCode;

    resp.on("data", function(data) {
      const daTa = JSON.parse(data);

      if (daTa.error_count === 0 && statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else if (daTa.error_count > 0 && statusCode === 200) {
        res.sendFile(__dirname +  "/failure.html");
        // res.sendFile(__dirname +  "/failure.html");
        // $(".fMessage").text("Account already exists. Please sign in.");
      } else if (statusCode != 200) {
        res.sendFile(__dirname +  "/failure.html");
      }

    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || port, function(req, res) {
  console.log("Server is running on port 3000.");
});



//API Key : efc44db3ce4e6646f04ff98c7cb8233d-us14

//List ID : b618d5e155
