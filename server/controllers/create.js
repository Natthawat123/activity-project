import db from "../db.js";

// activity
export const activity = (req, res) => {
  const q =
    "INSERT INTO activity(`act_title`, `act_desc`, `act_dateStart`, `act_dateEnd`, `act_numStd`, `act_location`, `staff_ID`, `act_status`, `act_createAt`) VALUES (?, ?, ?, ?, ?, ?, ?, 1 , ?)";
  const {
    act_title,
    act_desc,
    act_dateStart,
    act_dateEnd,
    act_numstd,
    act_location,
    staff_ID,
  } = req.body;

  db.query(
    q,
    [
      act_title,
      act_desc,
      act_dateStart,
      act_dateEnd,
      act_numstd,
      act_location,
      staff_ID,
      1,
      new Date(),
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json(result);
    }
  );
};
export const transection = (req, res) => {
  const {
    act_transaction
  } = req.body; // Get act_transaction from request body

  // SQL query to insert a new record into the activity table
  const q = `INSERT INTO activity (act_transaction) VALUES (?)`;

  db.query(q, [act_transaction], (err, result) => {
    if (err) {
      console.error("Error inserting transaction:", err);
      return res.status(500).json({
        error: err.message,
      });
    }

    // Return the ID of the newly inserted record
    res.status(201).json({
      status: "ok",
      insertedId: result.insertId, // Include the ID of the new record
    });
  });
};



export const student = (req, res) => {
  const q =
    "INSERT INTO student(std_ID, login_ID, std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const {
    std_ID,
    login_ID,
    std_fname,
    std_lname,
    sec_ID,
    std_email,
    std_mobile,
    std_address,
    province,
    district,
    subdistrict,
    zipcode,
  } = req.body;
  db.query(
    q,
    [
      std_ID,
      login_ID,
      std_fname,
      std_lname,
      sec_ID,
      std_email,
      std_mobile,
      std_address,
      province,
      district,
      subdistrict,
      zipcode,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({
        status: "ok",
      });
    }
  );
};

export const studentArr = async (req, res) => {
  const q =
    "INSERT INTO student(std_ID, login_ID, std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const students = req.body;

  if (!Array.isArray(students)) {
    console.error(
      "Invalid input format. Expected an array of student objects."
    );
    return res.status(400).json({
      error: "Invalid input format. Expected an array of student objects.",
    });
  }

  try {
    await Promise.all(
      students.map((student) => {
        const {
          std_ID,
          login_ID,
          std_fname,
          std_lname,
          sec_ID,
          std_email,
          std_mobile,
          std_address,
          province,
          district,
          subdistrict,
          zipcode,
        } = student;

        console.log("Inserting student:", student); // Log student data before insertion

        return new Promise((resolve, reject) => {
          db.query(
            q,
            [
              std_ID,
              login_ID,
              std_fname,
              std_lname,
              sec_ID,
              std_email,
              std_mobile,
              std_address,
              province,
              district,
              subdistrict,
              zipcode,
            ],
            (err, result) => {
              if (err) {
                console.error("Database error:", err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      })
    );

    res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    console.error("Error during student registration:", error);
    res.status(500).json({
      error: error.message
    });
  }
};

export const staff = (req, res) => {
  const q =
    "INSERT INTO staff(login_ID, staff_fname, staff_lname, staff_email, staff_mobile, staff_address, province, district, subdistrict, zipcode) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const {
    login_ID,
    staff_fname,
    staff_lname,
    staff_email,
    staff_mobile,
    staff_address,
    province,
    district,
    subdistrict,
    zipcode,
  } = req.body;
  db.query(
    q,
    [
      login_ID,
      staff_fname,
      staff_lname,
      staff_email,
      staff_mobile,
      staff_address,
      province,
      district,
      subdistrict,
      zipcode,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({
        status: "ok",
      });
    }
  );
};

export const staffArr = async (req, res) => {
  const q =
    "INSERT INTO staff(login_ID, staff_fname, staff_lname, staff_email, staff_mobile, staff_address, province, district, subdistrict, zipcode) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const staffs = req.body;

  if (!Array.isArray(staffs)) {
    console.error(
      "Invalid input format. Expected an array of student objects."
    );
    return res.status(400).json({
      error: "Invalid input format. Expected an array of student objects.",
    });
  }

  try {
    await Promise.all(
      staffs.map((staff) => {
        const {
          login_ID,
          staff_fname,
          staff_lname,
          staff_email,
          staff_mobile,
          staff_address,
          province,
          district,
          subdistrict,
          zipcode,
        } = staff;

        console.log("Inserting staff:", staff); // Log staff data before insertion

        return new Promise((resolve, reject) => {
          db.query(
            q,
            [
              login_ID,
              staff_fname,
              staff_lname,
              staff_email,
              staff_mobile,
              staff_address,
              province,
              district,
              subdistrict,
              zipcode,
            ],
            (err, result) => {
              if (err) {
                console.error("Database error:", err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      })
    );

    res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    console.error("Error during staff registration:", error);
    res.status(500).json({
      error: error.message
    });
  }
};