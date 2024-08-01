import db from '../db.js'

// user
export const user = (req, res) => {
    const sql = `
        SELECT 
            l.*, 
            s.*,

            COALESCE(t.login_ID, st.login_ID, a.login_ID) AS ID,
            COALESCE(t.staff_fname, st.std_fname, a.fname) AS fname,
            COALESCE(t.staff_lname, st.std_lname, a.lname) AS lname,
            COALESCE(t.staff_email, st.std_email, a.email) AS email,
            COALESCE(t.staff_mobile, st.std_mobile, a.mobile) AS mobile,
            COALESCE(t.staff_address, st.std_address) AS address,
            COALESCE(t.province, st.province) AS province,
            COALESCE(t.district, st.district) AS district,
            COALESCE(t.subdistrict, st.subdistrict) AS subdistrict,
            COALESCE(t.zipcode, st.zipcode) AS zipcode

        FROM 
            login l

        LEFT JOIN teacher t ON l.login_ID = t.login_ID
        LEFT JOIN student st ON l.username = st.login_ID
        LEFT JOIN admin a ON l.login_ID = a.login_ID
        LEFT JOIN section s ON COALESCE(t.sec_ID, st.sec_ID) = s.sec_ID 
    `

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}