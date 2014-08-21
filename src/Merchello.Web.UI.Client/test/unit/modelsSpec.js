﻿'use strict';

/* jasmine specs for models go here */

describe("Mechello Models", function () {
    var $scope;

    beforeEach(inject(function ($rootScope) {
        $scope = $rootScope.$new();
    }));

    describe("Product.Models.ProductAttribute", function () {
        it("Should create an empty product attribute if there is not productAttributeFromServer", function () {
            var productatt = new merchello.Models.ProductAttribute();
            expect(productatt.key).toBe("");
        });
        it("Should create an populated product attribute if there is a productAttributeFromServer", function () {
            var pafs = { key: "123", optionKey: "321", name: "bane", sortOrder: 6, optionOrder: 7, isRemoved: true };
            var productatt = new merchello.Models.ProductAttribute(pafs);
            expect(productatt.key).toBe("123");
            expect(productatt.optionKey).toBe("321");
            expect(productatt.name).toBe("bane");
            expect(productatt.sortOrder).toBe(6);
            expect(productatt.optionOrder).toBe(6);       //Possible Issue: Needs Review
            expect(productatt.isRemoved).toBe(false);   //Possible Issue: Needs Review
        });

        it("Should return the correct option out of a list of options.", function () {
            var options = [];
            for (var i in [1, 2, 3, 4, 5, 6, 7]) {
                var pofs = { key: i.toString(), name: "bane", required: "aye", sortOrder: 6 };
                //var productopt = new merchello.Models.ProductOption(pofs);
                options.push(pofs);
            }
            var pafs = { key: "123", optionKey: "6", name: "bane", sortOrder: 6, optionOrder: 7, isRemoved: true };
            var productatt = new merchello.Models.ProductAttribute(pafs);
            var option = productatt.findMyOption(options);
            expect(option).not.toBe(undefined);
            expect(option.key).toBe("6");
        });
    });

    describe("Product.Models.ProductOption", function () {
        var productopt;
        var pofs;

        beforeEach(function () {
            pofs = { key: "123", name: "bane", required: "aye", sortOrder: 6 };
            productopt = new merchello.Models.ProductOption(pofs);
        });

        it("Should create an empty product option if there is not productOptionFromServer", function () {
            productopt = new merchello.Models.ProductOption();
            expect(productopt.key).toBe("");
            expect(productopt.required).toBe("");
            expect(productopt.name).toBe("");
            expect(productopt.sortOrder).toBe(1);
            expect(productopt.choices.length).toBe(0);
        });
        it("Should create an populated product option if there is a productOptionFromServer", function () {
            expect(productopt.key).toBe("123");
            expect(productopt.required).toBe("aye");
            expect(productopt.name).toBe("bane");
            expect(productopt.sortOrder).toBe(6);
            expect(productopt.choices.length).toBe(0);
        });

        it("Should add a new choice", function () {
            productopt.addChoice("plane");
            expect(productopt.choices.length).toBe(1);
            expect(productopt.choices[0].sortOrder).toBe(productopt.choices.length);
            expect(productopt.choices[0].optionKey).toBe(productopt.key);
        });

        it("Should remove a choice", function () {
            productopt.addChoice("plane");
            var choice = productopt.removeChoice(0);
            expect(choice).not.toBe(undefined);
            expect(productopt.choices.length).toBe(0);
        });

        it("Should make the sortOrder sync with the order in the choices array", function () {
            productopt.addChoice("plane");
            productopt.choices[0].sortOrder += 3;
            productopt.addChoice("mane");
            productopt.choices[1].sortOrder += 2;
            productopt.addChoice("dane");
            productopt.choices[1].sortOrder += 1;

            productopt.resetChoiceSortOrder();
            for (var i = 0; i < productopt.choices.length; i++) {
                expect(productopt.choices[i].sortOrder).toBe(i + 1);
            }
            
        });

        it("Should check if this choice exists in my choices array", function () {
            productopt.addChoice("plane");
            productopt.choices[0].key = "321"
            var choice = productopt.choices[0];
            productopt.addChoice("fame");
            productopt.choices[1].key = "123"
            var exists = productopt.choiceExists(choice);
            expect(exists).toBe(true);
        });

        it("Should find a choice by name and return it or undefined if not found", function () {
            productopt.addChoice("plane");
            productopt.choices[0].key = "321"
            productopt.addChoice("fame");
            productopt.choices[1].key = "123"
            var choice = productopt.findChoiceByName("plane");
            expect(choice).not.toBe(undefined);
            choice = productopt.findChoiceByName("main");
            expect(choice).toBe(undefined);
        });
    });

    describe("Product.Models.ProductVariant", function () {
        var productvar;
        var pvfs;

        beforeEach(function () {
            var pofs = { key: "123", name: "bane", required: "aye", sortOrder: 6 };
            var pafs = { key: "123", optionKey: "321", name: "bane", sortOrder: 6, optionOrder: 7, isRemoved: true };
            pvfs = {
                key: "123",
                name: "bane",
                productKey: "asdfg",
                sku: "1qa2ws",
                price: 1.00,
                costOfGoods: 2.00,
                salePrice: 3.00,
                onSale: true,
                manufacturer: "Me",
                manufacturerModelNumber: "1234567890",
                weight: 10,
                length: 11,
                width: 12,
                height: 13,
                barcode: "10101010",
                available: false,
                trackInventory: true,
                outOfStockPurchase: true,
                taxable: true,
                shippable: true,
                download: true,
                downloadMediaId: 123890,
                totalInventoryCount: 1000000000,
                attributes : [pafs, pafs],
                attributeKeys: ["123"],
                catalogInventories: []
            };

            productvar = new merchello.Models.ProductVariant(pvfs);
        });

        it("should create an empty product variant", function () {
            productvar = new merchello.Models.ProductVariant();
            expect(productvar).not.toBe(undefined);
            expect(productvar.attributes.length).toBe(0);
            expect(productvar.selected).toBe(false);
            expect(productvar.key).toBe("");
            expect(productvar.name).toBe("");
        });

        it("should create an filled product variant", function () {
            expect(productvar).not.toBe(undefined);
            expect(productvar.attributes.length).toBe(2);
            expect(productvar.catalogInventories.length).toBe(0);
            expect(productvar.selected).toBe(false);
            expect(productvar.key).toBe("123");
            expect(productvar.name).toBe("bane");
        });

        it("should copy from product to create a master variant", function () {
            expect(productvar).not.toBe(undefined);
            var p = { key: "234", name: "same", catalogInventories: [] };
            productvar.copyFromProduct(p);
            expect(productvar.attributes.length).toBe(0);
            expect(productvar.catalogInventories.length).toBe(0);
            expect(productvar.selected).toBe(false);
            expect(productvar.key).toBe("123");
            expect(productvar.productKey).toBe("234");
            expect(productvar.name).toBe("same");
        });

        it("should fix attribute sort orders", function () {
            var pafs = { key: "123", optionKey: "321", name: "bane", sortOrder: 6, optionOrder: 7, isRemoved: true };
            var pofs = { key: "123", name: "bane", required: "aye", sortOrder: 6 };
            var options = [];
            for (var i in [1, 2, 3, 4]) {
                pofs.sortorder = i + 1;
                pafs.optionorder = 4 - i + 1;
                pafs.key += i.toString();
                pafs.name += i.toString();
                options.push(new merchello.Models.ProductOption(pofs));
                productvar.attributes.push(new merchello.Models.ProductAttribute(pafs));
            }
            productvar.fixAttributeSortOrders()
            for (var i in productvar.attributes) {
                expect(i.optionOrder).toBe(i.sortOrder);
            }
        });

        it("should add Attributes As Properties for sorting in a table", function () {
            var pafs = { key: "123", optionKey: "321", name: "bane", sortOrder: 6, optionOrder: 7, isRemoved: true };
            var pofs = { key: "123", name: "bane", required: "aye", sortOrder: 6 };
            var options = [];
            productvar = new merchello.Models.ProductVariant();

            for (var i in [1, 2, 3, 4]) {
                pofs.sortorder = i + 1;
                pafs.optionorder = 4 - i + 1;
                pofs.key = i.toString();
                pofs.name += i.toString();

                pafs.optionKey = i.toString();
                pafs.name += i.toString();
                options.push(new merchello.Models.ProductOption(pofs));
                productvar.attributes.push(new merchello.Models.ProductAttribute(pafs));
            }
            productvar.addAttributesAsProperties(options);

            _.each(options, function (i) {
                expect(productvar[i.name]).not.toBe(undefined);
            });
        });
    });
});