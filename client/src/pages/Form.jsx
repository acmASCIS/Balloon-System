import React, { useState } from "react";
import { TextField, Button, MenuItem, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function Form(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        location: "",
        problems: [{ problemIndex: "", problemColor: "" }], 
        contestId: "",
        groupId: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProblemChange = (index, field, value) => {
        const updatedProblems = [...formData.problems];
        updatedProblems[index][field] = value;
        setFormData({ ...formData, problems: updatedProblems });
    };

    const addProblem = () => {
        setFormData({ ...formData, problems: [...formData.problems, { problemIndex: "", problemColor: "" }] });
    };

    const removeProblem = (index) => {
        const updatedProblems = formData.problems.filter((_, i) => i !== index);
        setFormData({ ...formData, problems: updatedProblems });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        
        navigate("/problems-dashboard", { state: { formData } });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500, padding:"30px 80px"}}
        >

            <TextField
                select
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
            >
                <MenuItem value="fahmy">Fahmy</MenuItem>
                <MenuItem value="saeed">Saeed</MenuItem>
            </TextField>

            {formData.problems.map((problem, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                        label="Problem Index"
                        name={`problemIndex-${index}`}
                        value={problem.problemIndex}
                        onChange={(e) => handleProblemChange(index, "problemIndex", e.target.value)}
                        required
                    />
                    <TextField
                        label="Problem Color"
                        name={`problemColor-${index}`}
                        value={problem.problemColor}
                        onChange={(e) => handleProblemChange(index, "problemColor", e.target.value)}
                        required
                    />
                    <IconButton onClick={() => removeProblem(index)} disabled={formData.problems.length === 1}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button variant="outlined" onClick={addProblem}>
                Add Problem
            </Button>

            <TextField
                label="Contest ID"
                name="contestId"
                type="text"
                value={formData.contestId}
                onChange={handleChange}
                required
            />

            <TextField
                label="Group ID"
                name="groupId"
                type="text"
                value={formData.groupId}
                onChange={handleChange}
                required
            />

            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
};

