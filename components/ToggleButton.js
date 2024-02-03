import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/button";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export const ToggleButton = ({ isPresent, student, mutateFn }) => {
  const [toggled, setToggled] = useState(isPresent);

  useEffect(() => {
    if (toggled === isPresent) return;
    let resetTimer;
    resetTimer = setTimeout(() => {
      mutateFn([toggled, student]);
    }, 2000);
    return () => clearTimeout(resetTimer);
  }, [toggled]);

  return (
    <Button 
      colorScheme={toggled ? "green" : "gray"}
      rightIcon={toggled ? <CheckIcon /> : <CloseIcon boxSize={3}/>}
      w="100%"
      size={{ base: "sm", md: "md" }}
      onClick={() => setToggled(!toggled)}
    >
      {toggled ? "Present" : "Absent"}
    </Button>
  );
};
