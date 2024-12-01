import * as React from "react";

export const useRefreshState = (
  callback: (...args: any[]) => void,
  ...args: any[]
) => {
  const [refresh, setRefresh] = React.useState(false);

  const handleRefresh = () => {
    setRefresh(true);
    callback(...args);
    setRefresh(false);
  };

  return { refresh, handleRefresh };
};
