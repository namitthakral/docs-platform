import { Briefcase, FileText, Tag, Tags } from "lucide-react"
import { StaticNavigationItem } from "@/components/shared/unified-navigation/unified-navigation.props"
import { getRoute } from "./routes"

export const dashboardNavigationItems: StaticNavigationItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: getRoute.dashboard.home(),
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: "documents",
    name: "Documents",
    href: getRoute.dashboard.documents(),
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "categories",
    name: "Categories",
    href: getRoute.dashboard.categories(),
    icon: <Tag className="w-4 h-4" />,
  },
  {
    id: "tags",
    name: "Tags",
    href: getRoute.dashboard.tags(),
    icon: <Tags className="w-4 h-4" />,
  },
]