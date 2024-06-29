import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function generatePagination(totalPages, maxDisplay, currentPage) {
  let pagination = [];
  const ellipsis = '...';

  // 如果总页数小于等于要显示的页数，则直接显示所有页数
  if (totalPages <= maxDisplay * 2 + 1) {
    for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
    }
  } else {
    // 显示第一页
    pagination.push(1);

    // 显示两侧最大页数
    let start = Math.max(2, currentPage - maxDisplay);
    let end = Math.min(totalPages - 1, currentPage + maxDisplay);

    if (start > 2) {
      pagination.push(ellipsis);
    }

    for (let i = start; i <= end; i++) {
      pagination.push(i);
    }

    if (end < totalPages - 1) {
      pagination.push(ellipsis);
    }

    // 显示最后一页
    pagination.push(totalPages);
  }

  return pagination;
}

const Element = ({ paginator, element }) => {
  if (typeof element == 'string') {
    return <PaginationEllipsis />
  }


  if (element == paginator.current_page) {
    return <PaginationItem>
      <PaginationLink href={`/?page=${element}`} isActive>{element}</PaginationLink>
    </PaginationItem>
  } else {
    return <PaginationItem>
      <PaginationLink href={`/?page=${element}`}>{element}</PaginationLink>
    </PaginationItem>
  }
}

export function Page({ paginator }) {
  const elements = generatePagination(paginator.last_page, 2, paginator.current_page);
  const firstItem = paginator.count > 0 ? (paginator.current_page - 1) * paginator.per_page + 1 : null;

  return <div className="flex flex-row items-center justify-between mt-6">
    <div>
      <p className="text-sm text-gray-700">
        共
        <span className="font-medium mx-2">{paginator.total}</span>
        条数据，
        显示从
        <span className="font-medium mx-2">{firstItem}</span>
        到
        <span className="font-medium mx-2">{paginator.count > 0 ? firstItem + paginator.count - 1 : null}</span>
        条
      </p>
    </div>
    <Pagination className={'mx-0 w-auto'}>
      <PaginationContent>
        {paginator.current_page == 1
        ? <PaginationItem>
          <PaginationPrevious href={`/?page=1`} />
        </PaginationItem>
        : <PaginationItem>
          <PaginationPrevious href={`/?page=${paginator.current_page - 1}`} />
        </PaginationItem>}

        {elements.map((element, index) => <Element key={index} paginator={paginator} element={element} />)}

        {paginator.current_page < paginator.last_page
        ? <PaginationItem>
          <PaginationNext href={`/?page=${paginator.current_page + 1}`} />
        </PaginationItem>
        : <PaginationItem>
          <PaginationNext href={`/?page=${paginator.last_page}`} />
        </PaginationItem>}
      </PaginationContent>
    </Pagination>
  </div>
}