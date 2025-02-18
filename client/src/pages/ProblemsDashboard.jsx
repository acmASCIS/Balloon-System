import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation } from "react-router-dom";
import axios from "axios"; 

export default function ProblemsDashboard() {
    const location = useLocation();
    const formData = location.state.formData;

    const [pendingRows, setPendingRows] = useState([]);
    const [deliveredRows, setDeliveredRows] = useState([]);

    
    const fetchSubmissions = async () => {
        try {
            const response = await axios.get(`/submissions/${formData.contestId}`);
            const submissions = response.data.data;

            // Separate submissions into pending and delivered
            const pending = submissions.filter(submission => !submission.delivered);
            const delivered = submissions.filter(submission => submission.delivered);

            setPendingRows(pending);
            setDeliveredRows(delivered);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [formData.contestId]); // Run only once when the component mounts

    const handleCheckboxChange = async (id) => {
        const rowToMove = pendingRows.find((row) => row.id === id);
        if (rowToMove) {
            try {
                // Send a POST request to the API to mark the submission as delivered
                await axios.post('/deliver', {
                    handle: rowToMove.handle,
                    problem_index: rowToMove.problem_index
                });

                // Update the state to move the submission from pendingRows to deliveredRows
                setPendingRows((prevRows) => prevRows.filter((row) => row.id !== id));
                setDeliveredRows((prevDelivered) => [...prevDelivered, { ...rowToMove, delivered: true }]);
            } catch (error) {
                console.error("Error delivering submission:", error);
            }
        }
    };

    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "problemIndex", headerName: "Problem Index", flex: 1 },
        { field: "problemColor", headerName: "Problem Color", flex: 1 },
        { field: "seat", headerName: "Seat", flex: 1 },
        {
            field: "delivered",
            headerName: "Delivered",
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.delivered}
                    onChange={() => handleCheckboxChange(params.row.id)}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: "30px 80px" }}>
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>Pending Problems</h2>
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={fetchSubmissions} 
                    >
                        Refresh
                    </Button>
                </div>
                <DataGrid rows={pendingRows} columns={columns} />
            </div>
            <div>
                <h2>Delivered Problems</h2>
                <DataGrid rows={deliveredRows} columns={columns} />
            </div>
        </div>
    );
}
