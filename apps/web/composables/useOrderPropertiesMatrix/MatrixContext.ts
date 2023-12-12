import { ConcreteStrategyCheckbox } from './strategies/checkbox/ConcreteStrategyCheckbox';
import { ProductPropertyDetails } from '@plentymarkets/shop-api/lib/types/api/product';

export class MatrixContext {
  private strategy: ConcreteStrategyCheckbox;

  constructor(strategy: ConcreteStrategyCheckbox) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: ConcreteStrategyCheckbox) {
    this.strategy = strategy;
  }

  public getPropertyState(page: string, orderProperty: ProductPropertyDetails): string | null {
    this.strategy.setOrderProperty(page, orderProperty);

    if (this.strategy instanceof ConcreteStrategyCheckbox) {
      return this.strategy.getPropertyCheckboxState();
    }

    return null;
  }
}
