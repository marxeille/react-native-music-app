import CommonApiService from './common_api_service';
import TrackApiService from './track_api_service';
import LibraryApiService from './library_api_service';

export default class ApiService {
  commonApiService: CommonApiService;
  trackApiService: TrackApiService;
  libraryApiService: LibraryApiService;

  constructor(commonApiService, trackApiService, libraryApiService) {
    this.commonApiService = commonApiService;
    this.trackApiService = trackApiService;
    this.libraryApiService = libraryApiService;
  }
}
