import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, IconButton, Select, InputLabel, FormControl, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Form(){

    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);

    const [formData, setFormData] = useState({
        locations: [],
        problems: [{ problemIndex: "", problemColor: "" }], 
        contestId: "",
    });

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get("http://localhost:3000/locations");
                setLocations(response.data.data);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationChange = (event) => {
        setFormData({ ...formData, locations: event.target.value });
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

            <FormControl fullWidth required>
                <InputLabel>Location</InputLabel>
                <Select
                    multiple
                    name="locations"
                    value={formData.locations}
                    onChange={handleLocationChange}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={locations.find(loc => loc._id === value)?.name || value} />
                            ))}
                        </Box>
                    )}
                >
                    {locations.map((location) => (
                        <MenuItem key={location._id} value={location._id}>
                            {location.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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

            

            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
};

