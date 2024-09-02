import db from "../db.js";

export const manage = (req, res) => {
  const sql = "SELECT * FROM manage";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "No activity table manage found",
      });
    }
    return res.json(result);
  });
};
export const reserve = (req, res) => {
  const {
    act_ID
  } = req.params;

  const sql = "DELETE FROM manage WHERE act_ID = ? ";

  db.query(sql, [act_ID], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json({
      message: "Activity deleted successfully",
      result,
    });
  });
};

//create
export const createActivity = (req, res) => {
  const q =
    `INSERT INTO activity(act_title, act_desc, act_dateStart, act_dateEnd, act_numStd, act_location, t_ID,  act_createAt) VALUES (?, ?, ?, ?, ?, ?, ? , ?)`;
  const {
    act_title,
    act_desc,
    act_dateStart,
    act_dateEnd,
    act_numStd,
    act_location,
    t_ID,
  } = req.body;

  db.query(
    q,
    [
      act_title,
      act_desc,
      act_dateStart,
      act_dateEnd,
      act_numStd,
      act_location,
      t_ID,
      new Date(),
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json(result);
    }
  );
};

// update
export const updateActivity = (req, res) => {
  const {
    id
  } = req.params;
  const {
    act_title,
    act_desc,
    act_dateStart,
    act_dateEnd,
    act_numStd,
    act_location,
    t_ID,
    act_status,
    act_transaction,
  } = req.body;

  const sql = `
        UPDATE activity SET
            act_title = ?,
            act_desc = ?,
            act_dateStart = ?,
            act_dateEnd = ?,
            act_numStd = ?,
            act_location = ?,
            t_ID = ?,
            act_status = ?,
            act_transaction = ?
        WHERE act_ID = ?`;

  db.query(
    sql,
    [
      act_title,
      act_desc,
      act_dateStart,
      act_dateEnd,
      act_numStd,
      act_location,
      t_ID,
      act_status,
      act_transaction,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      return res.json({
        message: "Activity updated successfully and news ",
        result,
      });

    });
};

// getAll

export const getAll = (req, res) => {
  const sql = `
  SELECT 
    activity.*, teacher.*
  FROM 
    activity
  JOIN 
    teacher ON activity.t_ID = teacher.t_ID;
  `
        
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "No activity found",
      });
    }
    return res.json(result);
  });
};

// get one
export const readActivityOne = (req, res) => {
  const id = req.params.id;
  const sql = `
        SELECT 
          *
        FROM
          activity
        JOIN
          teacher on activity.t_ID = teacher.t_ID
        WHERE activity.act_ID = ?
  ;


`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "No activity found",
      });
    }
    return res.json(result);
  });
};

export const deleteActivity = (req, res) => {
  const {
    id
  } = req.params;
  const sql = "DELETE FROM activity WHERE act_ID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json({
      message: "Activity deleted successfully",
      result,
    });
  });
};

// update status
export const updateStatus = (req, res) => {
  const id = req.params.id;
  const status = 2;

  const sql = "UPDATE activity SET act_status = ? WHERE act_ID = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Database update error: ", err.message); // Improved logging
      return res.status(500).json({
        error: err.message,
      });
    }
    console.log("Database updated successfully: ", result); // Log successful update
    return res.json({
      message: "Activity updated successfully",
      result,
    });
  });
};


//transection
export const transection = (req, res) => {
  const {
    id
  } = req.params;
  const {
    act_transaction
  } = req.body;

  const sql = `UPDATE activity SET
        act_transaction = ?
        WHERE act_ID = ?`;

  db.query(sql, [act_transaction, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json({
      message: "transection updated successfully",
      result,
    });
  });
};