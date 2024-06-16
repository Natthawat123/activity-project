import React, { useState, useEffect } from 'react';

function ToContract() {
    const [data, setData] = useState([]);
    const [students, setStudents] = useState([]);
    const [activity, setActivity] = useState([]);
    const [actIDCounts, setActIDCounts] = useState({});
    const [section, setSection] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionResponse = await fetch('http://localhost:3333/getSection');
                if (!sectionResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const sectionData = await sectionResponse.json();
                setSection(sectionData);

                const manageResponse = await fetch('http://localhost:3333/getManage');
                if (!manageResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const manageData = await manageResponse.json();
                setData(manageData);

                const studentResponse = await fetch('http://localhost:3333/getStudent');
                if (!studentResponse.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const studentData = await studentResponse.json();
                setStudents(studentData);

                const activityResponse = await fetch('http://localhost:3333/getActivity');
                if (!activityResponse.ok) {
                    throw new Error('Failed to fetch activity data');
                }
                const activityData = await activityResponse.json();
                setActivity(activityData);

                // Calculate the count of act_ID
                const counts = manageData.reduce((acc, item) => {
                    acc[item.act_ID] = (acc[item.act_ID] || 0) + 1;
                    return acc;
                }, {});
                setActIDCounts(counts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='container'>
            <div className="overflow-x-auto">
                {Object.entries(actIDCounts).map(([act_ID, count]) => {
                    const group = data.filter(item => item.act_ID === act_ID);
                    const activityItem = activity.find(act => act.act_ID == act_ID);

                    return (
                        <div key={act_ID} className="mb-16 flex">
                            <div className="bg-teal-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-green-600 w-1/6 m-5">
                                <div className='text-center text-2xl font-bold'>
                                    {activityItem?.act_title}
                                </div>
                                <p>{count} / {activityItem?.act_numStd}</p>
                            </div>
                            <div className="w-3/4">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ยืนยัน</th>
                                            <th>รหัสนักศึกษา</th>
                                            <th>ชื่อ</th>
                                            <th>นามสกุล</th>
                                            <th>หมู่เรียน</th>
                                            <th>รายละเอียด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.map(item => {
                                            const student = students.find(student => student.std_ID === item.std_ID);
                                            const secName = section.find(sec => sec.sec_ID == student.sec_ID)?.sec_name;
                                            return (
                                                <tr key={item.man_ID}>
                                                    <td>
                                                        <label>
                                                            <input type="checkbox" className="checkbox border-4 border-teal-600/100 bor" />
                                                        </label>
                                                    </td>
                                                    <td>{item.std_ID}</td>
                                                    <td>{student.std_fname}</td>
                                                    <td>{student.std_lname}</td>
                                                    <td>{secName}</td>
                                                    <td>
                                                        <button className="text-teal-600 hover:text-red-500">Details</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
                <div className="flex justify-center mt-16">
                    <button type="submit" className="btn btn-primary text-white">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ToContract;
