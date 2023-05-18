import { SearchResponse } from "../types";
import axios from "axios";

const createSearchURL = (term: string) =>
  `https://nominatim.openstreetmap.org/search.php?q=${term}&format=jsonv2&polygon_geojson=1`;

export const searchGeoJson = async (term: string) => {
  const response = await axios.get<SearchResponse[]>(createSearchURL(term));
  return response.data;
};
