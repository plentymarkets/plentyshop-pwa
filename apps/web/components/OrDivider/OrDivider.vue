<template>
    <div class="w-full">
      <div class="flex justify-center w-full">
        <slot name="above"></slot>
      </div>

      <div class="flex items-center justify-center w-full my-2">
        <hr class="flex-grow border-black"/>
        <p class="px-2 text-center">OR</p>
        <hr class="flex-grow border-black"/>
      </div>


      <div class="flex justify-center w-full">
        <slot name="below"></slot>
      </div>
    </div>
  </template>
  
  