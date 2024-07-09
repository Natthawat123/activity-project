import React, { useState } from 'react';
import Papa from 'papaparse';

function CSVUpload() {
    const [csvData, setCsvData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setCsvData(results.data);
                    },
                    error: (error) => {
                        console.error("Error parsing CSV file: ", error);
                    }
                });
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Upload CSV</h2>
            <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="mb-4"
            />
            {csvData.length > 0 && (
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            {Object.keys(csvData[0]).map((key) => (
                                <th key={key} className="px-4 py-2 text-left">{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {csvData.map((row, index) => (
                            <tr key={index} className="text-gray-700">
                                {Object.values(row).map((value, i) => (
                                    <td key={i} className="px-4 py-2">{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CSVUpload;
