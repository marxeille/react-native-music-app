import ApiService from "../datasource/api_service";
import CommonApiService from "../datasource/common_api_service";


export const apiService = new ApiService(
  new CommonApiService()
)
