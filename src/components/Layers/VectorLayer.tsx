import { useEffect } from "react";
import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Style } from "ol/style";
import { Modify, Snap } from "ol/interaction";
import { useMapContext } from "../../contexts/Map/useMapContext";

type VectorLayerProps = {
  source: VectorSource<Geometry>;
  style: Style;
  zIndex?: number;
  editable?: boolean;
  visible?: boolean;
};

const VectorLayer: React.FC<VectorLayerProps> = ({
  source,
  style,
  zIndex = 0,
  editable = false,
  visible = true,
}) => {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) return;
    const vectorLayer = new OLVectorLayer({ source, style });
    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);
    vectorLayer.setVisible(visible);
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, source, style, zIndex, visible]);

  // Add draw interaction
  useEffect(() => {
    if (!editable || !map || !source) return;
    const modify = new Modify({ source: source });
    const snap = new Snap({ source: source });
    map.addInteraction(snap);
    map.addInteraction(modify);

    return () => {
      if (map) {
        map.removeInteraction(modify);
        map.removeInteraction(snap);
      }
    };
  }, [editable, map, source]);

  return null;
};
export default VectorLayer;
