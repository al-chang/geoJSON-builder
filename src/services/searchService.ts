import axios from "axios";
import { TDetailResponse, TSearchResponse } from "../types";

const createSearchURL = (term: string) =>
  `https://nominatim.openstreetmap.org/search.php?q=${term}&format=jsonv2`;

const createDetailURL = (osmID: string) =>
  `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${osmID}&polygon_geojson=1&format=json`;

export const searchGeoJson = async (term: string) => {
  try {
    const response = await axios.get<TSearchResponse[]>(createSearchURL(term));
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const getGeoJson = async (osmID: string) => {
  try {
    const response = await axios.get<TDetailResponse>(createDetailURL(osmID));
    return response.data;
  } catch (e) {
    throw Error(`Unable to retrieve geoJSON for ${osmID}`);
  }
};
