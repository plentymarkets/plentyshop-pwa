import type { RobotsStaticPages } from '@plentymarkets/shop-api';

export interface UseRobotState {
  loading: boolean;
  data: RobotsStaticPages;
}

export type GetRobots = () => Promise<RobotsStaticPages>;
export type SetRobotForStaticPage = (staticPageName: string) => void;

export interface UseRobot {
  data: Readonly<Ref<UseRobotState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getRobots: GetRobots;
  setRobotForStaticPage: SetRobotForStaticPage;
}

export type UseRobotReturn = () => UseRobot;
