const handleArrows = () => {
  const viewport = useViewport();
  return !viewport.isLessThan('md');
};

const applyPaginationStyles = () => {
  const activePagination = document.querySelector('.swiper-pagination-bullet-active');

  if (activePagination) {
    activePagination.classList.add('!bg-primary-500');
  }
};

const onSlideChange = () => {
  const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  paginationBullets.forEach((bullet) => {
    bullet.classList.remove('!bg-primary-500');
  });

  const linkActivePagination = document.querySelector('.swiper-pagination-bullet-active');
  if (linkActivePagination) {
    linkActivePagination.classList.add('!bg-primary-500');
  }
};

export const useCarousel = () => {
  onMounted(() => {
    applyPaginationStyles();
    window.addEventListener('resize', applyPaginationStyles);
  });

  return {
    handleArrows,
    applyPaginationStyles,
    onSlideChange,
  };
};
