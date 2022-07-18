import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { DataService } from 'src/app/services/data.service';
import { RenovacionesService } from 'src/app/services/renovaciones.service';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../services/alert.service';

const base_url = environment.base_url;

@Component({
  selector: 'app-renovacion',
  templateUrl: './renovacion.component.html',
  styles: [
  ]
})
export class RenovacionComponent implements OnInit {

  public showModal = false;

  public nro_licencia: string;
  public licencia: string;
  public permisionario: any;
  public titular: any;
  public choferes: any[] = [];

  constructor(private renovacionesService: RenovacionesService,
              private dataService: DataService,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Renovaciones';
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
  }

  generarDocumento(): void {
    this.alertService.loading();
    this.renovacionesService.generarDocumento(this.nro_licencia).subscribe({
      next: () => {
        this.showModal = false;
        this.alertService.close();
        window.open(`${base_url}/pdf/documento_taxi.pdf`, '_blank');  
      },
      error: ({error}) => this.alertService.errorApi(error.message)
    })
  }

  obtenerDatos(): void {

    if(!this.licencia || this.licencia.trim() === ''){
      this.alertService.info('Debe colocar un número de licencia');
      return;
    }

    this.renovacionesService.getLicencia(this.licencia).subscribe({
      next: ({licencia}) => {
        const personas: any[] = licencia.datos;
        this.reiniciarFormulario();
        this.showModal = true;
        this.nro_licencia = licencia.nro_licencia;
        personas.map( persona => {
          const {tipo_persona} = persona;
          if(tipo_persona === 'titular') this.titular = persona;
          if(tipo_persona === 'permisionario') this.permisionario = persona;
          if(tipo_persona === 'chofer') this.choferes.push(persona);
        });
      },
      error: ({error}) => {
        this.licencia = '';
        this.alertService.errorApi(error.message) 
      }
      
    })  
  }

  reiniciarFormulario(): void {
    this.nro_licencia = null;
    this.permisionario = null;
    this.titular = null;
    this.choferes = [];
    this.licencia = '';
  }

}
