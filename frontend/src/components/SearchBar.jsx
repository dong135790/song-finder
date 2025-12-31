import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch, placeholder = "Search songs, artists, genres..." }) => {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    onSearch(q);
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ display: "flex", gap: 1 }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        size="small"
        sx={{
          input: { color: "white" },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.06)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.15)",
          },
        }}
      />
      <IconButton
        type="submit"
        sx={{
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.10)",
          color: "white",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.16)" },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
