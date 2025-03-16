import axios from "axios";

export const fetchData = async (page:number, apiEndpoint:string) => {
  try {
    const response = await axios.get(apiEndpoint + '?_limit=10&'+ '_page='+ page);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching data" + error);
  }
};