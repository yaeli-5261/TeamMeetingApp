import { combineSlices, configureStore } from "@reduxjs/toolkit";
import meetingSlice from "./meetingSlice";
import authSlice from "./authSlice";

const store = configureStore({
    reducer:combineSlices (
     authSlice ,
     meetingSlice
    )
});

// טיפוסים עבור Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
