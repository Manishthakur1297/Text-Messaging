import { axiosInstance } from "./service/axiosApi";

export const getTop5Results = async (limit, myDateRange = []) => {
  let url = `/users/top5`;
  if (myDateRange.length > 0) {
    let d1 = myDateRange[0];
    let d2 = myDateRange[1];
    url = `/users/top5?date1=${d1}&date2=${d2}`;
  }
  try {
    let res = await axiosInstance.get(url);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getChannels = async () => {
  try {
    let res = await axiosInstance.get("/channels/");
    console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPosts = async (id) => {
  try {
    let res = await axiosInstance.get(`/channels/${id}/posts`);
    console.log(res.data);
    return res.data.posts;
  } catch (error) {
    throw error;
  }
};

export const addPost = async (id, message) => {
  try {
    let res = await axiosInstance.post(`/channels/${id}/posts`, {
      message: message,
    });
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};
