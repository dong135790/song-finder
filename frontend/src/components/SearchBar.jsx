import React, { useState } from "react";
import { Box, IconButton, InputBase, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const [type, setType] = useState("songs"); // songs | artists

  const submit = () => {
    const q = value.trim();
    if (!q) return;
    onSearch(q, type);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
        size="small"
        sx={{
          color: "white",
          ".MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.7)" },
          minWidth: 140,
        }}
      >
        <MenuItem value="songs">Songs</MenuItem>
      </Select>

      <InputBase
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Search..."
        sx={{ flex: 1, color: "white", px: 1 }}
      />

      <IconButton onClick={submit} sx={{ color: "white" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
