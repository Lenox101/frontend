import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../services/policy.service';
import { Policy } from '../../models/policy.interface';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Insurance Policies</h2>
      
      <!-- Search and Filter -->
      <div class="row mb-3">
        <div class="col-md-6">
          <input
            type="text"
            class="form-control"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterPolicies()"
            placeholder="Search policies..."
          >
        </div>
        <div class="col-md-3">
          <select class="form-control" [(ngModel)]="statusFilter" (ngModelChange)="filterPolicies()">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div class="col-md-3">
          <button class="btn btn-primary" (click)="addNewPolicy()">Add New Policy</button>
        </div>
      </div>

      <!-- Policies Table -->
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Policy Number</th>
            <th>Holder Name</th>
            <th>Type</th>
            <th>Coverage Amount</th>
            <th>Premium Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let policy of filteredPolicies">
            <td>{{ policy.policyNumber }}</td>
            <td>{{ policy.holderName }}</td>
            <td>{{ policy.policyType }}</td>
            <td>KES {{ policy.coverageAmount | number:'1.2-2' }}</td>
            <td>KES {{ policy.premiumAmount | number:'1.2-2' }}</td>
            <td>
              <span [class]="'badge ' + getStatusBadgeClass(policy.status)">
                {{ policy.status }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-primary me-2" (click)="editPolicy(policy)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="deletePolicy(policy.id!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.5em 1em;
    }
    .badge-active {
      background-color: #28a745;
    }
    .badge-expired {
      background-color: #dc3545;
    }
    .badge-cancelled {
      background-color: #6c757d;
    }
  `]
})
export class PolicyListComponent implements OnInit {
  policies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  searchTerm: string = '';
  statusFilter: string = '';

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.filterPolicies();
      },
      error: (error) => console.error('Error loading policies:', error)
    });
  }

  filterPolicies(): void {
    this.filteredPolicies = this.policies.filter(policy => {
      const matchesSearch = !this.searchTerm || 
        policy.policyNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        policy.holderName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || policy.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  editPolicy(policy: Policy): void {
    this.router.navigate(['/policies/edit', policy.id]);
  }

  addNewPolicy(): void {
    this.router.navigate(['/policies/new']);
  }

  deletePolicy(id: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.policyService.deletePolicy(id).subscribe({
        next: () => {
          this.policies = this.policies.filter(p => p.id !== id);
          this.filterPolicies();
        },
        error: (error) => console.error('Error deleting policy:', error)
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'Expired': return 'badge-expired';
      case 'Cancelled': return 'badge-cancelled';
      default: return '';
    }
  }
} 