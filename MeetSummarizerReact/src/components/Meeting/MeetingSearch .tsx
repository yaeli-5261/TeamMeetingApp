"use client"

import { TextField, Box, InputAdornment, Paper, IconButton, Tooltip } from "@mui/material"
import { type ChangeEvent, useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"

interface MeetingSearchProps {
  onSearch: (query: string) => void
}

export default function MeetingSearch({ onSearch }: MeetingSearchProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchValue("")
    onSearch("")
  }

  return (
    <Box mb={3}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          },
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          },
        }}
      >
        <InputAdornment position="start" sx={{ pl: 2 }}>
          <SearchIcon color="action" />
        </InputAdornment>
        <TextField
          placeholder="חפש פגישה לפי שם"
          value={searchValue}
          onChange={handleSearch}
          variant="standard"
          fullWidth
          sx={{
            px: 1,
            "& .MuiInput-root": {
              border: "none",
              "&:before, &:after": {
                display: "none",
              },
            },
            "& .MuiInputBase-input": {
              py: 1.5,
            },
          }}
          InputProps={{
            disableUnderline: true,
            endAdornment: searchValue ? (
              <Tooltip title="נקה חיפוש">
                <IconButton size="small" onClick={handleClear} sx={{ mr: 0.5 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null,
          }}
        />
      </Paper>
    </Box>
  )
}


