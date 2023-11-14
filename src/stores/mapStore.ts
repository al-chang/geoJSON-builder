import { TGeometry } from "@/types";
import {
  calculateBoundingBox,
  calculateZoomFromBoundingBox,
  geometryCenter,
} from "@/utils";
import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { create } from "zustand";

type TMapStore = {
  zoom: number;
  center: Coordinate;
  setZoom: (zoom: number) => void;
  setCenter: (coordinate: Coordinate) => void;
  centerOnGeometry: (geometry: TGeometry) => void;
};

const useMapStore = create<TMapStore>()((set) => ({
  zoom: 0,
  center: [0, 0],
  setZoom: (zoom) => set(() => ({ zoom })),
  setCenter: (coordinate) => set(() => ({ center: coordinate })),
  centerOnGeometry: (geometry) => {
    // 1. Find the center point of a geomtry, where we want to center on
    const center = fromLonLat(geometryCenter(geometry));
    // 2.  Find the desired zoom level to center on
    const zoom = calculateZoomFromBoundingBox(calculateBoundingBox(geometry));
    set(() => ({ zoom, center }));
  },
}));

export default useMapStore;
