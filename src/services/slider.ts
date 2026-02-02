import API from "../utils/api";
import { Slider } from "../types/slider";


export const getSliders = async (): Promise<Slider[]> => {
const res = await API.get("/sliders");
return res.data.data;
};