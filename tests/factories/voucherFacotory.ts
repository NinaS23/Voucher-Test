import { faker } from "@faker-js/faker";

export function voucherData(boolean) {
    if (boolean) {
        return {
            code: "água",
            discount: "5d"
        }
    } else {
        return {
            code: "a2b455y83u",
            discount: faker.random.numeric(2)
        }
    }
}
