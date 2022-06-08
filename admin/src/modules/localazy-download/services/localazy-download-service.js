import createAxiosInstance from "../../../utils/createAxiosInstance";

const BASE_PATH = "/transfer";
const axiosInstance = createAxiosInstance();

export default class LocalazyDownloadService {
  static async download(data = {}) {
    try {
      const result = await axiosInstance.post(`${BASE_PATH}/download`, data);

      return result.data;
    } catch (e) {
      throw e.data;
    }
  }
}
