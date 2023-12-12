import { Strategy } from '../Strategy';

export interface StrategyCheckbox extends Strategy {
  getPropertyCheckboxState(): string;
}
