import API from "../utils/api";
import { Slider } from "../types/slider";


export const getSliders = async (): Promise<Slider[]> => {
const res = await API.get("/sliders");
return res.data.data || [];
};
/** ADMIN – create slider */
export const createSlider = async (formData: FormData): Promise<Slider> => {
  const res = await API.post("/sliders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

/** ADMIN – delete slider */
export const deleteSlider = async (id: string) => {
  const res = await API.delete(`/sliders/${id}`);
  return res.data;
};