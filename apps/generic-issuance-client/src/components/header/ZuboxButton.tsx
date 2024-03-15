import { Button, HStack } from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import { FaTruckRampBox } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { PodLink } from "../Core";

/**
 * Button displayed in the top left of each Zubox page - clicking
 * it takes the user back to the dashboard, or if they're already on
 * the dashboard, reloads the page.
 */
export const ZuboxButton = (): ReactNode => {
  const location = useLocation();

  return (
    <PodLink
      to="/dashboard"
      onClick={useCallback(() => {
        if (location.pathname === "/dashboard") {
          window.location.reload();
        }
      }, [location.pathname])}
    >
      <Button variant="outline">
        <ZuboxLogo />
      </Button>
    </PodLink>
  );
};

export const ZuboxLogo = (): ReactNode => {
  return (
    <HStack>
      <span style={{ fontSize: "16pt" }}>
        <FaTruckRampBox />
      </span>
      &nbsp;&nbsp;
      <span>Zubox</span>
    </HStack>
  );
};