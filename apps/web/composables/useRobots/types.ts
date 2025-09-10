import type { RobotsStaticPages } from '@plentymarkets/shop-api';

export interface UseRobotState {
  loading: boolean;
  data: RobotsStaticPages;
}

export type GetRobots = () => Promise<RobotsStaticPages>;
export type SetRobotForStaticPage = (staticPageName: string) => void;
export type SetRobots = (data: RobotsStaticPages) => void;

export interface UseRobot {
  data: Readonly<Ref<UseRobotState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getRobots: GetRobots;
  setRobots: SetRobots;
  setRobotForStaticPage: SetRobotForStaticPage;
}

export type UseRobotReturn = () => UseRobot;
