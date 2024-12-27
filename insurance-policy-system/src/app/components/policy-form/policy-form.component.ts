import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PolicyService } from '../../services/policy.service';
import { Policy } from '../../models/policy.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{ editMode ? 'Edit' : 'Add' }} Insurance Policy</h2>
      
      <form [formGroup]="policyForm" (ngSubmit)="onSubmit()" class="mt-4">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Policy Number</label>
            <input type="text" class="form-control" formControlName="policyNumber">
            <div class="text-danger" *ngIf="policyForm.get('policyNumber')?.touched && policyForm.get('policyNumber')?.invalid">
              Policy number is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Holder Name</label>
            <input type="text" class="form-control" formControlName="holderName">
            <div class="text-danger" *ngIf="policyForm.get('holderName')?.touched && policyForm.get('holderName')?.invalid">
              Holder name is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Policy Type</label>
            <select class="form-control" formControlName="policyType">
              <option value="">Select Type</option>
              <option value="Life">Life Insurance</option>
              <option value="Health">Health Insurance</option>
              <option value="Auto">Auto Insurance</option>
              <option value="Property">Property Insurance</option>
            </select>
            <div class="text-danger" *ngIf="policyForm.get('policyType')?.touched && policyForm.get('policyType')?.invalid">
              Policy type is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Coverage Amount (KES)</label>
            <input type="number" class="form-control" formControlName="coverageAmount">
            <div class="text-danger" *ngIf="policyForm.get('coverageAmount')?.touched && policyForm.get('coverageAmount')?.invalid">
              Valid coverage amount is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Premium Amount (KES)</label>
            <input type="number" class="form-control" formControlName="premiumAmount">
            <div class="text-danger" *ngIf="policyForm.get('premiumAmount')?.touched && policyForm.get('premiumAmount')?.invalid">
              Valid premium amount is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Start Date</label>
            <input type="date" class="form-control" formControlName="startDate">
            <div class="text-danger" *ngIf="policyForm.get('startDate')?.touched && policyForm.get('startDate')?.invalid">
              Start date is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">End Date</label>
            <input type="date" class="form-control" formControlName="endDate">
            <div class="text-danger" *ngIf="policyForm.get('endDate')?.touched && policyForm.get('endDate')?.invalid">
              End date is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Status</label>
            <select class="form-control" formControlName="status">
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div class="text-danger" *ngIf="policyForm.get('status')?.touched && policyForm.get('status')?.invalid">
              Status is required
            </div>
          </div>
        </div>

        <div class="mt-4">
          <button type="submit" class="btn btn-primary me-2" [disabled]="policyForm.invalid">
            {{ editMode ? 'Update' : 'Create' }} Policy
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-label {
      font-weight: 500;
    }
  `]
})
export class PolicyFormComponent implements OnInit {
  policyForm: FormGroup;
  editMode = false;
  currentPolicyId?: number;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.policyForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.currentPolicyId = +params['id'];
        this.loadPolicyData(this.currentPolicyId);
      }
    });
  }

  loadPolicyData(id: number): void {
    this.policyService.getPolicy(id).subscribe({
      next: (policy) => {
        this.policyForm.patchValue({
          policyNumber: policy.policyNumber,
          holderName: policy.holderName,
          policyType: policy.policyType,
          coverageAmount: policy.coverageAmount,
          premiumAmount: policy.premiumAmount,
          startDate: new Date(policy.startDate).toISOString().split('T')[0],
          endDate: new Date(policy.endDate).toISOString().split('T')[0],
          status: policy.status
        });
      },
      error: (error) => {
        console.error('Error loading policy:', error);
        this.router.navigate(['/policies']);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      policyNumber: ['', Validators.required],
      holderName: ['', Validators.required],
      policyType: ['', Validators.required],
      coverageAmount: ['', [Validators.required, Validators.min(0)]],
      premiumAmount: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.policyForm.valid) {
      const policyData: Policy = {
        ...this.policyForm.value,
        startDate: new Date(this.policyForm.value.startDate),
        endDate: new Date(this.policyForm.value.endDate)
      };

      if (this.editMode && this.currentPolicyId) {
        policyData.id = this.currentPolicyId;
        this.policyService.updatePolicy(this.currentPolicyId, policyData).subscribe({
          next: () => this.router.navigate(['/policies']),
          error: (error) => console.error('Error updating policy:', error)
        });
      } else {
        this.policyService.createPolicy(policyData).subscribe({
          next: () => this.router.navigate(['/policies']),
          error: (error) => console.error('Error creating policy:', error)
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/policies']);
  }
} 