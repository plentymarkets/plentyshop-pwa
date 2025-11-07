<template>
  <div :style="inlineStyle">
    <v-table density="comfortable" class="item-info-table">
      <tbody>
      <tr
        v-for="row in visibleRows"
        :key="row.key"
        class="item-info-table__row"
      >
        <td class="item-info-table__cell item-info-table__label">
          {{ row.label }}
        </td>
        <td class="item-info-table__cell item-info-table__value">
          {{ row.value }}
        </td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  ItemDataContent,
  ItemDataFieldKey,
  ItemDataFieldLabels,
  ItemDataFieldValues,
} from './types'

const props = defineProps<{
  content: ItemDataContent
  fieldLabels: ItemDataFieldLabels
  fieldValues: ItemDataFieldValues
}>()


const visibleRows = computed(() => {
  const order =
    props.content.fieldsOrder && props.content.fieldsOrder.length
      ? props.content.fieldsOrder
      : (Object.keys(props.fieldLabels) as ItemDataFieldKey[])

  const visibility = props.content.fields || {}

  return order
    .filter((key: ItemDataFieldKey) => visibility[key] ?? true)
    .map((key: ItemDataFieldKey) => ({
      key,
      label: props.fieldLabels[key],
      value: props.fieldValues[key],
    }))
})

const inlineStyle = computed(() => {
  const layout = props.content.layout
  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : undefined,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : undefined,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : undefined,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : undefined,
  }
})
</script>

<style scoped>
.item-info-table {
  border-collapse: separate;
  border-spacing: 0 12px;
}
.item-info-table__row {
  background: #eaeaea;
}
.item-info-table__cell {
  padding: 16px;
  vertical-align: middle;
}
.item-info-table__label {
  width: 40%;
  font-weight: 500;
}
.item-info-table__value {
  width: 60%;
}
</style>
