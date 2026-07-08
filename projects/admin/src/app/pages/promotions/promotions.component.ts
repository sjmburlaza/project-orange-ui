import { Component } from '@angular/core';

interface PromotionMetric {
  label: string;
  value: string;
  helper: string;
}

type PromotionStatus = 'active' | 'scheduled' | 'paused';

interface Promotion {
  code: string;
  name: string;
  type: string;
  value: string;
  window: string;
  redemptions: string;
  revenue: string;
  status: PromotionStatus;
  statusLabel: string;
}

@Component({
  selector: 'app-promotions',
  imports: [],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss',
})
export class PromotionsComponent {
  readonly metrics: readonly PromotionMetric[] = [
    {
      label: 'Active promos',
      value: '6',
      helper: 'Visible to eligible shoppers',
    },
    {
      label: 'Scheduled',
      value: '3',
      helper: 'Queued for upcoming campaigns',
    },
    {
      label: 'Redemptions',
      value: '1,482',
      helper: 'Used in the last 30 days',
    },
    {
      label: 'Promo revenue',
      value: 'PHP 428K',
      helper: 'Attributed order value',
    },
  ];

  readonly promotions: readonly Promotion[] = [
    {
      code: 'ORANGE15',
      name: 'Midyear Essentials',
      type: 'Voucher',
      value: '15% off',
      window: 'Jul 1 - Jul 31',
      redemptions: '612',
      revenue: 'PHP 188K',
      status: 'active',
      statusLabel: 'Active',
    },
    {
      code: 'BUNDLE-UP',
      name: 'Device Bundle Upgrade',
      type: 'Bundle',
      value: 'PHP 2,500 off',
      window: 'Jul 8 - Aug 15',
      redemptions: '284',
      revenue: 'PHP 134K',
      status: 'active',
      statusLabel: 'Active',
    },
    {
      code: 'BACKTOSCHOOL',
      name: 'Back-to-School Preview',
      type: 'Campaign',
      value: '10% off',
      window: 'Aug 1 - Aug 20',
      redemptions: '0',
      revenue: 'PHP 0',
      status: 'scheduled',
      statusLabel: 'Scheduled',
    },
    {
      code: 'FLASH-AUDIO',
      name: 'Audio Flash Drop',
      type: 'Flash sale',
      value: '20% off',
      window: 'Paused',
      redemptions: '92',
      revenue: 'PHP 36K',
      status: 'paused',
      statusLabel: 'Paused',
    },
  ];
}
