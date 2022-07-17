import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RenovacionesService {

  constructor(private http: HttpClient) { }

  // Obtener datos de licencia
  getLicencia(licencia: string): Observable<any>{

    const data = { licencia }

    return this.http.post(`${base_url}/taxis/licencia`, data, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
  
  } 

}
