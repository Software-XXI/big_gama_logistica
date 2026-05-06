"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoriesModule = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("./repositories/product.repository");
const report_repository_1 = require("./repositories/report.repository");
const user_repository_1 = require("./repositories/user.repository");
const photo_repository_1 = require("./repositories/photo.repository");
let RepositoriesModule = class RepositoriesModule {
};
exports.RepositoriesModule = RepositoriesModule;
exports.RepositoriesModule = RepositoriesModule = __decorate([
    (0, common_1.Module)({
        providers: [
            product_repository_1.ProductRepository,
            report_repository_1.ReportRepository,
            user_repository_1.UserRepository,
            photo_repository_1.PhotoRepository,
        ],
        exports: [
            product_repository_1.ProductRepository,
            report_repository_1.ReportRepository,
            user_repository_1.UserRepository,
            photo_repository_1.PhotoRepository,
        ],
    })
], RepositoriesModule);
//# sourceMappingURL=repositories.module.js.map