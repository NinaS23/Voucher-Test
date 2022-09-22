import prisma from "../../src/config/database";
import { jest } from "@jest/globals";
import * as voucherFactory from "../factories/voucherFacotory";
import voucherService from "./../../src/services/voucherService";
import voucherRepository from "./../../src/repositories/voucherRepository";


jest.mock("./../../src/repositories/voucherRepository");

describe("creation", () => {
    it("should insert a voucher,with a valid input schema", async () => {
        const voucher = voucherFactory.voucherData(false);
        jest.spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce(null);
        
        await voucherService.createVoucher(voucher.code, Number(voucher.discount))
        expect(voucherRepository.getVoucherByCode).toBeCalled();
        expect(voucherRepository.createVoucher).toBeCalled()
    });

    it("should not insert a voucher,with already created voucher", async () => {
       const voucher = voucherFactory.voucherData(false);

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                code: voucher.code,
                discount: voucher.discount
            }
        });
        const result = voucherService.createVoucher(voucher.code,Number(voucher.discount));
        expect(result.catch).toBe(409);
    });

    it("should not insert a voucher,with invalid input voucher", async () => {
        const voucher = voucherFactory.voucherData(true);
 
         jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
             return {
                 code: voucher.code,
                 discount: voucher.discount
             }
         });
         const result = voucherService.createVoucher(voucher.code,Number(voucher.discount));
         expect(result).toBe(422);
     });
});

describe("aplly discount", () => {
    it("should aplly a discount", async () => {
        const amount = 109;
        const voucher = voucherFactory.voucherData(false);
        //just used false can aplly
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: false
            }
        });
        const result = await voucherService.applyVoucher(voucher.code,amount);
        expect(result.amount).toBe(amount)
        expect(result.discount).toBe(voucher.discount)
        expect(result.finalAmount).toEqual( amount - amount * (Number(voucher.discount) / 100))
    });

    it("should`t aplly a discount,because amount is not enough", async () => {
        const amount = 90;
        const voucher = voucherFactory.voucherData(false);
        //just used false can aplly
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: false
            }
        });
        const result = await voucherService.applyVoucher(voucher.code,amount);
        expect(result.amount).toBe(amount)
        expect(result.discount).toBe(voucher.discount)
        expect(result.finalAmount).toEqual(amount)
    });

    it("should`t aplly a discount,because used is true", async () => {
        const amount = 101;
        const voucher = voucherFactory.voucherData(false);
        //just used false can aplly
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: true
            }
        });
        const result = await voucherService.applyVoucher(voucher.code,amount);
        expect(result.amount).toBe(amount)
        expect(result.discount).toBe(voucher.discount)
        expect(result.finalAmount).toEqual(amount)
    });
    
});
