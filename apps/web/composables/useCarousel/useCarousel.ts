import { onMounted, onBeforeUnmount } from 'vue';

const handleArrowsVisibility = () => {
  const nextButton = document.querySelector('.swiper-button-next') as HTMLElement;
  const previousButton = document.querySelector('.swiper-button-prev') as HTMLElement;

  if (window.innerWidth < 768) {
    if (nextButton) nextButton.style.display = 'none';
    if (previousButton) previousButton.style.display = 'none';
  } else {
    if (nextButton) nextButton.style.display = 'block';
    if (previousButton) previousButton.style.display = 'block';
  }
};

const applySwiperStyles = () => {
  const nextButton = document.querySelector('.swiper-button-next');
  const previousButton = document.querySelector('.swiper-button-prev');
  const activePagination = document.querySelector('.swiper-pagination-bullet-active');

  if (nextButton) {
    nextButton.classList.add('!text-primary-500');
  }
  if (previousButton) {
    previousButton.classList.add('!text-primary-500');
  }

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
    handleArrowsVisibility();
    applySwiperStyles();
    window.addEventListener('resize', handleArrowsVisibility);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleArrowsVisibility);
  });

  return {
    handleArrowsVisibility,
    applySwiperStyles,
    onSlideChange,
  };
};
