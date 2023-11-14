import { debounce } from "@/utils";
import { useCallback, useState } from "react";

const useDebouncedState = <T>(initialValue: T, timeout: number) => {
  const [state, setState] = useState<T>(initialValue);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetState = useCallback(debounce(setState, timeout), []);

  return [state, debouncedSetState] as const;
};

export default useDebouncedState;
