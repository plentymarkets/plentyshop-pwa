import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import VariationBulletPoints from "../VariationBulletPoints.vue";
import type { Product } from "@plentymarkets/shop-api";

function createMockProduct(
  values: Record<number, string | Record<string, string>>
): Product {
  return {
    // nur die relevanten Felder
    variationProperties: [
      {
        id: 1,
        name: "BulletPointGroup",
        position: 1,
        description: "",
        properties: Object.entries(values).map(([id, value]) => ({
          id: Number(id),
          cast: "text",
          castId: 0,
          name: "",
          position: 0,
          values: {
            id: Number(id),
            description: "",
            downloadLink: "",
            value: value
          }
        }))
      }
    ]
  } as unknown as Product;
}

describe("VariationBulletPoints.vue", () => {
  it("zeigt alle vorhandenen Bulletpoints an", () => {
    const wrapper = mount(VariationBulletPoints, {
      props: {
        product: createMockProduct({
          427: "Punkt 1",
          428: "Punkt 2",
          429: "Punkt 3"
        }),
        language: "de"
      }
    });

    const li = wrapper.findAll("li");
    expect(li.length).toBe(3);
    expect(li.at(0)!.text()).toBe("Punkt 1");
    expect(li.at(1)!.text()).toBe("Punkt 2");
    expect(li.at(2)!.text()).toBe("Punkt 3");

  });

  it("unterstützt mehrsprachige Bulletpoints", () => {
    const wrapper = mount(VariationBulletPoints, {
      props: {
        product: createMockProduct({
          427: { de: "Deutsch", en: "English" }
        }),
        language: "en"
      }
    });

    const li = wrapper.find("li");
    expect(li.text()).toBe("English");
  });

  it("filtert fehlende Bulletpoints heraus", () => {
    const wrapper = mount(VariationBulletPoints, {
      props: {
        product: createMockProduct({
          427: "Text vorhanden",
          428: "" // leer
        }),
        language: "de"
      }
    });

    const li = wrapper.findAll("li");
    expect(li.length).toBe(1);
    expect(li.at(0)!.text()).toBe("Punkt 1");


  });

  it("zeigt fallback an, wenn keine Bulletpoints vorhanden sind", () => {
    const wrapper = mount(VariationBulletPoints, {
      props: {
        product: createMockProduct({}),
        language: "de",
        fallback: "Keine Informationen"
      }
    });

    expect(wrapper.text()).toContain("Keine Informationen");
  });

  it("zeigt NICHTS an, wenn keine Bulletpoints und kein Fallback existieren", () => {
    const wrapper = mount(VariationBulletPoints, {
      props: {
        product: createMockProduct({}),
        language: "de"
      }
    });

    expect(wrapper.html()).toBe("<!---->");
  });

  it("verwendet die richtige ID-Reihenfolge (427 → 431)", () => {
    const wrapper = mount(VariationBulletPoints, {
      props: {
        product: createMockProduct({
          429: "drittes",
          427: "erstes",
          428: "zweites"
        }),
        language: "de"
      }
    });

    const texts = wrapper.findAll("li").map((li) => li.text());
    expect(texts).toEqual(["erstes", "zweites", "drittes"]);
  });
});
