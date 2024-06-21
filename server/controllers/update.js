import db from '../db.js'

// student
export const student = (req, res) => {
    const id = req.params.id;
    const {
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
    } = req.body;

    const q = `
        UPDATE student 
        SET std_fname = ?, 
            std_lname = ?, 
            sec_ID = ?, 
            std_email = ?, 
            std_mobile = ?, 
            std_address = ?, 
            province = ?, 
            district = ?, 
            subdistrict = ?, 
            zipcode = ? 
        WHERE std_ID = ?
    `;

    db.query(q, [std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json({
            message: 'Student updated successfully',
            result
        });
    });
};

// staff
export const staff = (req, res) => {
    const id = req.params.id
    const {
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
    const q = 'UPDATE `staff` SET `staff_fname`= ?,`staff_lname`= ?,`staff_email`= ?,`staff_mobile`= ?,`staff_address`= ?,`province`= ?,`district`= ?,`subdistrict`= ?,`zipcode`= ? WHERE staff_ID = ?'

    db.query(q, [staff_fname,
        staff_lname, staff_email, staff_mobile, staff_address, province, district, subdistrict, zipcode, id], (err, result) => {
            if (err) return res.status(500).json(err)
            return res.json(result)
        })
}