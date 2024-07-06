import db from '../db.js'

// activity
export const activity = (req, res) => {
    const q = 'INSERT INTO activity(`act_title`, `act_desc`, `act_dateStart`, `act_dateEnd`, `act_numStd`, `act_location`, `staff_ID`, `act_status`, `act_createAt`) VALUES (?, ?, ?, ?, ?, ?, ?, 1 , ?)'
    const {
        act_title,
        act_desc,
        act_dateStart,
        act_dateEnd,
        act_numstd,
        act_location,
        staff_ID
    } = req.body

    db.query(q, [act_title, act_desc, act_dateStart, act_dateEnd, act_numstd, act_location, staff_ID, 1, new Date()], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

export const student = (req, res) => {
    const q = 'INSERT INTO student(std_ID, login_ID, std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
        zipcode
    } = req.body
    db.query(q, [std_ID, login_ID, std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode], (err, result) => {
        if (err) return res.status(500).json(err)
        res.status(200).json({
            status: 'ok'
    })
    })
}

export const staff = (req, res) => {
    const q = 'INSERT INTO staff(staff_ID, login_ID, staff_fname, staff_lname, staff_email, staff_mobile, staff_address, province, district, subdistrict, zipcode) VALUES (? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const {
        staff_ID,
        login_ID,
        staff_fname,
        staff_lname,
        staff_email,
        staff_mobile,
        staff_address,
        province,
        district,
        subdistrict,
        zipcode
        } = req.body
    db.query(q, [staff_ID, login_ID, staff_fname, staff_lname, staff_email, staff_mobile, staff_address, province, district, subdistrict, zipcode], (err, result) => {
        if (err) return res.status(500).json(err)
        res.status(200).json({
            status: 'ok'
        })
    })
}