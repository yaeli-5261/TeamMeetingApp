import { TextField, Box } from "@mui/material";
import { ChangeEvent } from "react";

interface MeetingSearchProps {
  onSearch: (query: string) => void;
}

export default function MeetingSearch({ onSearch }: MeetingSearchProps) {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <Box mb={3} display="flex" justifyContent="center">
      <TextField
        label="חפש פגישה לפי שם"
        variant="outlined"
        onChange={handleSearch}
        sx={{ width: "100%", maxWidth: 400 }}
      />
    </Box>
  );
}
