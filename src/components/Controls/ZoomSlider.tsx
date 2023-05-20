import { useEffect } from "react";
import { ZoomSlider as ZoomSliderControl } from "ol/control";
import { useMapContext } from "../../contexts/Map/useMapContext";

const ZoomSlider = () => {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;
    // @ts-ignore
    const zoomSlider = new ZoomSliderControl();
    // @ts-ignore
    map.controls.push(zoomSlider);

    return () => {
      // @ts-ignore
      map.controls.remove(zoomSlider);
    };
  }, [map]);
  return null;
};
export default ZoomSlider;
