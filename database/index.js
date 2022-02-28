import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connect(
  "mongodb://localhost:27017/fractionalOwnership",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected");
  }
);

// User Registration
const userSchema = new mongoose.Schema({
  role: String,
  name: String,
  email: String,
  currencyBalance: Number,
  password: String,
});

const User = new mongoose.model("User", userSchema);
// Property Registration
const propertiesSchema = new mongoose.Schema({
  accountAddress: String,
  previousOwner: String,
  tokensEarned: Number,
  developerEmail: String,
  previousDeveloperEmail: String,
  propertyName: String,
  propertyAddress: String,
  propertyLocality: String,
  propertyCity: String,
  propertyState: String,
  propertyPincode: Number,
  propertyCountry: String,
  propertyType: String,
  geolocation: String,
  propertyFloors: Number,
  propertyAge: Number,
  propertyStatus: String,
  propertyFloorPlate: Number,
  propertyCarpetArea: Number,
  propertyDescription: String,
  propertyValuation: Number,
  propertyInvestPercentage: Number,
  propertyMinInvestment: Number,
  propertyLockInPeriod: Number,
  dateAdded: Date,
  sold: Boolean,
});

const property = new mongoose.model("property", propertiesSchema);

app.post("/myProperty", (req, res) => {
  const body = req.body;
  if (body.accountAddress !== "") {
    property
      .find({
        accountAddress: body.accountAddress,
      })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  } else {
    property
      .find({ sold: false })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }
});

app.post("/addProperty", (req, res) => {
  const data = req.body;
  const newProperty = new property(data);
  let finalpropVal = Number(req.body.propertyValuation);

  newProperty.save((error) => {
    if (error) {
      res.status(500).json({ msg: "Something went wrong!" });
    } else {
      setInterval(increment, 100000);
      function increment() {
        finalpropVal = finalpropVal + 1000;
        let query = { propertyName: req.body.propertyName };
        let updatedValue = { $set: { propertyValuation: finalpropVal } };
        property.updateMany(query, updatedValue, function (err, res) {
          if (err) throw err;
        });
      }
      res.json({ msg: "You data has been saved!" });
    }
  });
});

// Investment
const Investor = new mongoose.Schema({
  account_address: String,
  investedPropertyName: String,
  developer_address: String,
  investor_email: String,
  invested_value: Number,
  tokens_earned: Number,
  invested_amount: Number,
  dateInvested: Date,
  approved: String,
  sell_flag: Boolean,
});

const Investment = new mongoose.model("Investment", Investor);
app.post("/myInvestments", (req, res) => {
  const accountAddress = req.body;

  const investor = Investment.find({
    $and: [
      { account_address: accountAddress.accountAddress },
      { sell_flag: false },
    ],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("error: ", error);
    });
});

// get details of a single property
app.post("/property-details", (req, res) => {
  const details = req.body;
  const propertyDetails = property
    .find({
      $and: [
        { propertyName: details.investedPropertyName },
        { accountAddress: details.developerAddress },
      ],
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("error: ", error);
    });
});

//get details of investors on single property
app.post("/property-investments", (req, res) => {
  const details = req.body;
  const investor = Investment.find({
    $and: [
      { investedPropertyName: details.investedPropertyName },
      { developer_address: details.developerAddress },
    ],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("error: ", error);
    });
});

// update property sold flag on selling of property
app.post("/sell-property", (req, res) => {
  const details = req.body;
  property
    .updateOne(
      {
        $and: [
          { propertyName: details.propertyName },
          { accountAddress: details.developerAddress },
        ],
      },
      {
        $set: {
          sold: true,
          accountAddress: details.toAddress,
          developerEmail: details.developerEmail,
        },
      }
    )
    .then(() => {
      res.json({ status: 200 });
    })
    .catch((error) => {
      console.log("error: ", error);
    });
});

// on selling of property, update developer address in investment table
app.post("/update-investments", (req, res) => {
  const details = req.body;
  Investment.updateMany(
    {
      $and: [
        { investedPropertyName: details.propertyName },
        { developer_address: details.developerAddress },
      ],
    },
    {
      $set: { developer_address: details.toAddress },
    }
  )
    .then(() => {
      res.json({ status: 200 });
    })
    .catch((error) => {
      console.log("error: ", error);
    });
});

// on approval of investment
app.post("/update-approved", (req, res) => {
  const details = req.body;
  Investment.updateMany(
    {
      $and: [
        { investedPropertyName: details.propertyName },
        { developer_address: details.developerAddress },
        { account_address: details.accountAddress },
      ],
    },
    {
      $set: { approved: details.approved },
    }
  )
  .then(() => {
    res.json({ status: 200 });
  })
  .catch((error) => {
    console.log("error: ", error);
  });
});

// update investor sell flag on claiming of funds
app.post("/claim-funds", (req, res) => {
  const details = req.body;

  Investment.updateOne(
    {
      $and: [
        { investedPropertyName: details.propertyName },
        { developer_address: details.developerAddress },
        { account_address: details.account_address },
      ],
    },
    {
      $set: { sell_flag: true },
    }
  )
  .then(() => {
    res.json({ status: 200 });
  })
  .catch((error) => {
    console.log("error: ", error);
  });
});

app.post("/invest", (req, res) => {
  const {
    account_address,
    investedPropertyName,
    developer_address,
    investor_email,
    invested_value,
    tokens_earned,
    invested_amount,
    dateInvested,
  } = req.body;

  const newInvestment = new Investment({
    account_address,
    investedPropertyName,
    developer_address,
    investor_email,
    invested_value,
    tokens_earned,
    invested_amount,
    dateInvested,
    approved: 'false',
    sell_flag: false,
  });

  newInvestment.save((error) => {
    if (error) {
      console.log(error);
      // res.status(500).json({ msg: "Something went wrong!" })
    } else {
      res.json({ status: 200, msg: "You data has been saved!" });
    }
  });
});

// Update currency balance of user
app.post("/update-balance", (req, res) => {
  const { byerEmail, byerBalance, sellerEmail, sellerBalance } = req.body;
  User.updateOne(
    {
      email: byerEmail,
    },
    {
      $set: { currencyBalance: byerBalance },
    }
  ).then(() => {
    User.updateOne(
      {
        email: sellerEmail,
      },
      {
        $set: { currencyBalance: sellerBalance },
      }
    ).then(() => {
      res.send({ status: 200, message: "Balance updated!" });
    })
  });
});

// Get currency balance of user
app.post("/get-balance", (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((data) => {
    res.json({ status: 200, currencyBalance: data.currencyBalance });
  });
});

// get account details
app.post("/account", (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }, (err, data) => {
    if (data) {
      if (data.role !== "Developer") {
        res.send({ status: 403, message: "Recepient is not a developer" });
      } else {
        res.send({ status: 200 });
      }
    } else {
      res.send({ status: 404, message: "No account with this email" });
    }
  });
});

//Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password !== user.password) {
        res.send({ status: 403, message: "Password didn't match" });
      } else {
        res.send({ message: "Login Successfull", user: user });
      }
    } else {
      res.send({ status: 404, message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { role, name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    let initialBalance;
    if (user) {
      res.send({ status: 209, message: "User already registerd" });
    } else {
      if (role === "Developer") {
        initialBalance = 0;
      } else {
        initialBalance = 100000;
      }
      const user = new User({
        role,
        name,
        email,
        currencyBalance: initialBalance,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({
            status: 204,
            message: "Successfully Registered, Please login now.",
          });
        }
      });
    }
  });
});

app.listen(9002, () => {
  console.log("Database started at port 9002");
});
