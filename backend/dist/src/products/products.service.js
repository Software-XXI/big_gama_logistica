"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("../common/providers/repositories/product.repository");
let ProductsService = class ProductsService {
    productsRepo;
    constructor(productsRepo) {
        this.productsRepo = productsRepo;
    }
    async create(dto) {
        return this.productsRepo.create(dto);
    }
    async createMany(products) {
        return this.productsRepo.createMany(products);
    }
    async findAll(activeOnly = true) {
        return this.productsRepo.findAll(activeOnly);
    }
    async findOne(id) {
        const product = await this.productsRepo.findOne(id);
        if (!product) {
            throw new common_1.NotFoundException(`Producto ${id} no encontrado`);
        }
        return product;
    }
    async findBySku(sku) {
        return this.productsRepo.findBySku(sku);
    }
    async update(id, dto) {
        return this.productsRepo.update(id, dto);
    }
    async deactivate(id) {
        return this.productsRepo.deactivate(id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository])
], ProductsService);
//# sourceMappingURL=products.service.js.map