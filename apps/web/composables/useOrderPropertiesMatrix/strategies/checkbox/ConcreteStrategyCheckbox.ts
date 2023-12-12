import { StrategyCheckbox } from './StrategyCheckbox';
import { ProductPropertyDetails } from '@plentymarkets/shop-api/lib/types/api/product';

export class ConcreteStrategyCheckbox implements StrategyCheckbox {
  private page: string | null = null;
  private orderProperty: ProductPropertyDetails | null = null;

  public setOrderProperty(page: string, orderProperty: ProductPropertyDetails): ConcreteStrategyCheckbox {
    this.page = page;
    this.orderProperty = orderProperty;
    return this;
  }

  getPropertyCheckboxState(): string {
    if (this.page === 'product') {
      //...
    }

    return 'getPropertyCheckboxState';
  }
}
