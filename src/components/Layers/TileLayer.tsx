import { useEffect } from "react";
import OLTileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import { useMapContext } from "../../contexts/Map/useMapContext";

type TileLayerProps = {
  source: TileSource;
  zIndex?: number;
};

const TileLayer: React.FC<TileLayerProps> = ({ source, zIndex = 0 }) => {
  const { map } = useMapContext();
  useEffect(() => {
    if (!map) return;
    const tileLayer = new OLTileLayer({ source, zIndex });
    map.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map, source, zIndex]);
  return null;
};

export default TileLayer;
