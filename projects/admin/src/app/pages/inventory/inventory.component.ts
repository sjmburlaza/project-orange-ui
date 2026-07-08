import { Component } from '@angular/core';

interface InventoryMetric {
  label: string;
  value: string;
  helper: string;
}

type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

interface InventoryItem {
  sku: string;
  product: string;
  category: string;
  stock: number;
  reorderPoint: number;
  location: string;
  status: InventoryStatus;
  statusLabel: string;
}

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  readonly metrics: readonly InventoryMetric[] = [
    {
      label: 'Active SKUs',
      value: '128',
      helper: 'Across 7 catalog categories',
    },
    {
      label: 'Low stock',
      value: '14',
      helper: 'At or below reorder point',
    },
    {
      label: 'Out of stock',
      value: '3',
      helper: 'Hidden from storefront purchase',
    },
    {
      label: 'Inbound units',
      value: '860',
      helper: 'Expected this week',
    },
  ];

  readonly items: readonly InventoryItem[] = [
    {
      sku: 'OR-PHONE-15-128',
      product: 'Orange Phone 15',
      category: 'Phones',
      stock: 42,
      reorderPoint: 18,
      location: 'Manila WH',
      status: 'in-stock',
      statusLabel: 'In stock',
    },
    {
      sku: 'OR-WATCH-S9-BLK',
      product: 'Orange Watch S9',
      category: 'Wearables',
      stock: 7,
      reorderPoint: 12,
      location: 'Cebu WH',
      status: 'low-stock',
      statusLabel: 'Low stock',
    },
    {
      sku: 'OR-BUDS-PRO-2',
      product: 'Orange Buds Pro',
      category: 'Audio',
      stock: 0,
      reorderPoint: 20,
      location: 'Manila WH',
      status: 'out-of-stock',
      statusLabel: 'Out of stock',
    },
    {
      sku: 'OR-LAPTOP-AIR-13',
      product: 'Orange Laptop Air 13',
      category: 'Computers',
      stock: 24,
      reorderPoint: 10,
      location: 'Davao WH',
      status: 'in-stock',
      statusLabel: 'In stock',
    },
  ];
}
