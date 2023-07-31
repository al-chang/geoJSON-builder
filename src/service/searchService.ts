import { TDetailResponse, TGeometry, TSearchResponse } from "../types";
import axios from "axios";

const createSearchURL = (term: string) =>
  `https://nominatim.openstreetmap.org/search.php?q=${term}&format=jsonv2`;

const createDetailURL = (osmID: string) =>
  `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${osmID}&polygon_geojson=1&format=json`;

export const searchGeoJson = async (term: string) => {
  const response = await axios.get<TSearchResponse[]>(createSearchURL(term));
  return response.data;
};

export const getGeoJson = async (osmID: string) => {
  const response = await axios.get<TDetailResponse>(createDetailURL(osmID));
  return response.data;
};
