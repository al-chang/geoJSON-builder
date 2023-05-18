import { useEffect } from "react";
import { FullScreen } from "ol/control";
import { useMapContext } from "../../contexts/Map/useMapContext";

const FullScreenControl = () => {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;
    const fullScreenControl = new FullScreen({});
    // @ts-ignore
    map.controls.push(fullScreenControl);

    return () => {
      // @ts-ignore
      map.controls.remove(fullScreenControl);
    };
  }, [map]);
  return null;
};
export default FullScreenControl;
