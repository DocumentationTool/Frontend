import {ApiResponseModelDocumentContent} from './apiResponseModelDocumentContent';

export interface ApiResponseModel {
  message: string;
  error: string;
  content: ApiResponseModelDocumentContent[];
}
