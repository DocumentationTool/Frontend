import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ApiAuth} from '../apiAuth';

describe('ApiAuth Service', () => {
  let service: ApiAuth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiAuth]
    });

    service = TestBed.inject(ApiAuth);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Prüft, ob alle HTTP-Requests abgearbeitet wurden
  });

  // Login-Test mit Mock-Daten
  it('should perform login and return token', () => {
    const mockResponse: { token: string } = { token: 'mock-token'};

    service.login('testuser', 'testpass').subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.token).toBe('mock-token');
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId: 'testuser', password: 'testpass' });

    req.flush(mockResponse);
  });

  //Logout-Test (nur HTTP GET prüfen)
  it('should perform logout', () => {
    service.logout().subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/logout');
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

});
