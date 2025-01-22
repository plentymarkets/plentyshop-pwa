export interface UseRobotState {
  loading: boolean;
}

export type RobotForStaticPage = (staticPageName: string) => void;

export interface UseRobot {
  loading: Readonly<Ref<boolean>>;
  setRobotForStaticPage: RobotForStaticPage;
}

export type UseRobotReturn = () => UseRobot;