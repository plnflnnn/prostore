'use client';

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const paramName = urlParamName || "page";
  const currentPage = Number(searchParams.get(paramName) ?? page) || 1;

  const handlePageChange = (btnType: string) => {
    const pageValue = btnType === 'prev' ? currentPage - 1 : currentPage + 1;
    const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: paramName,
        value: pageValue.toString(),
        pathname,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex gap-2">
        <Button type="button" size="lg" variant="outline" disabled={currentPage <= 1} className="w-28" onClick={() => handlePageChange('prev')}>
            Previous
        </Button>
        <Button type="button" size="lg" variant="outline" disabled={currentPage >= totalPages} className="w-28" onClick={() => handlePageChange('next')}>
            Next
        </Button>
    </div>
  );
};

export default Pagination;
