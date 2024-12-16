import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  console.log(pathnames)
  const formatPaths = (value: string, isLast : boolean) => {
    if(isLast && value.length === 24){
        return value.slice(1).toUpperCase();
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return (
    <Breadcrumb className="pl-10">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return (<>
            <BreadcrumbItem key={routeTo}>
              {isLast ? (
                <BreadcrumbPage>
                  {formatPaths(value,isLast)}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={routeTo}>
                   {formatPaths(value,isLast)}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
        <BreadcrumbSeparator />
        </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;