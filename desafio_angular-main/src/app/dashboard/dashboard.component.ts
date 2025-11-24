import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Veiculo } from '../models/veiculo.model';
import { VehicleData } from '../models/vehicleData.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarroVin } from '../utils/carroVinInterface';
import {  Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MenuComponent } from "../menu/menu.component";

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, CommonModule, MenuComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  vehicles: Veiculo[] = [];
  selectedVehicle!: Veiculo;
  vehicleData!: VehicleData;

  carVin!: CarroVin;
  reqVin!: Subscription;
  vehiclesSub?: Subscription;

  selectCarForms = new FormGroup({
    carId: new FormControl(''),
  });

  vinForm = new FormGroup({
    vin: new FormControl(''),
  });

  onChange() {
    this.vinForm.controls.vin.valueChanges.subscribe((value) => {
      this.reqVin = this.dashboardservice
        .buscarVin(value as string)
        .subscribe((res) => {
          this.carVin = res;
        });
    });
  }

  constructor(private dashboardservice: DashboardService) { }

  ngOnInit(): void {
    // Buscar veículos na API
    this.vehiclesSub = this.dashboardservice.getVehicles().subscribe({
      next: (res) => {
        this.vehicles = res.vehicles || [];
        // se tiver veículos, selecionar o primeiro por padrão
        if (this.vehicles.length > 0) {
          const firstId = this.vehicles[0].id;
          this.selectCarForms.controls.carId.setValue(String(firstId));
        }
      },
      error: (err) => {
        console.error('Erro ao buscar veículos:', err);
      }
    });

    // Subscribe para mudar selectedVehicle quando o select alterar
    this.selectCarForms.controls.carId.valueChanges.subscribe((id) => {
      this.selectedVehicle = this.vehicles.find(v => String(v.id) === String(id)) as Veiculo;
      console.log('selectedVehicle changed -> img url:', this.selectedVehicle?.img);
    });

    // ativar observador de VIN
    this.onChange();
  }

  ngOnDestroy(): void {
    try { this.vehiclesSub?.unsubscribe(); } catch (e) {}
    try { this.reqVin?.unsubscribe(); } catch (e) {}
  }

  onImgError(event: Event) {
    const img = event?.target as HTMLImageElement;
    // Substitui por um placeholder local caso a URL original falhe (evita depender de DNS externo)
    if (img) img.src = 'assets/images/placeholder.svg';
  }
}