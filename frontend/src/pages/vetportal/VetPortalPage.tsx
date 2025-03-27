// src/components/VetPortalPage.tsx
import { useState, useEffect, useContext } from "react";
import { VetProfileForm } from "./VetProfileForm";
import VetPortalPageContent from "./VetPortalPageContent";
import { Button } from "@mui/material";
import { ApiClientContext } from "../../providers/ApiClientProvider";
import { AccountTypeContext } from "../../contexts/AccountTypeContext";

const VetPortalPage = () => {
  const { userApi } = useContext(ApiClientContext);
  const { setAccountType } = useContext(AccountTypeContext);
  const [loading, setLoading] = useState(true);
  const [accountTypeState, setAccountTypeState] = useState<"vet" | "none">("none");

  useEffect(() => {
    const checkVetProfile = async () => {
      const result = await userApi.retrieveUser();
      if (result.success && result.data) {
        const vet = result.data.VET;
        if (vet && vet.vet_license && vet.vet_center && vet.vet_phone) {
          setAccountTypeState("vet");
          setAccountType("vet"); 
        } else {
          setAccountTypeState("none");
          setAccountType("user");
        }
      } else {
        setAccountTypeState("none");
        setAccountType("user");
      }
      setLoading(false);
    };

    checkVetProfile();
  }, [userApi, setAccountType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* You can remove this toggle button if not needed */}
      <Button onClick={() => {}}>
        Account Type: {accountTypeState}
      </Button>
      {accountTypeState === "vet" ? <VetPortalPageContent /> : <VetProfileForm />}
    </>
  );
};

export default VetPortalPage;
