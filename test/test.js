import test from "ava";
import { default as BsCompanion } from "../bs-companion.js";

test("tabs is registered", (t) => {
  const inst = customElements.get("bs-tabs");
  t.is(inst, BsCompanion.BsTabs);
});
test("responsive table is registered", (t) => {
  const inst = customElements.get("responsive-table");
  t.is(inst, BsCompanion.ResponsiveTable);
});
test("toggle is registered", (t) => {
  const inst = customElements.get("bs-toggle");
  t.is(inst, BsCompanion.BsToggle);
});

//TODO: figure out how to properly import bootstrap to test other things
