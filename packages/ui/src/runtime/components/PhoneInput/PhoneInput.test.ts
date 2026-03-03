import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import PhoneInput from "./PhoneInput.vue";

// Mock useHydrated to return true immediately in tests
vi.mock("../../composables/useHydrated", async () => {
  const { ref } = await import("vue");
  return { useHydrated: () => ref(true) };
});

function mountPhoneInput(props: Record<string, any> = {}) {
  return mount(PhoneInput, {
    props,
    attachTo: document.body,
  });
}

afterEach(() => {
  document.body.innerHTML = "";
});

// ─── Rendering ───────────────────────────────────────────────────
describe("Rendering", () => {
  it("renders the phone input group", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input").exists()).toBe(true);
    expect(wrapper.find(".phone-input__field").exists()).toBe(true);
  });

  it("shows the US flag by default", () => {
    const wrapper = mountPhoneInput();
    const flag = wrapper.find(".phone-input__flag");
    expect(flag.exists()).toBe(true);
    // US flag emoji = regional indicator U + S
    expect(flag.text()).toBe("🇺🇸");
  });

  it("shows +1 dial code by default", () => {
    const wrapper = mountPhoneInput();
    const code = wrapper.find<HTMLInputElement>(".phone-input__code");
    expect(code.element.value).toBe("+1");
  });

  it("renders with custom defaultCountry", () => {
    const wrapper = mountPhoneInput({ defaultCountry: "ES" });
    expect(wrapper.find(".phone-input__flag").text()).toBe("🇪🇸");
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__code").element.value
    ).toBe("+34");
  });

  it("renders with modelValue and parses country", () => {
    const wrapper = mountPhoneInput({ modelValue: "+44771234567" });
    expect(wrapper.find(".phone-input__flag").text()).toBe("🇬🇧");
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__code").element.value
    ).toBe("+44");
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__number").element.value
    ).toBe("771234567");
  });

  it("renders placeholder on phone input", () => {
    const wrapper = mountPhoneInput({ placeholder: "612 345 678" });
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__number").element.placeholder
    ).toBe("612 345 678");
  });

  it("renders the divider", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input__divider").exists()).toBe(true);
  });

  it("renders the chevron icon", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input__chevron").exists()).toBe(true);
  });
});

// ─── Country dropdown ────────────────────────────────────────────
describe("Country dropdown", () => {
  it("dropdown is closed by default", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(false);
  });

  it("opens dropdown on country button click", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(true);
  });

  it("shows search input when searchable (default)", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__search").exists()).toBe(true);
  });

  it("hides search input when searchable is false", async () => {
    const wrapper = mountPhoneInput({ searchable: false });
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__search").exists()).toBe(false);
  });

  it("shows country options in dropdown", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const options = wrapper.findAll(".phone-input__option");
    expect(options.length).toBeGreaterThan(100);
  });

  it("filters countries by search query", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const search = wrapper.find<HTMLInputElement>(".phone-input__search");
    await search.setValue("spain");
    const options = wrapper.findAll(".phone-input__option");
    expect(options.length).toBe(1);
    expect(options[0].find(".phone-input__option-name").text()).toBe("Spain");
  });

  it("filters countries by dial code", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const search = wrapper.find<HTMLInputElement>(".phone-input__search");
    await search.setValue("+34");
    const options = wrapper.findAll(".phone-input__option");
    expect(options.length).toBeGreaterThanOrEqual(1);
    expect(options[0].find(".phone-input__option-code").text()).toBe("+34");
  });

  it("filters countries by ISO code", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const search = wrapper.find<HTMLInputElement>(".phone-input__search");
    await search.setValue("gb");
    const options = wrapper.findAll(".phone-input__option");
    expect(options.length).toBeGreaterThanOrEqual(1);
  });

  it("shows no results message when search has no match", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const search = wrapper.find<HTMLInputElement>(".phone-input__search");
    await search.setValue("zzzzzzz");
    expect(wrapper.find(".phone-input__no-results").exists()).toBe(true);
  });

  it("selects country from dropdown and updates flag + dial code", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const search = wrapper.find<HTMLInputElement>(".phone-input__search");
    await search.setValue("germany");
    const options = wrapper.findAll(".phone-input__option");
    await options[0].trigger("click");

    // Dropdown should close
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(false);

    // Flag and code should update
    expect(wrapper.find(".phone-input__flag").text()).toBe("🇩🇪");
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__code").element.value
    ).toBe("+49");
  });

  it("closes dropdown on Escape key", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(true);
    await wrapper.find(".phone-input__search").trigger("keydown", {
      key: "Escape",
    });
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(false);
  });

  it("toggles dropdown on repeated clicks", async () => {
    const wrapper = mountPhoneInput();
    const btn = wrapper.find(".phone-input__country");
    await btn.trigger("click");
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(true);
    await btn.trigger("click");
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(false);
  });
});

// ─── Dial code sync ──────────────────────────────────────────────
describe("Dial code sync", () => {
  it("auto-selects country when dial code is changed to +44", async () => {
    const wrapper = mountPhoneInput();
    const code = wrapper.find<HTMLInputElement>(".phone-input__code");

    await code.setValue("+44");
    await code.trigger("input");

    expect(wrapper.find(".phone-input__flag").text()).toBe("🇬🇧");
  });

  it("auto-selects country when dial code is changed to +34", async () => {
    const wrapper = mountPhoneInput();
    const code = wrapper.find<HTMLInputElement>(".phone-input__code");

    await code.setValue("+34");
    await code.trigger("input");

    expect(wrapper.find(".phone-input__flag").text()).toBe("🇪🇸");
  });

  it("keeps current country for invalid dial code", async () => {
    const wrapper = mountPhoneInput({ defaultCountry: "US" });
    const code = wrapper.find<HTMLInputElement>(".phone-input__code");

    await code.setValue("+999999");
    await code.trigger("input");

    // Should still show US
    expect(wrapper.find(".phone-input__flag").text()).toBe("🇺🇸");
  });

  it("emits update:country when dial code changes country", async () => {
    const wrapper = mountPhoneInput();
    const code = wrapper.find<HTMLInputElement>(".phone-input__code");

    await code.setValue("+33");
    await code.trigger("input");

    expect(wrapper.emitted("update:country")).toBeTruthy();
    const emissions = wrapper.emitted("update:country")!;
    expect(emissions[emissions.length - 1]).toEqual(["FR"]);
  });
});

// ─── v-model ─────────────────────────────────────────────────────
describe("v-model", () => {
  it("emits update:modelValue on phone number input", async () => {
    const wrapper = mountPhoneInput();
    const number = wrapper.find<HTMLInputElement>(".phone-input__number");

    await number.setValue("5551234");
    await number.trigger("input");

    const emissions = wrapper.emitted("update:modelValue")!;
    expect(emissions).toBeTruthy();
    expect(emissions[emissions.length - 1]).toEqual(["+15551234"]);
  });

  it("emits update:modelValue with correct country code", async () => {
    const wrapper = mountPhoneInput({ defaultCountry: "ES" });
    const number = wrapper.find<HTMLInputElement>(".phone-input__number");

    await number.setValue("612345678");
    await number.trigger("input");

    const emissions = wrapper.emitted("update:modelValue")!;
    expect(emissions[emissions.length - 1]).toEqual(["+34612345678"]);
  });

  it("emits update:modelValue when dial code changes", async () => {
    const wrapper = mountPhoneInput();
    const code = wrapper.find<HTMLInputElement>(".phone-input__code");

    await code.setValue("+44");
    await code.trigger("input");

    const emissions = wrapper.emitted("update:modelValue")!;
    expect(emissions).toBeTruthy();
  });

  it("emits update:country when country is selected from dropdown", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const search = wrapper.find<HTMLInputElement>(".phone-input__search");
    await search.setValue("france");
    const options = wrapper.findAll(".phone-input__option");
    await options[0].trigger("click");

    const emissions = wrapper.emitted("update:country")!;
    expect(emissions).toBeTruthy();
    expect(emissions[emissions.length - 1]).toEqual(["FR"]);
  });
});

// ─── Keyboard navigation ────────────────────────────────────────
describe("Keyboard navigation", () => {
  it("opens dropdown on ArrowDown from trigger", async () => {
    const wrapper = mountPhoneInput();
    await wrapper
      .find(".phone-input__country")
      .trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(true);
  });

  it("opens dropdown on Enter from trigger", async () => {
    const wrapper = mountPhoneInput();
    await wrapper
      .find(".phone-input__country")
      .trigger("keydown", { key: "Enter" });
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(true);
  });

  it("opens dropdown on Space from trigger", async () => {
    const wrapper = mountPhoneInput();
    await wrapper
      .find(".phone-input__country")
      .trigger("keydown", { key: " " });
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(true);
  });

  it("navigates options with ArrowDown", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    const search = wrapper.find(".phone-input__search");
    await search.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const focused = wrapper.findAll(".phone-input__option--focused");
    expect(focused.length).toBe(1);
  });

  it("navigates options with ArrowUp (wraps)", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    const search = wrapper.find(".phone-input__search");
    await search.trigger("keydown", { key: "ArrowUp" });
    await nextTick();

    // Should wrap to last item
    const focused = wrapper.findAll(".phone-input__option--focused");
    expect(focused.length).toBe(1);
  });

  it("selects option with Enter", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    const search = wrapper.find(".phone-input__search");
    // Navigate to second option (Albania)
    await search.trigger("keydown", { key: "ArrowDown" });
    await search.trigger("keydown", { key: "Enter" });

    // Dropdown should close
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(false);
    // Country should have changed
    expect(wrapper.emitted("update:country")).toBeTruthy();
  });

  it("jumps to first option with Home", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    const search = wrapper.find(".phone-input__search");
    await search.trigger("keydown", { key: "ArrowDown" });
    await search.trigger("keydown", { key: "ArrowDown" });
    await search.trigger("keydown", { key: "Home" });
    await nextTick();

    const options = wrapper.findAll(".phone-input__option");
    expect(options[0].classes()).toContain("phone-input__option--focused");
  });

  it("jumps to last option with End", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    const search = wrapper.find(".phone-input__search");
    await search.trigger("keydown", { key: "End" });
    await nextTick();

    const options = wrapper.findAll(".phone-input__option");
    const last = options[options.length - 1];
    expect(last.classes()).toContain("phone-input__option--focused");
  });

  it("closes dropdown on Tab", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    await wrapper.find(".phone-input__search").trigger("keydown", {
      key: "Tab",
    });
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(false);
  });
});

// ─── Accessibility ───────────────────────────────────────────────
describe("Accessibility", () => {
  it("has role=group on container", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input").attributes("role")).toBe("group");
  });

  it("has aria-label on container", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input").attributes("aria-label")).toBe(
      "Phone number"
    );
  });

  it("has aria-haspopup=listbox on country button", () => {
    const wrapper = mountPhoneInput();
    expect(
      wrapper.find(".phone-input__country").attributes("aria-haspopup")
    ).toBe("listbox");
  });

  it("has aria-expanded=false when dropdown is closed", () => {
    const wrapper = mountPhoneInput();
    expect(
      wrapper.find(".phone-input__country").attributes("aria-expanded")
    ).toBe("false");
  });

  it("has aria-expanded=true when dropdown is open", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(
      wrapper.find(".phone-input__country").attributes("aria-expanded")
    ).toBe("true");
  });

  it("has aria-controls pointing to listbox when open", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const listboxId = wrapper
      .find(".phone-input__dropdown")
      .attributes("id");
    expect(
      wrapper.find(".phone-input__country").attributes("aria-controls")
    ).toBe(listboxId);
  });

  it("dropdown has role=listbox", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__dropdown").attributes("role")).toBe(
      "listbox"
    );
  });

  it("options have role=option", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const options = wrapper.findAll(".phone-input__option");
    expect(options[0].attributes("role")).toBe("option");
  });

  it("selected option has aria-selected=true", async () => {
    const wrapper = mountPhoneInput({ defaultCountry: "US" });
    await wrapper.find(".phone-input__country").trigger("click");

    const usOption = wrapper
      .findAll(".phone-input__option")
      .find((o) => o.find(".phone-input__option-name").text() === "United States");
    expect(usOption?.attributes("aria-selected")).toBe("true");
  });

  it("has aria-label on dial code input", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input__code").attributes("aria-label")).toBe(
      "Country calling code"
    );
  });

  it("has aria-label on phone number input", () => {
    const wrapper = mountPhoneInput();
    expect(
      wrapper.find(".phone-input__number").attributes("aria-label")
    ).toBe("Phone number");
  });

  it("has aria-label on country button with country name", () => {
    const wrapper = mountPhoneInput({ defaultCountry: "ES" });
    expect(
      wrapper.find(".phone-input__country").attributes("aria-label")
    ).toBe("Selected country: Spain");
  });

  it("flag has aria-hidden=true", () => {
    const wrapper = mountPhoneInput();
    expect(wrapper.find(".phone-input__flag").attributes("aria-hidden")).toBe(
      "true"
    );
  });

  it("chevron has aria-hidden=true", () => {
    const wrapper = mountPhoneInput();
    expect(
      wrapper.find(".phone-input__chevron").attributes("aria-hidden")
    ).toBe("true");
  });

  it("divider has aria-hidden=true", () => {
    const wrapper = mountPhoneInput();
    expect(
      wrapper.find(".phone-input__divider").attributes("aria-hidden")
    ).toBe("true");
  });

  it("search has aria-label", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__search").attributes("aria-label")).toBe(
      "Search countries"
    );
  });

  it("dropdown has aria-label", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(
      wrapper.find(".phone-input__dropdown").attributes("aria-label")
    ).toBe("Select country");
  });

  it("options have unique id attributes", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const options = wrapper.findAll(".phone-input__option");
    const ids = options.map((o) => o.attributes("id"));
    expect(ids[0]).toBeTruthy();
    // All IDs are unique
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("search input has role=combobox", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__search").attributes("role")).toBe(
      "combobox"
    );
  });

  it("search input has aria-autocomplete=list", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    expect(
      wrapper.find(".phone-input__search").attributes("aria-autocomplete")
    ).toBe("list");
  });

  it("search input has aria-controls pointing to listbox", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    const listboxId = wrapper
      .find(".phone-input__dropdown")
      .attributes("id");
    expect(
      wrapper.find(".phone-input__search").attributes("aria-controls")
    ).toBe(listboxId);
  });

  it("search input has aria-activedescendant pointing to focused option", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    const search = wrapper.find(".phone-input__search");
    const firstOption = wrapper.findAll(".phone-input__option")[0];
    expect(search.attributes("aria-activedescendant")).toBe(
      firstOption.attributes("id")
    );
  });

  it("aria-activedescendant updates on ArrowDown", async () => {
    const wrapper = mountPhoneInput();
    await wrapper.find(".phone-input__country").trigger("click");
    await nextTick();

    const search = wrapper.find(".phone-input__search");
    await search.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const secondOption = wrapper.findAll(".phone-input__option")[1];
    expect(search.attributes("aria-activedescendant")).toBe(
      secondOption.attributes("id")
    );
  });
});

// ─── Disabled / Readonly ─────────────────────────────────────────
describe("Disabled / Readonly", () => {
  it("disables all inputs and button when disabled", () => {
    const wrapper = mountPhoneInput({ disabled: true });

    expect(
      wrapper.find<HTMLButtonElement>(".phone-input__country").element.disabled
    ).toBe(true);
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__code").element.disabled
    ).toBe(true);
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__number").element.disabled
    ).toBe(true);
  });

  it("applies disabled class to container", () => {
    const wrapper = mountPhoneInput({ disabled: true });
    expect(wrapper.find(".phone-input").classes()).toContain(
      "phone-input--disabled"
    );
  });

  it("does not open dropdown when disabled", async () => {
    const wrapper = mountPhoneInput({ disabled: true });
    await wrapper.find(".phone-input__country").trigger("click");
    expect(wrapper.find(".phone-input__dropdown").exists()).toBe(false);
  });

  it("sets readonly on inputs when readonly", () => {
    const wrapper = mountPhoneInput({ readonly: true });
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__code").element.readOnly
    ).toBe(true);
    expect(
      wrapper.find<HTMLInputElement>(".phone-input__number").element.readOnly
    ).toBe(true);
  });

  it("applies readonly class to container", () => {
    const wrapper = mountPhoneInput({ readonly: true });
    expect(wrapper.find(".phone-input").classes()).toContain(
      "phone-input--readonly"
    );
  });
});

// ─── Countries data ──────────────────────────────────────────────
describe("Countries data helpers", () => {
  it("getFlagEmoji returns correct emoji for US", async () => {
    const { getFlagEmoji } = await import("./countries");
    expect(getFlagEmoji("US")).toBe("🇺🇸");
  });

  it("getFlagEmoji returns correct emoji for ES", async () => {
    const { getFlagEmoji } = await import("./countries");
    expect(getFlagEmoji("ES")).toBe("🇪🇸");
  });

  it("findCountryByDialCode finds Spain for +34", async () => {
    const { findCountryByDialCode } = await import("./countries");
    const country = findCountryByDialCode("+34");
    expect(country?.code).toBe("ES");
  });

  it("findCountryByDialCode prioritises US for +1", async () => {
    const { findCountryByDialCode } = await import("./countries");
    const country = findCountryByDialCode("+1");
    expect(country?.code).toBe("US");
  });

  it("findCountryByCode finds UK", async () => {
    const { findCountryByCode } = await import("./countries");
    const country = findCountryByCode("GB");
    expect(country?.name).toBe("United Kingdom");
  });

  it("findCountryByCode is case-insensitive", async () => {
    const { findCountryByCode } = await import("./countries");
    const country = findCountryByCode("gb");
    expect(country?.code).toBe("GB");
  });

  it("countries list is sorted alphabetically", async () => {
    const { countries } = await import("./countries");
    const names = countries.map((c) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});
