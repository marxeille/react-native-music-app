import CommonApiService from "./common_api_service";

export default class ApiService {

  commonApiService: CommonApiService;

  constructor(commonApiService) {
    this.commonApiService = commonApiService;
  }

}