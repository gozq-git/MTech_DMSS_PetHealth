import React from "react";
import Box from "@mui/material/Box";

export interface TabPanelProps {
    children: React.ReactNode;
    index: number;
    value: number;
}

export const TabPanel: React.FC<TabPanelProps> = (props) => {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`health-tabpanel-${index}`}
            aria-labelledby={`health-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}