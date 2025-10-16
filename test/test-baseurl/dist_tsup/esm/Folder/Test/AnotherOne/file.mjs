import { foo } from "./../../../Schemas/a.mjs";
import { baz } from "./../../../Schemas/b.mjs";
const testFunction = () => {
  console.log("Testing baseUrl imports:", foo, baz);
  return { foo, baz };
};
export {
  testFunction
};
//# sourceMappingURL=file.mjs.map