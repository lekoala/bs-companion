import test from "ava";
import "../bs-companion.js";
import BsTabs from "../src/BsTabs.js";
import ResponsiveTable from "../src/ResponsiveTable.js";

test("tabs is registered", (t) => {
  let inst = customElements.get("bs-tabs");
  t.is(inst, BsTabs);
});
test("responsive table is registered", (t) => {
  let inst = customElements.get("responsive-table");
  t.is(inst, ResponsiveTable);
});
