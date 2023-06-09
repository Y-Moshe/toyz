import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ButtonModule } from 'primeng/button'

type OrderTotals = {
  itemsCount: number
  shipping: number
  subtotal: number
  total: number
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent {
  @Input() useBasketSummary = false
  @Input() disabled = false
  @Input() itemsCount = 0
  @Input() shipping = 0
  @Input() subtotal = 0
  @Input() total = 0
  @Input() isPlacingOrder = false
  @Input() summaryOnly = false

  @Output() onOrderPlaced = new EventEmitter<OrderTotals>()

  onOrderClick() {
    this.onOrderPlaced.emit({
      itemsCount: this.itemsCount,
      shipping: this.shipping,
      subtotal: this.total,
      total: this.total,
    })
  }
}
