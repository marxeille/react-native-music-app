import CommonApiService from './common_api_service';
import TrackApiService from './track_api_service';

export default class ApiService {
  commonApiService: CommonApiService;
  trackApiService: TrackApiService;

  constructor(commonApiService, trackApiService) {
    this.commonApiService = commonApiService;
    this.trackApiService = trackApiService;
  }
}
