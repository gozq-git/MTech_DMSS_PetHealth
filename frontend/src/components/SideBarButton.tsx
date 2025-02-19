import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {SideBarItem} from "./SideBar.tsx";
import {Tooltip} from "@mui/material";
import React from "react";

interface SideBarButtonProps {
    item: SideBarItem;
    onClick: (endpoint: String) => void;
}

export const SideBarButton: React.FC<SideBarButtonProps> = ({item, onClick}) => {
    const IconComponent = item.icon;

    return (
        <Tooltip
            title={item.description}
            placement="right"
            arrow
        >
            <ListItemButton onClick={() => onClick(item.endpoint)}>
                <ListItemIcon>
                    <IconComponent/>
                </ListItemIcon>
                <ListItemText primary={item.text}/>
            </ListItemButton>
        </Tooltip>
    );
}