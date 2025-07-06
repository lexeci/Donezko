// Layout components
export { default as Footer } from "./Footer/Footer";
export { default as Header } from "./Header/Header";
export { default as PageHeader } from "./PageHeader/PageHeader";
export { default as PageLayout } from "./PageLayout/PageLayout";
export { default as Sidebar } from "./Sidebar/Sidebar";

// Offline/Connection states
export { default as NoConnection } from "./NoConnection/NoConnection";

// Homepage specific components
export { default as Banner } from "./Home/banner/Banner";
export { default as Faqs } from "./Home/faqs/Faqs";
export { default as Features } from "./Home/features/Features";
export { default as Welcome } from "./Home/welcome/Welcome";

// Authorization & modal windows
export { default as Authorization } from "./Authorization/Authorization";
export { default as ModalWindow } from "./ModalWindow/ModalWindow";

// Workspace related components and permission handling
export { default as LackPermission } from "./LackPermission/LackPermission";
export { default as NotFoundId } from "./NotFoundId/NotFoundId";
export { default as NotSelected } from "./NotSelected/NotSelected";
export { default as NoOrganization } from "./NoOrganization/NoOrganization";

// Organization related components
export { default as OrganizationElements } from "./Organization/OrganizationElements";
export { default as OrganizationModal } from "./Organization/OrganizationModal";
export { default as OrganizationUpdate } from "./Organization/OrganizationUpdate";
export { default as OrganizationUsers } from "./Organization/OrganizationUsers";

// Project related components
export { default as AddProjectUsers } from "./Project/AddProjectUsers";
export { default as ProjectElements } from "./Project/ProjectElements";
export { default as ProjectUpdate } from "./Project/ProjectUpdate";
export { default as ProjectUsers } from "./Project/ProjectUsers";

// Team related components
export { default as TeamElements } from "./Team/TeamElements";
export { default as TeamUpdate } from "./Team/TeamUpdate";
export { default as TeamUsers } from "./Team/TeamUsers";

// User settings component
export { default as Settings } from "./Settings/Settings";

// Comments component
export { default as Comments } from "./Comments/Comment";

// Dashboard elements and statistics components
export {
  DailyBoardAdvice,
  EntityItem,
  ProjectBoardStatistic,
  StatisticBlock,
  StatisticItem,
  TasksBoardStatistic,
  TasksWindow,
  TeamBoardStatistic,
  Timer,
  TimerRounds,
  WindowContainer,
} from "./Dashboard";
