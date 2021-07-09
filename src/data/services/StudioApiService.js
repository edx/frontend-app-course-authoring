import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig([
  'STUDIO_BASE_URL',
], 'Studio API service');

const studioBaseUrl = getConfig().STUDIO_BASE_URL;

class StudioApiService {
  static getProctoredExamSettingsUrl(courseID) {
    return `${studioBaseUrl}/api/contentstore/v1/proctored_exam_settings/${courseID}`;
  }

  static getProctoredExamSettingsData(courseID) {
    const apiClient = getAuthenticatedHttpClient();
    const url = StudioApiService.getProctoredExamSettingsUrl(courseID);
    return apiClient.get(url);
  }

  static saveProctoredExamSettingsData(courseID, dataToSave) {
    const apiClient = getAuthenticatedHttpClient();
    const url = StudioApiService.getProctoredExamSettingsUrl(courseID);
    return apiClient.post(url, dataToSave);
  }

  static getStudioCourseRunUrl(courseID) {
    return `${studioBaseUrl}/course/${courseID}`;
  }
}

export default StudioApiService;
