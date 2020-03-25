import ApiService from '../datasource/api_service';
import CommonApiService from '../datasource/common_api_service';
import TrackApiService from '../datasource/track_api_service';

export const apiService = new ApiService(
  new CommonApiService(),
  new TrackApiService(),
);
