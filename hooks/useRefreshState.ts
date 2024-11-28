import * as React from "react";

export const useRefreshState = (callback: () => void) => {
  const [refresh, setRefresh] = React.useState(false);

  const handleRefresh = () => {
    setRefresh(true);
    callback();
    setRefresh(false);
  };

  return { refresh, handleRefresh };
};
