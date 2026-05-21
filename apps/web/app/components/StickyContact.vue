<template>
  <div
    class="sticky-contact fixed z-[90] flex w-max
           bottom-[80px] left-1/2 -translate-x-1/2 flex-row justify-center gap-4 p-2 bg-white/95 backdrop-blur-md shadow-[0_5px_20px_rgba(0,0,0,0.12)] rounded-full
           md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-0 md:flex-col md:gap-1.5 md:p-0 md:bg-transparent md:shadow-none md:backdrop-blur-none md:rounded-none md:translate-x-0"
  >
    <a
      href="tel:+4902862587950"
      class="sticky-btn flex items-center justify-center text-white bg-[#3B82F6] shadow-md transition-all duration-300
             w-12 h-12 rounded-full  hover:bg-[#2563EB]
             md:w-auto md:h-auto md:justify-start md:px-3.5 md:py-2 md:rounded-l-xl md:rounded-r-none"
    >
      <svg
        class="sticky-icon w-5 h-5 md:w-4 md:h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
      <span class="sticky-label hidden md:block text-xs font-medium whitespace-nowrap">Ruf uns an!</span>
    </a>

    <a
      href="mailto:info@komplett-konzept.de"
      class="sticky-btn flex items-center justify-center text-white bg-[#F09F39] shadow-md transition-all duration-300
             w-12 h-12 rounded-full  hover:bg-[#D9822B]
             md:w-auto md:h-auto md:justify-start md:px-3.5 md:py-2 md:rounded-l-xl md:rounded-r-none"
    >
      <svg
        class="sticky-icon w-5 h-5 md:w-4 md:h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span class="sticky-label hidden md:block text-xs font-medium whitespace-nowrap">Schreib uns!</span>
    </a>

    <a
      href="https://wa.me/+4901772711119"
      target="_blank"
      rel="noopener noreferrer"
      class="sticky-btn flex items-center justify-center text-white bg-[#62D071] shadow-md transition-all duration-300
             w-12 h-12 rounded-full  hover:bg-[#4EAA5A]
             md:w-auto md:h-auto md:justify-start md:px-3.5 md:py-2 md:rounded-l-xl md:rounded-r-none"
    >
      <svg
        class="sticky-icon w-5 h-5 md:w-4 md:h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
        />
      </svg>
      <span class="sticky-label hidden md:block text-xs font-medium whitespace-nowrap">Chatte mit uns!</span>
    </a>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .sticky-contact {
    gap: 0.375rem;
  }

  .sticky-label {
    font-size: 0.75rem;
    line-height: 1rem;
    max-width: 400px;
    opacity: 1;
    overflow: hidden;
    transition: max-width 0.3s ease-in-out, opacity 0.2s ease-in-out;
  }
  
  .sticky-btn {
    gap: 0.5rem !important;
    padding: 0.5rem 0.875rem;
    border-radius: 0.75rem 0 0 0.75rem;
  }

  .sticky-icon {
    width: 1rem;
    height: 1rem;
  }
}

@media (min-width: 1367px) {
  .sticky-label {
    font-size: 1.125rem;
  }

  .sticky-btn {
    padding: 0.8rem 0.975rem;
  }
}

@media (min-width: 768px) and (max-width: 1536px) {
  .sticky-contact {
    top: 60%;
  }
}

@media (min-width: 1920px) {
  .sticky-contact {
    gap: clamp(0.5rem, 0.25vw, 1rem);
  }

  .sticky-btn {
    gap: clamp(0.5rem, 0.25vw, 0.9rem) !important;
    padding: clamp(0.55rem, 0.35vw, 1rem) clamp(0.95rem, 0.7vw, 1.6rem);
    border-radius: clamp(0.75rem, 0.3vw, 1.1rem) 0 0 clamp(0.75rem, 0.3vw, 1.1rem);
  }

  .sticky-icon {
    width: clamp(1rem, 0.25vw + 0.8rem, 1.35rem);
    height: clamp(1rem, 0.25vw + 0.8rem, 1.35rem);
  }

  .sticky-label {
    font-size: clamp(0.75rem, 0.2vw + 0.6rem, 1.05rem);
    line-height: 1.2;
  }
}
</style>
