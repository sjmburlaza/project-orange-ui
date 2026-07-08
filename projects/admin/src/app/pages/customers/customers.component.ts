import { Component } from '@angular/core';

interface CustomerMetric {
  label: string;
  value: string;
  helper: string;
}

type CustomerStatus = 'vip' | 'active' | 'at-risk';

interface Customer {
  name: string;
  email: string;
  segment: string;
  lastOrder: string;
  orders: number;
  lifetimeValue: string;
  status: CustomerStatus;
  statusLabel: string;
}

@Component({
  selector: 'app-customers',
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  readonly metrics: readonly CustomerMetric[] = [
    {
      label: 'Customers',
      value: '18.4K',
      helper: 'Registered shopper accounts',
    },
    {
      label: 'Repeat rate',
      value: '42%',
      helper: 'Customers with 2+ orders',
    },
    {
      label: 'Loyalty members',
      value: '7.8K',
      helper: 'Opted into rewards',
    },
    {
      label: 'Open cases',
      value: '26',
      helper: 'Awaiting support follow-up',
    },
  ];

  readonly customers: readonly Customer[] = [
    {
      name: 'Ada Santos',
      email: 'ada@example.com',
      segment: 'Loyalty Gold',
      lastOrder: 'Jul 7, 2026',
      orders: 12,
      lifetimeValue: 'PHP 184K',
      status: 'vip',
      statusLabel: 'VIP',
    },
    {
      name: 'Miguel Reyes',
      email: 'miguel@example.com',
      segment: 'Repeat buyer',
      lastOrder: 'Jul 4, 2026',
      orders: 5,
      lifetimeValue: 'PHP 72K',
      status: 'active',
      statusLabel: 'Active',
    },
    {
      name: 'Lina Tan',
      email: 'lina@example.com',
      segment: 'Accessories',
      lastOrder: 'Jun 25, 2026',
      orders: 3,
      lifetimeValue: 'PHP 24K',
      status: 'active',
      statusLabel: 'Active',
    },
    {
      name: 'Noah Lim',
      email: 'noah@example.com',
      segment: 'Win-back',
      lastOrder: 'Apr 18, 2026',
      orders: 2,
      lifetimeValue: 'PHP 18K',
      status: 'at-risk',
      statusLabel: 'At risk',
    },
  ];
}
