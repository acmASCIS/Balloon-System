import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loading spinner

export default function ProblemsDashboard() {
    const location = useLocation();
    const formData = location.state.formData;

    const [pendingRows, setPendingRows] = useState([]);
    const [deliveredRows, setDeliveredRows] = useState([]);
    const [loading, setLoading] = useState(false); // State variable to track loading state

    // Function to fetch submissions data from the backend API
    const fetchSubmissions = async () => {
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.get(`http://localhost:3000/submissions/${formData.contestId}?location=${formData.location}`);
            console.log(response);
            const submissions = response.data.data;

            // Separate submissions into pending and delivered
            const pending = submissions.filter(submission => !submission.delivered);
            const delivered = submissions.filter(submission => submission.delivered);

            setPendingRows(pending);
            setDeliveredRows(delivered);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setLoading(false); // Set loading state to false
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
                await axios.post('http://localhost:3000/deliver', {
                    handle: rowToMove.handle,
                    problem_index: rowToMove.problem_index
                });

                // Update the state to move the submission from pendingRows to deliveredRows
                setPendingRows((prevRows) => prevRows.filter((row) => row.id !== id));
                setDeliveredRows((prevDelivered) => [...prevDelivered, { ...rowToMove, delivered: true }]);

                // Show success toast
                toast.success("Submission delivered successfully!");
            } catch (error) {
                console.error("Error delivering submission:", error);
                // Show error toast
                toast.error("Error delivering submission.");
            }
        }
    };

    const handleUndeliverCheckboxChange = async (id) => {
        const rowToMove = deliveredRows.find((row) => row.id === id);
        if (rowToMove) {
            try {
                // Send a POST request to the API to mark the submission as undelivered
                await axios.post('http://localhost:3000/undeliver', {
                    handle: rowToMove.handle,
                    problem_index: rowToMove.problem_index
                });

                // Update the state to move the submission from deliveredRows to pendingRows
                setDeliveredRows((prevRows) => prevRows.filter((row) => row.id !== id));
                setPendingRows((prevPending) => [...prevPending, { ...rowToMove, delivered: false }]);

                // Show success toast
                toast.success("Submission undelivered successfully!");
            } catch (error) {
                console.error("Error undelivering submission:", error);
                // Show error toast
                toast.error("Error undelivering submission.");
            }
        }
    };

    const columns = [
        { field: "handle", headerName: "Name", flex: 1 },
        { field: "problem_index", headerName: "Problem Index", flex: 1 },
        {
            field: "problemColor",
            headerName: "Problem Color",
            flex: 1,
            renderCell: (params) => {
                if (!params.row || !formData?.problems) return "unknown color";
                
                const problem = formData.problems.find(p => p.problemIndex === params.row.problem_index);
                return problem ? problem.problemColor : "unknown color";
            },
        },
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
        {
            field: "runner",
            headerName: "Runner",
            flex: 1,
            renderCell: (params) => (
                <input
                    type="text"
                />
            ),
        },
    ];

    const deliveredColumns = [
        ...columns.slice(0, -2),
        {
            field: "delivered",
            headerName: "Delivered",
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.delivered}
                    onChange={() => handleUndeliverCheckboxChange(params.row.id)}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: "30px 80px" }}>
            <ToastContainer />
            <div style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1, padding: "10px", borderBottom: "1px solid #ccc" }}>
                <p>Note: "seat 4, 5" means the fourth bench from the front of the hall and fifth position from the right.</p>
                <p>البنش الرابع و ضهرك للسبورة و المكان الخامس من اليمين</p>
            </div>
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
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <DataGrid rows={pendingRows} columns={columns} />
                )}
            </div>
            <div>
                <h2>Delivered Problems</h2>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <DataGrid rows={deliveredRows} columns={deliveredColumns} />
                )}
            </div>
        </div>
    );
}
