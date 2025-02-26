import {useState} from "react";
import {VetProfileForm} from "./VetProfileForm.tsx";
import VetPortalPageContent from "./VetPortalPageContent.tsx";
import {Button} from "@mui/material";

const VetPortalPage = () => {
    const [accountType, setAccountType] = useState("vet")

    function toggleAccountType() {
        if (accountType === "vet") {
            setAccountType("none")
        } else {
            setAccountType("vet")
        }
    }

    return <>
        <Button onClick={toggleAccountType}>
            Toggle Account Type {accountType}
        </Button>
        {accountType === "vet" ? (<VetPortalPageContent/>) : (<VetProfileForm/>)}
    </>
}

export default VetPortalPage