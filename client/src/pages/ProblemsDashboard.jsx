import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useLocation } from "react-router-dom";

const initialRows = [
    { id: 1, name: "Alice", problemIndex: "A1", problemColor: "green", delivered: false, seat: "1,3" },
    { id: 2, name: "Bob", problemIndex: "B2", problemColor: "yellow", delivered: false, seat: "2,3" },
    { id: 3, name: "Charlie", problemIndex: "C3", problemColor: "red", delivered: false, seat: "1,4" },
];


export default function ProblemsDashboard() {

    const location = useLocation()

    const formData = location.state.formData

    // console.log(formData);
    

    const [pendingRows, setPendingRows] = useState(initialRows);
    const [deliveredRows, setDeliveredRows] = useState([]);

    const handleCheckboxChange = (id) => {
        setPendingRows((prevRows) => {
            const rowToMove = prevRows.find((row) => row.id === id);
            if (rowToMove) {
                setDeliveredRows((prevDelivered) => [...prevDelivered, { ...rowToMove, delivered: true }]);
                return prevRows.filter((row) => row.id !== id);
            }
            return prevRows;
        });
    };

    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "problemIndex", headerName: "Problem Index", flex: 1 },
        { field: "problemColor", headerName: "Problem Color", flex: 1 },
        { field: "seat", headerName: "seat", flex: 1 },
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
            <div >
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <h2>Pending Problems</h2>
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        // onClick={() => window.location.reload()}
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
    )
}
