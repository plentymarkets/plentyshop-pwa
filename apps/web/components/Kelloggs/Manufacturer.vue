<template>
  <div class="mt-4">
    <p style="margin-bottom: 0"><strong>Hergestellt von</strong></p>
    <p v-if="manufacturer === 'Pringles'" style="margin-top: 0px">
      UMA Investments SP. Z O.O., UL: WSCHODNIA 3, 99-300 KUTNO, Polonia; WMB Pringles BVBA/SPRL, Eggestraat 1, 2800
      Mechelen, Belgia
    </p>
    <p v-else-if="isFanartikel" style="margin-top: 0px">Nostalgic-Art Merchandising GmbH</p>
    <p v-else style="margin-top: 0px">
      Kellogg Europe Trading Limited, Three, Dublin Airport Central, Dublin Airport, Dublin, Ireland, K67 Y7E5
    </p>
  </div>
</template>

<script>
export default {
  props: {
    manufacturer: {
      type: String,
      required: true,
    },
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isFanartikel() {
      return this.product.tags?.includes('Fanartikel') || false;
    },
  },
};
</script>