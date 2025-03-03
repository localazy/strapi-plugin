import createAxiosInstance from "../../../utils/createAxiosInstance";

const BASE_PATH = "/transfer";
const axiosInstance = createAxiosInstance();

export default class LocalazyUploadService {
  static async upload(data = {}) {
    try {
      const result = await axiosInstance.post(`${BASE_PATH}/upload`, data);

      return result.data;
    } catch (e) {
      throw e.data;
    }
  }
}
