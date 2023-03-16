import { useEffect, useState } from "react";

function useViewport() {
  const [sliceLimit, setSliceLimit] = useState(15);
  const [accountLimit, setAccountLimit] = useState(15);
  const [cutLimit, setCutLimit] = useState(6);
  
  // useEffect(() => {
  //   console.log(sliceLimit,accountLimit, 'current slice/account limit')
  // }, [sliceLimit, accountLimit]);
  
  useEffect(() => {
    function handleWindowResize() {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        if (width < 1280 && width >= 1001) {
          setSliceLimit(8);
          setAccountLimit(8);
          setCutLimit(6);
        } else if (width < 1000 && width >= 768 ) {
          setSliceLimit(3);
          setAccountLimit(3); 
          setCutLimit(3);
        } else if (width < 767) {
          setSliceLimit(6);
          setAccountLimit(6); 
          setCutLimit(4);
        } else {
          setSliceLimit(15);
          setAccountLimit(15);
          setCutLimit(6);
        }
      }
    }
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  function cutAddress(accountId) {
    const first = accountId.slice(0, cutLimit);
    const last = accountId.slice(-cutLimit);
    const newAddress = first + "..." + last;
    if (accountId.length > accountLimit) {
      return newAddress;
    } else {
      return accountId;
    }
  }

  function cutTeam(teamName) {
    const first = teamName.slice(0, cutLimit);
    const last = teamName.slice(-cutLimit);
    const newAddress = first + "..." + last;
    if (teamName.length > accountLimit) {
      return newAddress;
    } else {
      return teamName;
    }
  }

  function entryCut(accountId){
    const first = accountId.slice(0, 6);
    const last = accountId.slice(-6);
    const newAddress = first + "..." + last;
    if (accountId.length > 15) {
      return newAddress;
    } else {
      return accountId;
    }
  }

  function entryCutTeam(teamName){
    const first = teamName.slice(0, 6);
    const last = teamName.slice(-6);
    const newAddress = first + "..." + last;
    if (teamName.length > 15) {
      return newAddress;
    } else {
      return teamName;
    }
  }
  return { cutAddress, cutTeam, entryCut, entryCutTeam };
}


export default useViewport;
